class MVVM {
  constructor(options) {
    this.$options = options || {};
    this._data = this.$options.data;
    let data = this.$options.data;
    let _this = this;
    // 通过Object.defineProperty 实现 vm.xxx -> vm._data.xxx
    Object.keys(data).forEach(function(key) {
      _this._proxyData(key);
    });
    this._initComputed();
    // 将data加入监听
    observe(data, this);
    // 进行dom渲染
    this.$compile = new Compile(options.el || document.body, this);
  }

  $watch(key, cb, options) {
    new Watcher(this, key, cb);
  }

  _proxyData(key) {
    let _this = this;

    Object.defineProperty(_this, key, {
      configurable: false,
      enumerable: true,
      get: function() {
        return _this._data[key];
      },
      set: function(newVal) {
        _this._data[key] = newVal;
      }
    });
  }

  _initComputed() {
    let me = this;
    let computed = this.$options.computed;
    if (typeof computed === "object") {
      Object.entries(computed).forEach(function([key, value]) {
        Object.defineProperty(me, key, {
          get: typeof value === "function" ? value : value.get,
          set: function() {}
        });
      });
    }
  }
}
