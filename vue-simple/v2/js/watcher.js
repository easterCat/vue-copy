class Watcher {
  constructor(vm, expOrFn, cb, options) {
    this.vm = vm;
    // lazy 表示一种固定描述，不可改变，表示这个 watcher 需要缓存
    this.lazy = options && options.lazy;
    // dirty 表示缓存是否可用，如果为 true，表示缓存脏了，需要重新计算，否则不用
    this.dirty = options && options.lazy;
    this.expOrFn = expOrFn;
    this.cb = cb;
    this.depIds = {};
    this.deps = [];
    if (typeof expOrFn === "function") {
      this.getter = expOrFn;
    } else {
      this.getter = this.parseGetter(expOrFn.trim());
    }
    this.value = this.lazy ? undefined : this.get();
  }
  update() {
    let value = this.get();
    let oldValue = this.value;
    // 当通知 computed 更新的时候，就只是 把 dirty 设置为 true，从而 读取 comptued 时，便会调用 evalute 重新计算
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
    this.value = this.get();
    // 执行完更新函数之后，立即重置标志位
    this.dirty = false;
  }
  parseGetter(exp) {
    if (/[^\w.$]/.test(exp)) return;
    var exps = exp.split(".");
    return function (obj) {
      for (var i = 0, len = exps.length; i < len; i++) {
        if (!obj) return;
        obj = obj[exps[i]];
      }
      return obj;
    };
  }
}
