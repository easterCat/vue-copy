let depid = 0;
class Dep {
  constructor(options) {
    this.id = depid++;
    this.key = options.key ? options.key : '';
    this.subs = [];
  }

  addSub(watcherInstance) {
    this.subs.push(watcherInstance);
  }

  removeSub(watcherInstance) {
    if (this.subs.indexOf(watcherInstance) !== -1) {
      this.subs.splice(index, 1);
    }
  }

  depend() {
    // Dep.target 指向的是 watcherInstance
    Dep.target && Dep.target.addDep(this);
  }

  notify() {
    const subs = this.subs.slice();
    subs.forEach(sub => {
      sub.update();
    });
  }

}
Dep.target = null;

function observer(data) {
  if (data !== null && typeof data === 'object') {
    return new Observer(data);
  }

  return;
}
class Observer {
  constructor(data) {
    this.data = data;
    this.walk(data);
  }

  walk(data) {
    Object.entries(data).forEach(([key, value], index) => {
      this.convert(key, value);
    });
  }

  convert(key, val) {
    this.defineReactive(this.data, key, val);
  }

  defineReactive(data, key, value) {
    const dep = new Dep({
      key
    });
    observer(value);
    Object.defineProperty(data, key, {
      enumerable: true,
      configurable: true,
      get: function () {
        if (Dep.target) {
          dep.depend();
        }

        return value;
      },
      set: function (newValue) {
        if (value === newValue) return;
        value = newValue;
        observer(newValue);
        dep.notify();
      }
    });
  }

}

class Watcher {
  constructor(vm, expOrFn, cb, options) {
    this.vm = vm; // lazy 表示一种固定描述，不可改变，表示这个 watcher 需要缓存

    this.lazy = options && options.lazy; // dirty 表示缓存是否可用，如果为 true，表示缓存脏了，需要重新计算，否则不用

    this.dirty = options && options.lazy;
    this.expOrFn = expOrFn;
    this.cb = cb;
    this.depIds = {};
    this.deps = [];

    if (typeof expOrFn === 'function') {
      this.getter = expOrFn;
    } else {
      this.getter = this.parseGetter(expOrFn.trim());
    }

    this.value = this.lazy ? undefined : this.get();
  }

  update() {
    let value = this.get();
    let oldValue = this.value; // 当通知 computed 更新的时候，就只是 把 dirty 设置为 true，从而 读取 comptued 时，便会调用 evalute 重新计算

    if (this.lazy) this.dirty = true;

    if (value !== oldValue) {
      this.value = value;
      this.cb.call(this.vm, value, oldValue);
    }
  }

  addDep(dep) {
    if (!this.depIds.hasOwnProperty(dep.id)) {
      dep.addSub(this);
      this.depIds[dep.id] = dep;
      this.deps.push(dep);
    }
  }

  get() {
    Dep.target = this;
    const value = this.getter.call(this.vm, this.vm);
    Dep.target = null;
    return value;
  }

  depend() {
    let i = this.deps.length;

    while (i--) {
      this.deps[i].depend();
    }
  }

  evaluate() {
    this.value = this.get(); // 执行完更新函数之后，立即重置标志位

    this.dirty = false;
  }

  parseGetter(exp) {
    if (/[^\w.$]/.test(exp)) return;
    var exps = exp.split('.');
    return function (obj) {
      for (var i = 0, len = exps.length; i < len; i++) {
        if (!obj) return;
        obj = obj[exps[i]];
      }

      return obj;
    };
  }

}

class Compile {
  constructor(el, vm) {
    this.$vm = vm;
    this.$el = el.nodeType === 1 ? el : document.querySelector(el);

    if (this.$el) {
      this.$fragment = this.nodeToFragment(this.$el);
      this.compile(this.$fragment);
      this.$el.appendChild(this.$fragment);
    }
  }

  nodeToFragment(el) {
    let fragment = document.createDocumentFragment();
    let child;

    while (child = el.firstChild) {
      fragment.appendChild(child);
    }

    return fragment;
  }

  compile(fragment) {
    let childNodes = fragment.childNodes;

    let _this = this;

    Array.prototype.slice.call(childNodes).forEach(node => {
      let text = node.textContent;
      let reg = /\{\{(.*)\}\}/; // 表达式文本

      if (node.nodeType === 1) {
        _this.compileElement(node);
      }

      if (node.nodeType === 3 && reg.test(text)) {
        compileUtil.text(node, this.$vm, RegExp.$1);
      }

      if (node.childNodes && node.childNodes.length) {
        _this.compile(node);
      }
    });
  }

  compileElement(element) {
    const attrs = element.attributes;

    const _this = this;

    Array.prototype.slice.call(attrs).forEach(attr => {
      let attrName = attr.name;
      let attrValue = attr.value; // 如 <span v-text="content"></span> 中指令为 v-text

      if (attrName.indexOf('v-') === 0) {
        let dir = attrName.substring(2); // 绑定methods

        if (dir.indexOf('on') === 0) {
          compileUtil.eventHandler(element, _this.$vm, attrValue, dir);
        } else {
          compileUtil[dir] && compileUtil[dir](element, _this.$vm, attrValue);
        }

        element.removeAttribute(attrName);
      }
    });
  }

}
const compileUtil = {
  text: function (node, vm, exp) {
    this.bind(node, vm, exp, 'text');
  },
  html: function (node, vm, exp) {
    this.bind(node, vm, exp, 'html');
  },
  model: function (node, vm, exp) {
    this.bind(node, vm, exp, 'model');

    let _this = this;

    let val = _this._getVMVal(vm, exp);

    node.addEventListener('input', function (e) {
      let newValue = e.target.value;

      if (val === newValue) {
        return;
      }

      _this._setVMVal(vm, exp, newValue);

      val = newValue;
    });
  },
  class: function (node, vm, exp) {
    this.bind(node, vm, exp, 'class');
  },
  bind: function (node, vm, exp, dir) {
    let updaterFn = updater[dir + 'Updater'];
    updaterFn && updaterFn(node, this._getVMVal(vm, exp, dir));
    new Watcher(vm, exp, function (value, oldValue) {
      updaterFn && updaterFn(node, value, oldValue);
    });
  },
  eventHandler: function (node, vm, exp, dir) {
    let eventType = dir.split(':')[1];
    let fn = vm.options.methods && vm.options.methods[exp];

    if (eventType && fn) {
      node.addEventListener(eventType, fn.bind(vm), false);
    }
  },
  _getVMVal: function (vm, exp, dir) {
    let val = vm;
    exp.split('.').forEach(function (k) {
      val = val[k.trim()];
    });
    return val;
  },
  _setVMVal: function (vm, exp, value) {
    let val = vm;
    exp = exp.split('.');
    exp.forEach(function (k, i) {
      // 非最后一个key，更新val的值
      if (i < exp.length - 1) {
        val = val[k];
      } else {
        val[k] = value;
      }
    });
  }
};
const updater = {
  textUpdater: function (node, value) {
    node.textContent = typeof value == 'undefined' ? '' : value;
  },
  htmlUpdater: function (node, value) {
    node.innerHTML = typeof value == 'undefined' ? '' : value;
  },
  classUpdater: function (node, value, oldValue) {
    let className = node.className;
    className = className.replace(oldValue, '').replace(/\s$/, '');
    let space = className && String(value) ? ' ' : '';
    node.className = className + space + value;
  },
  modelUpdater: function (node, value, oldValue) {
    node.value = typeof value == 'undefined' ? '' : value;
  }
};

function isUndef(v) {
  return v === undefined || v === null;
}
function isDef(v) {
  return v !== undefined && v !== null;
}
function isTrue(v) {
  return v === true;
}

function Vnode(tag, data, children, text, element) {
  this.tag = tag; // 标签名

  this.data = data; // 存储节点的属性，class，style 等

  this.children = children; // 子元素

  this.text = text; // 文本内容

  this.element = element; // Dom 节点

  this.isStatic = false; // 是否静态节点

  this.isComment = false; // 是否注释节点

  this.key = data && data.key;
  this.componentInstance = undefined;
}

function createVnode(tag, data, children) {
  return new Vnode(tag, data, normalizeChildren(children), undefined, undefined);
}
function createTextNode(val) {
  return new Vnode(undefined, undefined, undefined, String(val));
}
function emptyNodeAt(elm) {
  return new Vnode(elm.tagName.toLowerCase(), {}, [], undefined, elm);
} // 生成VNode 的时候，并不存在真实 DOM,element 会在需要创建DOM 时完成赋值，具体函数在 createElement 中

function createElement(vnode) {
  if (!vnode) return;
  const {
    tag,
    data,
    children
  } = vnode; // tag是正常html标签

  if (tag) {
    vnode.element = document.createElement(tag);

    if (data.attrs) {
      for (let key in data.attrs) {
        vnode.element.setAttribute(key, data.attrs[key]);
      }
    }

    if (children) {
      createChildren(vnode, children);
    }
  } else {
    vnode.element = document.createTextNode(vnode.text);
  }

  return vnode.element;
}

function normalizeChildren(children) {
  if (typeof children === "string") {
    return [createTextNode(children)];
  }

  return children;
}

function createChildren(vnode, children) {
  const l = children.length;

  for (let index = 0; index < l; index++) {
    vnode.element.appendChild(createElement(children[index]));
  }
}

function sameVnode(vnode1, vnode2) {
  return vnode1.key === vnode2.key && vnode1.tag === vnode2.tag && vnode1.isComment === vnode2.isComment && isDef(vnode1.data) && isDef(vnode2.data);
}

function patch(oldVnode, vnode) {
  // 当新节点不存在
  if (isUndef(vnode)) {

    return;
  } // 当旧节点不存在,直接插入新节点


  if (isUndef(oldVnode)) {
    createElement(vnode);
  } else {
    const isRealElement = isDef(oldVnode.nodeType);

    if (!isRealElement && sameVnode(oldVnode, vnode)) {
      // 都为虚拟节点且同类型
      patchVnode(oldVnode, vnode);
    } else {
      if (isRealElement) {
        oldVnode = emptyNodeAt(oldVnode);
      }

      const element = oldVnode.element;
      const parent = element.parentNode;

      if (parent) {
        createElement(vnode);
        parent.insertBefore(vnode.element, element);
        parent.removeChild(element);
      }
    }
  }
}
function patchVnode(oldVnode, vnode) {
  // 当新旧节点完全相同
  if (oldVnode === vnode) {
    return;
  }

  const element = vnode.element = oldVnode.element;

  if (isTrue(oldVnode) && isTrue(vnode) && vnode.key === oldVnode.key) {
    vnode.componentInstance = oldVnode.componentInstance;
    return;
  }

  console.log("vnode :>> ", vnode);

  if (isUndef(vnode.text)) {
    if (isDef(oldVnode.children) && isDef(vnode.children)) {
      if (oldVnode.children !== vnode.children) {
        updateChildren(element, oldVnode.children, vnode.children);
      }
    } else if (isDef(vnode.children)) {
      if (isDef(oldVnode.text)) {
        element.textConent = "";
      }

      addVnodes(element);
    } else if (isDef(oldVnode.children)) ; else if (isDef(oldVnode.text)) {
      element.textConent = "";
    }
  } else {
    // 新旧节点上的文本节点不一致，更新新节点上的 DOM
    element.textContent = vnode.text;
  }
}
function updateChildren(parentElement, oldChild, newChild) {
  let newStartIndex = 0;
  let newEndIndex = newChild.length - 1;
  let newStartVnode = newChild[newStartIndex];
  let newEndVnode = newChild[newEndIndex];
  let oldStartIndex = 0;
  let oldEndIndex = oldChild.length - 1;
  let oldStartVnode = oldChild[oldStartIndex];
  let oldEndVnode = oldChild[oldEndIndex];

  while (newStartIndex <= newEndIndex && oldStartIndex <= oldEndIndex) {
    if (isUndef(oldStartVnode)) {
      oldStartVnode = oldChild[++oldStartIndex];
    } else if (isUndef(oldEndVnode)) {
      oldEndVnode = oldChild[--oldEndIndex];
    } else if (sameVnode(oldStartVnode, newStartVnode)) {
      patchVnode(oldStartVnode, newStartVnode);
      oldStartVnode = oldChild[++oldStartIndex];
      newStartVnode = newChild[++newStartIndex];
    } else if (sameVnode(oldEndVnode, newEndVnode)) {
      patchVnode(oldEndVnode, newEndVnode);
      oldEndVnode = oldChild[--oldEndIndex];
      newEndVnode = newChild[--newEndIndex];
    } else if (sameVnode(oldStartVnode, newEndVnode)) {
      patchVnode(oldStartVnode, newEndVnode);
      parentElement.insertBefore(oldStartVnode.element, oldEndVnode.element.nextSibling());
      oldStartVnode = oldChild[++oldStartIndex];
      newEndVnode = newChild[--newEndIndex];
    } else if (sameVnode(oldEndVnode, newStartVnode)) {
      patchVnode(oldEndVnode, newStartVnode);
      parentElement.insertBefore(oldEndVnode.element, oldStartVnode.element);
      oldEndVnode = oldChild[--oldEndIndex];
      newStartVnode = newChild[++newStartIndex];
    } else {
      createElement(newStartVnode);
      newStartVnode = newChild[++newStartIndex];
    }
  }
}

function addVnodes(element) {
  return createElement(element);
}

class EVue {
  constructor(options) {
    this.options = options || {};
    this.data = options.data;
    this.el = options.el || "body";
    this.__patch__ = patch;
    this.patch = patch;
    this.initState(); // 初始化data,method,computed,watch

    this.$mount(document.getElementById("render"));
    callHook(this, "beforeMount");
    this._isMounted = true;
    this.$compile = new Compile(this.el, this);
    callHook(this, "mounted");
  }

  initState() {
    const vm = this;
    const ops = vm.options;
    this.initLifecycle(vm);
    callHook(vm, "beforeCreate");
    ops.data && vm.initData();
    ops.methods && vm.initMethods();
    ops.computed && vm.initComputed();
    callHook(vm, "created");
  }

  initData() {
    const vm = this;
    const data = vm.options.data; // 通过Object.defineProperty 实现 vm.xxx -> vm._data.xxx

    Object.keys(data).forEach(function (key) {
      vm.$proxyData(key);
    });
    observer(this.data);
  }

  initMethods() {
    const vm = this;
    const methods = vm.options.methods;

    for (let key in methods) {
      vm[key] = methods[key].bind(vm);
    }
  }

  initComputed() {
    const vm = this;
    const computed = vm.options.computed;

    for (let key in computed) {
      const userDef = computed[key]; // 获取用户定义的属性

      vm.defineComputed(vm, key, userDef);
    }
  }

  defineComputed(vm, key, userDef) {
    const def = {
      enumerable: true,
      configurable: true
    };
    def.get = makeComputedGetter(userDef, vm);
    def.set = userDef.set ? userDef.set : function () {};
    Object.defineProperty(vm, key, def);
  }

  initLifecycle(vm) {
    vm._isMounted = false;
    vm._isDestroyed = false;
    vm._isBeingDestroyed = false;
  }

  $mount(element) {
    const vm = this;
    const vnode = vm.render();
    vm.$el = element;
    vm.update(vnode);
  }

  update(vnode) {
    const vm = this;
    const prevVnode = vm._vnode;
    vm._vnode = vnode;
    vm._isMounted && callHook(vm, "beforeUpdate");

    if (!prevVnode) {
      // 第一次将vue实例挂载到dom节点
      vm.$el = vm.__patch__(vm.$el, vnode);
    } else {
      // 节点的更新，diff的起点
      vm.$el = vm.__patch__(prevVnode, vnode);
    }

    callHook(vm, "updated");
  }

  $destroy() {
    callHook(vm, "beforeDestroy");
    vm._isBeingDestroyed = true;
    vm._isDestroyed = true;
    callHook(vm, "destroyed");
  }

  render() {
    const vm = this;
    return vm.options.render.call(vm);
  }

  $watch(key, cb, options) {
    new Watcher(this, key, cb);
  }

  $proxyData(key) {
    const vm = this;
    Object.defineProperty(vm, key, {
      configurable: false,
      enumerable: true,
      get: function () {
        return vm.data[key];
      },
      set: function (newVal) {
        vm.data[key] = newVal;
      }
    });
  }

}

function makeComputedGetter(getter, vm) {
  const watcher = new Watcher(vm, getter, function () {}, {
    lazy: true
  });
  return function computedGetter() {
    // 缓存控制
    if (watcher.dirty) {
      watcher.evaluate();
    }

    if (Dep.target) {
      watcher.depend();
    }

    return watcher.value;
  };
}

function callHook(vm, hook) {
  const handlers = vm.options[hook];
  handlers && handlers.call(vm);
}

EVue.createVnode = createVnode;
EVue.version = "1.0.1";

export default EVue;
//# sourceMappingURL=eVue.esm.js.map
