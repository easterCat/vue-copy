# Vue

## 几种实现双向绑定的做法

目前几种主流的 mvc(vm)框架都实现了单向数据绑定,而我所理解的双向数据绑定无非就是在单向绑定的基础上给可输入元素（input、textare 等）添加了 change(input)事件,来动态修改 model 和 view,并没有多高深。所以无需太过介怀是实现的单向或双向绑定。

实现数据绑定的做法有大致如下几种：

- 发布者-订阅者模式（backbone.js）
- 脏值检查（angular.js）
- 数据劫持（vue.js）

发布者-订阅者模式: 一般通过 sub, pub 的方式实现数据和视图的绑定监听,更新数据方式通常做法是 vm.set('property', value)

现在更希望通过 vm.property = value 这种方式更新数据,同时自动更新视图,于是有了下面两种方式

脏值检查: angular.js 是通过脏值检测的方式比对数据是否有变更,来决定是否更新视图,最简单的方式就是通过 setInterval() 定时轮询检测数据变动,当然 Google 不会这么 low,angular 只有在指定的事件触发时进入脏值检测,大致如下：

- DOM 事件,譬如用户输入文本,点击按钮等。( ng-click )
- XHR 响应事件 ( \$http )
- 浏览器 Location 变更事件 ( \$location )
- Timer 事件( $timeout , $interval )
- 执行 $digest() 或 $apply()

数据劫持: vue.js 则是采用数据劫持结合发布者-订阅者模式的方式,通过 Object.defineProperty()来劫持各个属性的 setter,getter,在数据变动时发布消息给订阅者,触发相应的监听回调。

## vue 基本构成

- Observer 数据监听器,对数据的所有属性进行监听,数据变动时拿到变动值并且通知订阅者
- Compiler 指令解析器,对每个元素节点的指令进行扫描和解析,根据指令模板替换数据,并绑定相应的更新函数
- Watcher 链接 Observer 和 Compiler,能够订阅并且收到每个属性变动的通知,执行指令绑定的回调函数
- vue 入口函数

![](https://raw.githubusercontent.com/easterCat/img-package/master/img/2.png)

## 监听器 Observer

- 利用 Obeject.defineProperty()来对数据对象的所有属性进行监听
- observer 将数据对象 data 进行递归遍历,添加上 setter 和 getter
- 当 data 赋值或者取值的时候就能触发相应的回调函数

```js
function observer(data) {
  if (data !== null && typeof data === 'object') {
    return new Observer(data);
  }
  return;
}

function Observer(data) {
  this.data = data;
  this.walk(data);
}

Observer.prototype.walk = function(data) {
  Object.entries(data).forEach(([key, value], index) => {
    this.convert(key, value);
  });
};

Observer.prototype.convert = function(key, val) {
  this.defineReactive(this.data, key, val);
};

Observer.prototype.defineReactive = function(data, key, value) {
  const dep = new Dep({ key });
  observer(value);
  Object.defineProperty(data, key, {
    enumerable: true,
    configurable: true,
    get: function() {
      if (Dep.target) {
        dep.depend();
      }
      return value;
    },
    set: function(newValue) {
      if (value === newValue) return;
      value = newValue;
      observer(newValue);
      dep.notify();
    }
  });
};
```

## 解析器 Compile

- 解析模板指令 v-xxxx
- 将模板中的{{变量}}替换成数据
- 初始化渲染页面视图
- 将指令对应的节点绑定更新函数
- 添加监听数据的订阅者,一旦数据有变动,收到通知,更新视图

```js
function Compile(el, vm) {
  this.$vm = vm;
  this.$el = el.nodeType === 1 ? el : document.querySelector(el);
  if (this.$el) {
    this.$fragment = this.nodeToFragment(this.$el);
    this.compile(this.$fragment);
    this.$el.appendChild(this.$fragment);
  }
}

Compile.prototype.nodeToFragment = function(el) {
  let fragment = document.createDocumentFragment();
  let child;
  while ((child = el.firstChild)) {
    fragment.appendChild(child);
  }
  return fragment;
};

Compile.prototype.compile = function(fragment) {
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
};

Compile.prototype.compileElement = function(element) {
  let attrs = element.attributes;
  let _this = this;
  Array.prototype.slice.call(attrs).forEach(attr => {
    let attrName = attr.name;
    let attrValue = attr.value;
    // 如 <span v-text="content"></span> 中指令为 v-text
    if (attrName.indexOf('v-') === 0) {
      let dir = attrName.substring(2);
      if (dir.indexOf('on') === 0) {
        compileUtil.eventHandler(element, _this.$vm, attrValue, dir);
      } else {
        compileUtil[dir] && compileUtil[dir](element, _this.$vm, attrValue);
      }
      element.removeAttribute(attrName);
    }
  });
};

const compileUtil = {};

const updater = {};
```

## 订阅者 Watcher

Watcher 订阅者作为 Observer 和 Compile 之间通信的桥梁

- 自身实例化时往属性订阅器(dep)里面添加自己
- 自身必须有一个 update()方法
- 属性变动也就是 setter 触发时,能调用自身的 update()方法,并触发 Compile 中绑定的回调。

```js
class Watcher {
  constructor(vm, expOrFn, cb) {
    this.vm = vm;
    this.expOrFn = expOrFn;
    this.cb = cb;
    this.depIds = {};
    this.deps = [];
    if (typeof expOrFn === 'function') {
      this.getter = expOrFn;
    } else {
      this.getter = this.parseGetter(expOrFn.trim());
    }
    this.value = this.get();
  }
  update() {
    let value = this.get();
    let oldValue = this.value;
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
  parseGetter(exp) {
    if (/[^\w.$]/.test(exp)) return;
    var exps = exp.split('.');
    return function(obj) {
      for (var i = 0, len = exps.length; i < len; i++) {
        if (!obj) return;
        obj = obj[exps[i]];
      }
      return obj;
    };
  }
}
```

## 依赖收集 Dep

data 中每个声明的属性,都会有一个 专属的依赖收集器 subs,保存着 谁依赖（使用）了 它.当页面使用到 某个属性时,页面的 watcher 就会被放到依赖收集器 subs 中,以便于在数据进行变化时,页面 watcher 进行更新

- 首先 observer => walk => defineReactive , 在 getter 和 setter 添加依赖收集和依赖更新
- 响应式的 getter => dep.depend, 当数据变化的时候,添加相应的 watcher 进行收集
- 订阅者 watcher.addDep(new Dep()) => watcher.newDeps.push(dep)
- 最后搜集到 Dep 中 dep.addSub(new Watcher()) => dep.subs.push(watcher)

最终 watcher.newDeps 数组中存放 dep 列表,dep.subs 数组中存放 watcher 列表。而 Vue 在数据改变时,通知通知那些存在 依赖收集器中的 视图(watcher)进行更新

```js
let depid = 0;

function Dep(options) {
  this.id = depid++;
  this.key = options.key ? options.key : '';
  this.subs = [];
}

Dep.prototype.addSub = function(watchInstance) {
  this.subs.push(watchInstance);
};

Dep.prototype.removeSub = function(watchInstance) {
  if (this.subs.indexOf(watchInstance) !== -1) {
    this.subs.splice(index, 1);
  }
};

Dep.prototype.depend = function() {
  // Dep.target = watchInstance
  Dep.target && Dep.target.addDep(this);
};

Dep.prototype.notify = function() {
  const subs = this.subs.slice();

  subs.forEach(sub => {
    sub.update();
  });
};

Dep.target = null;
```

- Object.defineProperty - get ,用于 依赖收集
- Object.defineProperty - set,用于 依赖更新
- Dep.target 是变化的,根据当前解析流程,不停地指向不同的 watcher,在 getter 中 watcher 正在使用数据,数据要收集这个 watcher
- 每个 data 声明的属性,都拥有一个的专属依赖收集器 subs
- 依赖收集器 subs 保存的依赖是 watcher
- watcher 可用于 进行视图更新

## mvvm 双向绑定

- 数据绑定的入口,整合 Observer、Compile 和 Watcher 三者
- 通过 Observer 来监听自己的 model 数据变动
- 通过 Compile 来解析编译模板指令
- 利用 Watcher 搭起 Observer 和 Compile 之间的通信桥梁
- 数据变化(setter) -> 视图更新(dep.notify)
- 视图交互变化(input) -> 数据 model 变更的双向绑定

```js
class Vue {
  constructor(options) {
    this.options = options || {};
    this.data = options.data;
    this.el = options.el || 'body';
    this.initState();
    callHook(vm, 'beforeMount');
    this._isMounted = true;
    this.$compile = new Compile(this.el, this);
    callHook(vm, 'mounted');
  }
  initState() {
    const _this = this;
    const ops = _this.options;
    callHook(vm, 'beforeCreate');
    ops.data && _this.initData();
    ops.methods && _this.initMethods();
    ops.computed && _this.initComputed();
    callHook(vm, 'created');
    this.initLifecycle(_this);
  }
  initData() {
    const _this = this;
    const data = _this.options.data;
    // 通过Object.defineProperty 实现 vm.xxx -> vm._data.xxx
    Object.keys(data).forEach(function(key) {
      _this._proxyData(key);
    });
    observer(this.data);
  }
  initMethods() {
    const _this = this;
    const methods = _this.options.methods;
    for (let key in methods) {
      _this[key] = methods[key].bind(_this);
    }
  }
  initComputed() {
    const _this = this;
    const computed = _this.options.computed;
    for (let key in computed) {
      const userDef = computed[key];
      const def = { enumerable: true, configurable: true };
      def.get = makeComputedGetter(userDef, _this);
      def.set = function() {};
      Object.defineProperty(_this, key, def);
    }
  }
  initLifecycle(vm) {}
  $watch(key, cb, options) {
    new Watcher(this, key, cb);
  }
  _proxyData(key) {
    const _this = this;
    Object.defineProperty(_this, key, {
      configurable: false,
      enumerable: true,
      get: function() {
        return _this.data[key];
      },
      set: function(newVal) {
        _this.data[key] = newVal;
      }
    });
  }
}

function makeComputedGetter(getter, owner) {
  const watcher = new Watcher(owner, getter, function() {});
  return function computedGetter() {
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
```

## 使用

```html
<div id="mvvm-app">
  <input type="text" v-model="someStr" />
  <input type="text" v-model="child.someStr" />
  <p v-class="className" class="abc">
    {{ someStr }}
    <span v-text="child.someStr"></span>
  </p>
  <p>计算属性:{{ getHelloWord }}</p>
  <p v-html="htmlStr"></p>
  <button v-on:click="clickBtn">变更显示内容</button>
  <ul v-if="showNode">
    <li>{{ number }}</li>
    <li>{{ number1 }}</li>
    <li>{{ number2 }}</li>
  </ul>
  <button v-on:click="showNodeEvent">kaiguan</button>
  <pre><code>{{ code }}</code></pre>
</div>

<!-- <script src="http://cdn.bootcss.com/vue/1.0.24/vue.js"></script> -->
<script src="./js/dep.js"></script>
<script src="./js/observer.js"></script>
<script src="./js/watcher.js"></script>
<script src="./js/compile.js"></script>
<script src="./js/vue.js"></script>
<script>
  var vm = new Vue({
    el: '#mvvm-app',
    data: {
      someStr: '待到秋来九月八 ',
      className: 'btn',
      htmlStr: '<span style="color: #f00;">red</span>',
      child: {
        someStr: '满城尽带黄金甲 !'
      },
      message: 'this is test',
      number: 5,
      number1: 1,
      number2: 2,
      showNode: false,
      innerObj: {
        text: '内部对象文本'
      },
      code: "const a = 'hello world'; function alertA() {console.log(a)}"
    },
    computed: {
      getHelloWord: function() {
        return '计算属性getHelloWord => ' + this.someStr + this.child.someStr;
      }
    },
    beforeCreate() {
      console.log('beforeCreate :');
    },
    created() {
      console.log('created :');
    },
    beforeMount() {
      console.log('beforeMount :');
    },
    mounted() {
      console.log('mounted :');
      this.child.someStr = '我花开后百花杀';
    },
    methods: {
      clickBtn(e) {
        var randomStrArr = ['李白', '杜甫', '辛弃疾'];
        this.child.someStr = randomStrArr[parseInt(Math.random() * 3)];
        this.add();
        this.code = 'hello world';
      },
      add() {
        this.number++;
        this.number1++;
        this.number2--;
      },
      show() {
        this.showNode = !this.showNode;
      },
      showNodeEvent() {
        this.showNode = true;
      }
    },
    watch: {}
  });

  vm.$watch('child.someStr', function() {
    console.log(arguments);
  });
</script>
```

## 文档

- [嗨，让我带你逐行剖析 Vue.js 源码](https://nlrx-wjc.github.io/Learn-Vue-Source-Code/start/#_1-%E5%89%8D%E8%A8%80)
- [剖析 Vue 实现原理 - 如何实现双向绑定 mvvm](https://github.com/DMQ/mvvm)
- [Vue.js 源码解析](https://github.com/answershuto/learnVue)
- [Vue.js 源码（1）：Hello World 的背后](https://segmentfault.com/a/1190000006866881)
- [Vue.js 官方工程](https://github.com/DMQ/mvvm)
- [Vue.js 技术揭秘](https://ustbhuangyi.github.io/vue-analysis/)
- [Vue 原理 白话版](https://juejin.im/user/5a6fdcfc51882522b5529eb0/posts)
- [一个 Vue 框架的简单实现](https://github.com/fwing1987/MyVue)
- [深入解析 vue 1 实现原理,并仿 vue 生成简单的双向数据绑定模型](https://github.com/pf12345/vue-imitate)
- [vue.js 源码 - 剖析 observer,dep,watch 三者关系 如何具体的实现数据双向绑定](https://github.com/wangweianger/myblog)
- [用一张思维导图总结了 Vue | Vue-Router | Vuex 源码与架构要点](https://github.com/biaochenxuying/vue-family-mindmap)
