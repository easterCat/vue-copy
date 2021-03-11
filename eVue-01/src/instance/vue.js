class Vue {
  constructor(options) {
    this.options = options || {};
    this.data = options.data;
    this.el = options.el || 'body';
    this.initState(); // 初始化data,method,computed,watch
  }
  initState() {
    const vm = this;
    const ops = vm.options;
    callHook(vm, 'beforeCreate');
    ops.data && vm.initData();
    ops.methods && vm.initMethods();
    ops.computed && vm.initComputed();
    callHook(vm, 'created');
    this.initLifecycle(vm);
  }
  initData() {
    const vm = this;
    const data = vm.options.data;
    // 通过Object.defineProperty 实现 vm.xxx -> vm._data.xxx
    Object.keys(data).forEach(function(key) {
      vm.$proxyData(key);
    });
    observer(this.data);
  }
}
