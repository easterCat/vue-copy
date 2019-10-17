## 1.vue-router 怎么重定向页面？

- 路由中配置 redirect 属性
- 使用路由的别名来完成重定向

## 2.vue-router 怎么配置 404 页面？

`path: '*'`,放在最后一个

## 3.切换路由时，需要保存草稿的功能，怎么实现呢？

- beforeDe
- beforeRouteLeave

## 4.vue-router 路由有几种模式？说说它们的区别？

hash 模式的特点

> hash 表示的是地址栏 URL 中#符号(也称作为锚点), hash 虽然会出现在 URL 中, 但是不会被包含在 Http 请求中, 因此 hash 值改变不会重新加载页面.由于 hash 值变化不会引起浏览器向服务器发出请求, 而且 hash 改变会触发 hashchange 事件, 浏览器的进后退也能对其进行控制, 所以在 HTML5 之前, 基本都是使用 hash 来实现前端路由.

history 模式的特点

> 利用了 HTML5 新增的 pushState()和 replaceState()两个 api, 通过这两个 api 完成 URL 跳转不会重新加载页面.同时 history 模式解决了 hash 模式存在的问题. hash 的传参是基于 URL 的, 如果要传递复杂的数据, 会有体积限制,

## 5.说说你对 router-link 的了解

vue-router 插件的其中一个组件, 用于跳转路由, 类似于 a 标签, 它一般也会渲染成 a 标签, 但是可以通过 tag 来变更默认渲染元素, 通过 to 来跳转

## 6.切换到新路由时，页面要滚动到顶部或保持原先的滚动位置怎么做呢？

滚动到顶部：在 new Router()的时候，配置

```
scrollBehavior(to, from, savedPosition) {
return { x: 0, y: 0 }
}
```

## 7.如何获取路由传过来的参数？

如果使用 query 方式传入的参数使用 this.$route.query 接收
如果使用params方式传入的参数使用this.$router.params 接收

## 8.说说 active-class 是哪个组件的属性？

active-class 是 vue-router 模块的 router-link 组件中的属性，用来做选中样式的切换；

## 9.在 vue 组件中怎么获取到当前的路由信息？

this.$route.path / this.$route

## 10.怎样动态加载路由？

router.addRoutes

## 11.怎么实现路由懒加载呢？

import 异步加载`const component = () =>import('./....')`

## 12.说说 vue-router 完整的导航解析流程是什么？

1. 导航被触发；
2. 在失活的组件里调用 beforeRouteLeave 守卫；
3. 调用全局 beforeEach 守卫；
4. 在复用组件里调用 beforeRouteUpdate 守卫；
5. 调用路由配置里的 beforeEnter 守卫；
6. 解析异步路由组件；
7. 在被激活的组件里调用 beforeRouteEnter 守卫；
8. 调用全局 beforeResolve 守卫；
9. 导航被确认；
10. 调用全局的 afterEach 钩子；
11. DOM 更新；
12. 用创建好的实例调用 beforeRouteEnter 守卫中传给 next 的回调函数。

## 13.route 和 router 有什么区别？

route 代表当前路由对象，router 代表整个 vue 实例下的路由对象

## 14.vue-router 钩子函数有哪些？都有哪些参数？

beforeEach,afterEach
beforeEach 主要有三个参数，to,form,next
