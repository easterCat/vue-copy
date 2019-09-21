function Vuec(options) {
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

Vuec.prototype.$watch = function(key, cb, options) {
  new Watcher(this, key, cb);
};

Vuec.prototype._proxyData = function(key) {
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
