function Vuec(options) {
  this.option = options || {};
  this.data = options.data;
  this.el = options.el || "body";
  observer(this.data);
  this.$compile = new Compile(this.el, this);
}
