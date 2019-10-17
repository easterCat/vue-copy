let updater = {
  textUpdater: function(node, value) {
    node.textContent = typeof value == "undefined" ? "" : value;
  },
  htmlUpdater: function(node, value) {
    node.innerHTML = typeof value == "undefined" ? "" : value;
  },
  classUpdater: function(node, value, oldValue) {
    let className = node.className;
    className = className.replace(oldValue, "").replace(/\s$/, "");
    let space = className && String(value) ? " " : "";
    node.className = className + space + value;
  },
  modelUpdater: function(node, value, oldValue) {
    node.value = typeof value == "undefined" ? "" : value;
  }
};
