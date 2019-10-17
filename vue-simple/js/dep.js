let depid = 0;

class Dep {
  constructor(options) {
    this.id = depid++;
    this.key = options.key ? options.key : "";
    this.subs = [];
  }

  addSub(sub) {
    this.subs.push(sub);
  }

  removeSub(sub) {
    if (this.subs.indexOf(sub) !== -1) {
      this.subs.splice(index, 1);
    }
  }

  depend() {
    if (Dep.target) {
      Dep.target.addDep(this);
    }
  }

  notify() {
    const subs = this.subs.slice();

    subs.forEach(sub => {
      sub.update();
    });
  }
}

Dep.target = null;
