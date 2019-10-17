class Compile {
  constructor(el, vm) {
    this.$vm = vm;
    this.$el = this.isElementNode(el) ? el : document.querySelector(el);
    if (this.$el) {
      this.$fragment = this.node2fragment(this.$el);
      this.init();
      this.$el.appendChild(this.$fragment);
    }
  }
  init() {
    this.compileElement(this.$fragment);
  }
  node2fragment(el) {
    let fragment = document.createDocumentFragment();
    let child;
    while ((child = el.firstChild)) {
      fragment.appendChild(child);
    }
    return fragment;
  }
  compileElement(fragment) {
    let childNodes = fragment.childNodes;
    let _this = this;

    Array.prototype.slice.call(childNodes).forEach(node => {
      let text = node.textContent;
      let reg = /\{\{(.*)\}\}/;
      if (_this.isElementNode(node)) {
        _this.compile(node);
      } else if (_this.isTextNode(node) && reg.test(text)) {
        _this.compileText(node, RegExp.$1);
      }
      if (node.childNodes && node.childNodes.length) {
        _this.compileElement(node);
      }
    });
  }
  compile(node) {
    let attrs = node.attributes;
    let _this = this;
    Array.prototype.slice.call(attrs).forEach(attr => {
      // 绑定指令
      let attrName = attr.name;
      if (_this.isDirective(attrName)) {
        let exp = attr.value;
        let dir = attrName.substring(2);
        if (_this.isEventDirective(dir)) {
          compileUtil.eventHandler(node, _this.$vm, exp, dir);
        } else {
          compileUtil[dir] && compileUtil[dir](node, _this.$vm, exp);
        }
        node.removeAttribute(attrName);
      }
    });
  }
  compileText(node, exp) {
    compileUtil.text(node, this.$vm, exp);
  }
  isElementNode(node) {
    return node.nodeType === 1;
  }
  isTextNode(node) {
    return node.nodeType === 3;
  }
  isDirective(attr) {
    return attr.indexOf("v-") === 0;
  }
  isEventDirective(dir) {
    return dir.indexOf("on") === 0;
  }
}

let compileUtil = {
  text: function(node, vm, exp) {
    this.bind(node, vm, exp, "text");
  },
  html: function(node, vm, exp) {
    this.bind(node, vm, exp, "html");
  },
  model: function(node, vm, exp) {
    this.bind(node, vm, exp, "model");

    let _this = this;
    let val = _this._getVMVal(vm, exp);
    node.addEventListener("input", function(e) {
      let newValue = e.target.value;
      if (val === newValue) {
        return;
      }

      _this._setVMVal(vm, exp, newValue);
      val = newValue;
    });
  },
  class: function(node, vm, exp) {
    this.bind(node, vm, exp, "class");
  },
  bind: function(node, vm, exp, dir) {
    let updaterFn = updater[dir + "Updater"];

    updaterFn && updaterFn(node, this._getVMVal(vm, exp));

    new Watcher(vm, exp, function(value, oldValue) {
      updaterFn && updaterFn(node, value, oldValue);
    });
  },
  eventHandler: function(node, vm, exp, dir) {
    let eventType = dir.split(":")[1],
      fn = vm.$options.methods && vm.$options.methods[exp];

    if (eventType && fn) {
      node.addEventListener(eventType, fn.bind(vm), false);
    }
  },
  _getVMVal: function(vm, exp) {
    let val = vm;
    exp = exp.split(".");
    exp.forEach(function(k) {
      val = val[k];
    });
    return val;
  },

  _setVMVal: function(vm, exp, value) {
    let val = vm;
    exp = exp.split(".");
    exp.forEach(function(k, i) {
      // 非最后一个key，更新val的值
      if (i < exp.length - 1) {
        val = val[k];
      } else {
        val[k] = value;
      }
    });
  }
};

let updater = {
  textUpdater: function(node, value) {
    node.textContent = typeof value == "undefined" ? "" : value;
  },
  htmlUpdater: function(node, value) {
    node.innerHTML = typeof value == "undefined" ? "" : value;
  },
  classUpdater: function(node, value, oldValue) {
    let className = node.className;
    className = className.replace(oldValue, "").replace(/\s$/, "");
    let space = className && String(value) ? " " : "";
    node.className = className + space + value;
  },
  modelUpdater: function(node, value, oldValue) {
    node.value = typeof value == "undefined" ? "" : value;
  }
};
