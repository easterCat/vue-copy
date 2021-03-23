import { emptyNodeAt, createElement, sameVnode } from "./vnode";
import { isUndef, isDef, isTrue } from "../shared/utils";

const hooks = ["create", "activate", "update", "remove", "destroy"];
const cbs = [];

export function patch(oldVnode, vnode) {
    // 当新节点不存在
    if (isUndef(vnode)) {
        if (isDef(oldVnode)) {
            invokeDestroyHook(oldVnode);
        }
        return;
    }

    // 当旧节点不存在,直接插入新节点
    if (isUndef(oldVnode)) {
        createElement(vnode);
    } else {
        const isRealElement = isDef(oldVnode.nodeType);
        if (!isRealElement && sameVnode(oldVnode, vnode)) {
            // 都为虚拟节点且同类型
            patchVnode(oldVnode, vnode);
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
}

export function patchVnode(oldVnode, vnode) {
    // 当新旧节点完全相同
    if (oldVnode === vnode) {
        return;
    }

    const element = (vnode.element = oldVnode.element);

    if (isTrue(oldVnode) && isTrue(vnode) && vnode.key === oldVnode.key) {
        vnode.componentInstance = oldVnode.componentInstance;
        return;
    }

    console.log("vnode :>> ", vnode);
    if (isUndef(vnode.text)) {
        if (isDef(oldVnode.children) && isDef(vnode.children)) {
            if (oldVnode.children !== vnode.children) {
                updateChildren(element, oldVnode.children, vnode.children);
            }
        } else if (isDef(vnode.children)) {
            if (isDef(oldVnode.text)) {
                element.textConent = "";
            }
            addVnodes(element);
        } else if (isDef(oldVnode.children)) {
            removeVnodes(element);
        } else if (isDef(oldVnode.text)) {
            element.textConent = "";
        }
    } else {
        // 新旧节点上的文本节点不一致，更新新节点上的 DOM
        element.textContent = vnode.text;
    }
}

export function updateChildren(parentElement, oldChild, newChild) {
    let newStartIndex = 0;
    let newEndIndex = newChild.length - 1;
    let newStartVnode = newChild[newStartIndex];
    let newEndVnode = newChild[newEndIndex];
    let oldStartIndex = 0;
    let oldEndIndex = oldChild.length - 1;
    let oldStartVnode = oldChild[oldStartIndex];
    let oldEndVnode = oldChild[oldEndIndex];

    while (newStartIndex <= newEndIndex && oldStartIndex <= oldEndIndex) {
        if (isUndef(oldStartVnode)) {
            oldStartVnode = oldChild[++oldStartIndex];
        } else if (isUndef(oldEndVnode)) {
            oldEndVnode = oldChild[--oldEndIndex];
        } else if (sameVnode(oldStartVnode, newStartVnode)) {
            patchVnode(oldStartVnode, newStartVnode);
            oldStartVnode = oldChild[++oldStartIndex];
            newStartVnode = newChild[++newStartIndex];
        } else if (sameVnode(oldEndVnode, newEndVnode)) {
            patchVnode(oldEndVnode, newEndVnode);
            oldEndVnode = oldChild[--oldEndIndex];
            newEndVnode = newChild[--newEndIndex];
        } else if (sameVnode(oldStartVnode, newEndVnode)) {
            patchVnode(oldStartVnode, newEndVnode);
            parentElement.insertBefore(oldStartVnode.element, oldEndVnode.element.nextSibling());
            oldStartVnode = oldChild[++oldStartIndex];
            newEndVnode = newChild[--newEndIndex];
        } else if (sameVnode(oldEndVnode, newStartVnode)) {
            patchVnode(oldEndVnode, newStartVnode);
            parentElement.insertBefore(oldEndVnode.element, oldStartVnode.element);
            oldEndVnode = oldChild[--oldEndIndex];
            newStartVnode = newChild[++newStartIndex];
        } else {
            createElement(newStartVnode);
            newStartVnode = newChild[++newStartIndex];
        }
    }
}

function addVnodes(element) {
    return createElement(element);
}
function removeVnodes() {}
function invokeDestroyHook(vnode) {}
