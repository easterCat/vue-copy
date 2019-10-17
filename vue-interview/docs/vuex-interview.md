## 1.你有使用过 vuex 的 module 吗？主要是在什么场景下使用？

把状态全部集中在状态树上，非常难以维护。
按模块分成多个 module，状态树延伸多个分支，模块的状态内聚，主枝干放全局共享状态

## 2.vuex 中 actions 和 mutations 有什么区别？

action

- actions 是用来触发 mutations 的，它无法直接改变 state
- 一些对 State 的异步操作可放在 Action 中，并通过在 Action 中 commit Mutation 变更状态
- Action 可通过 store.dispatch() 方法触发，或者通过 mapActions 辅助函数将 vue 组件的 methods 映射成 store.dispatch() 调用 Mutation

mutation

- mutations 可以直接修改 state,在 vuex 的严格模式下，Mutaion 是 vuex 中改变 State 的唯一途径
- Mutation 中只能是同步操作通过 store.commit() 调用 Mutation

> 尽量通过 Action 或 mapMutation 调用而非直接在组件中通过 `this.$store.commit()`提交

## 3.vuex 使用 actions 时不支持多参数传递怎么办？

Object

## 4.你觉得要是不用 vuex 的话会带来哪些问题？

多层级组件,兄弟组件之前数据共享繁琐

## 5.vuex 怎么知道 state 是通过 mutation 修改还是外部直接修改的？

通过 `$watch` 监听 mutation 的 commit 函数中 `_committing` 是否为 true

## 6.怎么监听 vuex 数据的变化？

在 mutations 中监视

## 7.页面刷新后 vuex 的 state 数据丢失怎么解决？

- localStorage / sessionStorage
- vuex-persistedstate 的 createPersistedState()方法

## 8.vuex 的 state、getter、mutation、action、module 特性分别是什么？

- state, 状态初始化, 并实施观察
- getter, 获取数据用于 view 或 data 中使用
- mutation: 内部处理 state 变化
- action: 处理外部交互
- module: 模块化以上四个

## 9.vuex 的 store 有几个属性值？分别讲讲它们的作用是什么？

- state:存贮公共数据的地方
- Getters：获取公共数据的地方
- mutations：放的是同步的操作和 reducer 有点像 通过 store 的 commit 方法来让 mutations 执行
- action：放的是异步的操作 通过 dispatch 的方法让 action 里面的方法执行
- context 是 store 的一个副本

Vuex 就是提供一个仓库，store 仓库里面放了很多对象其中 state 即使数据源存放地，

## 10.使用 vuex 的优势是什么？

vuex 中的所有功能都能够通过其他的方式进行实现，只不过 vuex 对这些方法进行了整合处理，使用起来更加便捷，同时也便于维护.全局状态变量的统一管理,便于进行全局或者局部的状态管理, 便于组件/插件/混合之间的联系.
