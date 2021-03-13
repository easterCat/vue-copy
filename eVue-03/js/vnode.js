function Vnode(tag, data, children, text, element) {
    this.tag = tag; // 标签名
    this.data = data; // 存储节点的属性，class，style 等
    this.children = children; // 子元素
    this.text = text; // 文本内容
    this.element = element; // Dom 节点
}

export function createVnode(tag, data, children) {
    return new Vnode(tag, data, normalizeChildren(children), undefined, undefined);
}

export function createTextNode(val) {
    return new Vnode(undefined, undefined, undefined, String(val));
}

export function emptyNodeAt(elm) {
    return new Vnode(elm.tagName.toLowerCase(), {}, [], undefined, elm);
}

// 生成VNode 的时候，并不存在真实 DOM,element 会在需要创建DOM 时完成赋值，具体函数在 createElement 中
export function createElement(vnode) {
    if (!vnode) return;
    const { tag, data, children } = vnode;
    // tag是正常html标签
    if (tag) {
        vnode.element = document.createElement(tag);
        if (data.attrs) {
            for (let key in data.attrs) {
                vnode.element.setAttribute(key, data.attrs[key]);
            }
        }
        if (children) {
            createChildren(vnode, children);
        }
    } else {
        vnode.element = document.createTextNode(vnode.text);
    }
    return vnode.element;
}

function normalizeChildren(children) {
    if (typeof children === "string") {
        return [createTextNode(children)];
    }
    return children;
}

function createChildren(vnode, children) {
    const l = children.length;
    for (let index = 0; index < l; index++) {
        vnode.element.appendChild(createElement(children[index]));
    }
}

export function sameVnode(vnode1, vnode2) {
    return vnode1.tag === vnode2.tag;
}
