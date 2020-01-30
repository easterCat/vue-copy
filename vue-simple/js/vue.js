class Vue {
  constructor(options) {
    this.options = options || {};
    this.data = options.data;
    this.el = options.el || "body";
    this.initState();
    callHook(vm, "beforeMount");
    this._isMounted = true;
    this.$compile = new Compile(this.el, this);
    callHook(vm, "mounted");
  }
  initState() {
    const _this = this;
    const ops = _this.options;
    callHook(vm, "beforeCreate");
    ops.data && _this.initData();
    ops.methods && _this.initMethods();
    ops.computed && _this.initComputed();
    callHook(vm, "created");
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
