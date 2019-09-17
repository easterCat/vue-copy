function isObject(obj) {
  return obj !== null && typeof obj === "object";
}

function isPlainObject(obj) {
  return Object.prototype.toString.call(obj) === "[object Object]";
}

function observe(data) {
  if (isObject(data) && isPlainObject(data)) {
    return new Observer(data);
  }
  return;
}

class Observer {
  constructor(data) {
    this.data = data;
    this.transform(data);
  }
  transform(data) {
    for (let [key, value] of Object.entries(data)) {
      this.defineReactive(data, key, value);
    }
  }
  defineReactive(data, key, value) {
    try {
      // 将对象的子对象也加入监听
      let dep = new Dep({ key });
      observe(value);

      // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty
      Object.defineProperty(data, key, {
        enumerable: true,
        configurable: true,
        get: function() {
          // console.log("获取get值:" + key);
          if (Dep.target) {
            dep.depend();
          }
          return value;
        },
        set: function(newValue) {
          if (value === newValue) return;
          // console.log("监听set值:" + newValue);
          value = newValue;
          observe(newValue);
          dep.noatify();
        }
      });
    } catch (error) {
      throw error;
    }
  }
  getData() {
    return this.data;
  }
}

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
  noatify() {
    this.subs.forEach(sub => {
      sub.update();
    });
  }
}

Dep.target = null;
