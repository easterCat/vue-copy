import { observer } from "./observer";
import { Compile } from "./compile";
import { Watcher } from "./watcher";
import { emptyNodeAt, createElement, sameVnode } from "./vnode";
import { Dep } from "./dep";

export class EVue {
    constructor(options) {
        this.options = options || {};
        this.data = options.data;
        this.el = options.el || "body";
        this.initState(); // 初始化data,method,computed,watch
        this.$mount(document.getElementById("render"));
        callHook(this, "beforeMount");
        this._isMounted = true;
        this.$compile = new Compile(this.el, this);
        callHook(this, "mounted");
    }
    initState() {
        const vm = this;
        const ops = vm.options;
        this.initLifecycle(vm);
        callHook(vm, "beforeCreate");
        ops.data && vm.initData();
        ops.methods && vm.initMethods();
        ops.computed && vm.initComputed();
        callHook(vm, "created");
    }
    initData() {
        const vm = this;
        const data = vm.options.data;
        // 通过Object.defineProperty 实现 vm.xxx -> vm._data.xxx
        Object.keys(data).forEach(function (key) {
            vm.$proxyData(key);
        });
        observer(this.data);
    }
    initMethods() {
        const vm = this;
        const methods = vm.options.methods;
        for (let key in methods) {
            vm[key] = methods[key].bind(vm);
        }
    }
    initComputed() {
        const vm = this;
        const computed = vm.options.computed;
        for (let key in computed) {
            const userDef = computed[key]; // 获取用户定义的属性
            vm.defineComputed(vm, key, userDef);
        }
    }
    defineComputed(vm, key, userDef) {
        const def = { enumerable: true, configurable: true };
        def.get = makeComputedGetter(userDef, vm);
        def.set = userDef.set ? userDef.set : function () {};
        Object.defineProperty(vm, key, def);
    }
    initLifecycle(vm) {
        vm._isMounted = false;
        vm._isDestroyed = false;
        vm._isBeingDestroyed = false;
    }
    $mount(element) {
        const vm = this;
        const vnode = vm.render();
        vm.$el = element;
        vm.update(vnode);
    }
    update(vnode) {
        const vm = this;
        const prevVnode = vm._vnode;
        vm._vnode = vnode;
        vm._isMounted && callHook(vm, "beforeUpdate");

        if (!prevVnode) {
            vm.$el = vm.patch(vm.$el, vnode);
        } else {
            vm.$el = vm.patch(prevVnode, vnode);
        }
        callHook(vm, "updated");
    }
    $destroy() {
        callHook(vm, "beforeDestroy");
        vm._isBeingDestroyed = true;
        vm._isDestroyed = true;
        callHook(vm, "destroyed");
    }
    render() {
        const vm = this;
        return vm.options.render.call(vm);
    }
    patch(oldVnode, vnode) {
        const isRealElement = !!oldVnode.nodeType;

        if (!isRealElement && sameVnode(oldVnode, vnode)) {
            this.patchNode(oldVnode, vnode);
        } else {
            if (isRealElement) {
                oldVnode = emptyNodeAt(oldVnode);
            }
            const element = oldVnode.element;
            const parent = element.parentNode;

            if (parent) {
                createElement(vnode);
                parent.insertBefore(vnode.element, element);
                parent.removeChild(element);
            }
        }
    }
    patchNode(oldNode, newNode) {
        const element = (newNode.element = oldNode.element);
        const oldC = oldNode.children;
        const C = newNode.children;

        if (!newNode.text) {
            if (oldC && C) {
                this.updateChildren(oldC, C);
            }
        } else if (oldNode.text !== newNode.text) {
            element.textContent = newNode.text;
        }
    }
    updateChildren(oldC, C) {
        if (sameVnode(oldC[0], C[0])) {
            this.patchNode(oldC[0], C[0]);
        } else {
            this.patch(oldC[0], C[0]);
        }
    }
    $watch(key, cb, options) {
        new Watcher(this, key, cb);
    }
    $proxyData(key) {
        const vm = this;
        Object.defineProperty(vm, key, {
            configurable: false,
            enumerable: true,
            get: function () {
                return vm.data[key];
            },
            set: function (newVal) {
                vm.data[key] = newVal;
            },
        });
    }
}

function makeComputedGetter(getter, vm) {
    const watcher = new Watcher(vm, getter, function () {}, { lazy: true });
    return function computedGetter() {
        // 缓存控制
        if (watcher.dirty) {
            watcher.evaluate();
        }

        if (Dep.target) {
            watcher.depend();
        }
        return watcher.value;
    };
}

function callHook(vm, hook) {
    const handlers = vm.options[hook];
    handlers && handlers.call(vm);
}
