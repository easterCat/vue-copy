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
