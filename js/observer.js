function observer(data) {
  if (data !== null && typeof data === "object") {
    return new Observer(data);
  }
  return;
}

function Observer(data) {
  this.data = data;
  this.walk(data);
}

Observer.prototype.walk = function(data) {
  Object.entries(data).forEach(([key, value], index) => {
    this.defineReactive(data, key, value);
  });
};

Observer.prototype.defineReactive = function(data, key, value) {
  observer(value);
  Object.defineProperty(data, key, {
    enumerable: true,
    configurable: true,
    get: function() {
      return value;
    },
    set: function(newValue) {
      if (value === newValue) return;
      value = newValue;
    }
  });
};
