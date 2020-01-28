### vue 基本构成

- Observer 数据监听器,对数据的所有属性进行监听,数据变动时拿到变动值并且通知订阅者
- Compiler 指令解析器,对每个元素节点的指令进行扫描和解析,根据指令模板替换数据,并绑定相应的更新函数
- Watcher 链接 Observer 和 Compiler,能够订阅并且收到每个属性变动的通知,执行指令绑定的回调函数
- vue 入门函数

### 文档

- [剖析 Vue 实现原理 - 如何实现双向绑定 mvvm](https://github.com/DMQ/mvvm)
- [Vue.js 源码（1）：Hello World 的背后](https://segmentfault.com/a/1190000006866881)
- [Vue.js 官方工程](https://github.com/DMQ/mvvm)
- [Vue.js 技术揭秘](https://ustbhuangyi.github.io/vue-analysis/v2/prepare/)
- [【Vue 原理】白话版](https://juejin.im/user/5a6fdcfc51882522b5529eb0/posts)
