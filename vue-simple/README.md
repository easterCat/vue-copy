## 几种实现双向绑定的做法

目前几种主流的 mvc(vm)框架都实现了单向数据绑定，而我所理解的双向数据绑定无非就是在单向绑定的基础上给可输入元素（input、textare 等）添加了 change(input)事件，来动态修改 model 和 view，并没有多高深。所以无需太过介怀是实现的单向或双向绑定。

实现数据绑定的做法有大致如下几种：

- 发布者-订阅者模式（backbone.js）
- 脏值检查（angular.js）
- 数据劫持（vue.js）

发布者-订阅者模式: 一般通过 sub, pub 的方式实现数据和视图的绑定监听，更新数据方式通常做法是 vm.set('property', value)，这里有篇文章讲的比较详细，有兴趣可点这里

这种方式现在毕竟太 low 了，我们更希望通过 vm.property = value 这种方式更新数据，同时自动更新视图，于是有了下面两种方式

脏值检查: angular.js 是通过脏值检测的方式比对数据是否有变更，来决定是否更新视图，最简单的方式就是通过 setInterval() 定时轮询检测数据变动，当然 Google 不会这么 low，angular 只有在指定的事件触发时进入脏值检测，大致如下：

- DOM 事件，譬如用户输入文本，点击按钮等。( ng-click )
- XHR 响应事件 ( \$http )
- 浏览器 Location 变更事件 ( \$location )
- Timer 事件( $timeout , $interval )
- 执行 $digest() 或 $apply()

数据劫持: vue.js 则是采用数据劫持结合发布者-订阅者模式的方式，通过 Object.defineProperty()来劫持各个属性的 setter，getter，在数据变动时发布消息给订阅者，触发相应的监听回调。

## vue 基本构成

- Observer 数据监听器,对数据的所有属性进行监听,数据变动时拿到变动值并且通知订阅者
- Compiler 指令解析器,对每个元素节点的指令进行扫描和解析,根据指令模板替换数据,并绑定相应的更新函数
- Watcher 链接 Observer 和 Compiler,能够订阅并且收到每个属性变动的通知,执行指令绑定的回调函数
- vue 入门函数

![](https://raw.githubusercontent.com/easterCat/img-package/master/img/2.png)

## 监听器 Observer

- 利用 Obeject.defineProperty()来对数据对象的所有属性进行监听
- observer 将数据对象 data 进行递归遍历,添加上 setter 和 getter
- 当 data 赋值或者取值的时候就能触发相应的回调函数

```js
function observer(data) {
  if (data !== null && typeof data === "object") {
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
    this.defineReactive(data, key, value);
  });
};

Observer.prototype.defineReactive = function(data, key, value) {
  Object.defineProperty(data, key, {
    enumerable: true,
    configurable: true,
    get: function() {
      return value;
    },
    set: function(newValue) {
      if (value === newValue) return;
      value = newValue;
      observer(newValue);
    }
  });
};
```

## 解析器 Compile

- 解析模板指令 v-xxxx
- 将模板中的{{变量}}替换成数据
- 初始化渲染页面视图
- 将指令对应的节点绑定更新函数
- 添加监听数据的订阅者，一旦数据有变动，收到通知，更新视图

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
    if (attrName.indexOf("v-") === 0) {
      let dir = attrName.substring(2);
      if (dir.indexOf("on") === 0) {
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
- 属性变动也就是 setter 触发时，能调用自身的 update()方法，并触发 Compile 中绑定的回调。

```js
function Watcher(vm, expOrFn, cb) {
  this.vm = vm;
  this.expOrFn = expOrFn;
  this.cb = cb;
  this.depIds = {};
  if (typeof expOrFn === "function") {
    this.getter = expOrFn;
  } else {
    this.getter = this.parseGetter(expOrFn.trim());
  }
  this.value = this.get();
}

Watcher.prototype.update = function() {
  let value = this.get();
  let oldValue = this.value;
  if (value !== oldValue) {
    this.value = value;
    this.cb.call(this.vm, value, oldValue);
  }
};

Watcher.prototype.addDep = function(dep) {
  if (!this.depIds.hasOwnProperty(dep.id)) {
    dep.addSub(this);
    this.depIds[dep.id] = dep;
  }
};

Watcher.prototype.get = function() {
  Dep.target = this;
  const value = this.getter.call(this.vm, this.vm);
  Dep.target = null;
  return value;
};

Watcher.prototype.parseGetter = function(exp) {
  if (/[^\w.$]/.test(exp)) return;

  var exps = exp.split(".");

  return function(obj) {
    for (var i = 0, len = exps.length; i < len; i++) {
      if (!obj) return;
      obj = obj[exps[i]];
    }
    return obj;
  };
};
```

## 依赖收集 Dep

- 首先 observer => walk => defineReactive
- 响应式的 getter => dep.depend
- 订阅者 watcher.addDep(new Dep()) => watcher.newDeps.push(dep)
- 最后搜集到 Dep 中 dep.addSub(new Watcher()) => dep.subs.push(watcher)

最终 watcher.newDeps 数组中存放 dep 列表，dep.subs 数组中存放 watcher 列表。

```js
let depid = 0;

function Dep(options) {
  this.id = depid++;
  this.key = options.key ? options.key : "";
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

## mvvm 双向绑定

- 数据绑定的入口,整合 Observer、Compile 和 Watcher 三者
- 通过 Observer 来监听自己的 model 数据变动
- 通过 Compile 来解析编译模板指令
- 利用 Watcher 搭起 Observer 和 Compile 之间的通信桥梁
- 数据变化 -> 视图更新
- 视图交互变化(input) -> 数据 model 变更的双向绑定

```js
function Vue(options) {
  let _this = this;
  this.options = options || {};
  this.data = options.data;
  this.el = options.el || "body";
  // 通过Object.defineProperty 实现 vm.xxx -> vm._data.xxx
  Object.keys(this.data).forEach(function(key) {
    _this._proxyData(key);
  });

  observer(this.data);
  this.$compile = new Compile(this.el, this);
}

Vue.prototype.initState = function() {};

Vue.prototype.$watch = function(key, cb, options) {
  new Watcher(this, key, cb);
};

Vue.prototype._proxyData = function(key) {
  let _this = this;
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
};
```

## 文档

- [剖析 Vue 实现原理 - 如何实现双向绑定 mvvm](https://github.com/DMQ/mvvm)
- [Vue.js 源码解析](https://github.com/answershuto/learnVue)
- [Vue.js 源码（1）：Hello World 的背后](https://segmentfault.com/a/1190000006866881)
- [Vue.js 官方工程](https://github.com/DMQ/mvvm)
- [Vue.js 技术揭秘](https://ustbhuangyi.github.io/vue-analysis/)
- [【Vue 原理】白话版](https://juejin.im/user/5a6fdcfc51882522b5529eb0/posts)
- [一个 Vue 框架的简单实现](https://github.com/fwing1987/MyVue)
- [深入解析 vue 1 实现原理，并仿 vue 生成简单的双向数据绑定模型](https://github.com/pf12345/vue-imitate)
- [vue.js 源码 - 剖析 observer,dep,watch 三者关系 如何具体的实现数据双向绑定](https://github.com/wangweianger/myblog)
- [用一张思维导图总结了 Vue | Vue-Router | Vuex 源码与架构要点](https://github.com/biaochenxuying/vue-family-mindmap)
