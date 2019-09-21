let depid = 0;

class Dep {
  constructor(options) {
    this.id = depid++;
    this.key = options.key ? options.key : "";
    this.subs = [];
  }
  depend() {
    Dep.target.addDep(this);
  }
  addSub(sub) {
    this.subs.push(sub);
  }
  removeSub(sub) {
    if (this.subs.indexOf(sub) !== -1) {
      this.subs.splice(index, 1);
    }
  }
  notify() {
    this.subs.forEach(sub => {
      sub.update();
    });
  }
}

Dep.target = null;
