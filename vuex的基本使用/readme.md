## vue 组件之间数据传输(props 传值方式)

## vue 组件之间数据传输(eventBus 进行组件传递)

## vue 组件之间数据传输(vuex)

#### state

Vuex 的状态存储是响应式的，从 store 实例中读取状态最简单的方法就是在计算属性中返回某个状态。每当 store.state.count 变化的时候, 都会重新求取计算属性，并且触发更新相关联的 DOM。
Vuex 通过 store 选项，提供了一种机制将状态从根组件“注入”到每一个子组件中。

```
const app = new Vue({
  el: '#app',
  // 把 store 对象提供给 “store” 选项，这可以把 store 的实例注入所有的子组件
  store,
  components: { Counter },
  template: `
    <div class="app">
      <counter></counter>
    </div>
  `
})
```

在子组件中使用

```
const Counter = {
  template: `<div>{{ count }}</div>`,
  computed: {
    count () {
      return this.$store.state.count
    }
  }
}
```

#### mapState 辅助函数

```
import { mapState } from 'vuex'

export default {
  // ...
  computed: mapState({
    // 箭头函数可使代码更简练
    count: state => state.count,

    // 传字符串参数 'count' 等同于 `state => state.count`
    countAlias: 'count',

    // 为了能够使用 `this` 获取局部状态，必须使用常规函数
    countPlusLocalState (state) {
      return state.count + this.localCount
    }
  })
}
```

当映射的计算属性的名称与 state 的子节点名称相同时，我们也可以给 mapState 传一个字符串数组

```
computed: mapState([
  // 映射 this.count 为 store.state.count
  'count'
])
```

#### mapState 与局部计算属性混合使用

使用对象展开运算符将多个对象合并为一个，以使我们可以将最终对象传给 computed 属性。

```
computed: {
  localComputed () { /* ... */ },
  // 使用对象展开运算符将此对象混入到外部对象中
  ...mapState({
    // ...
  })
}
```

## 其他的传值还有一些传统的方式

比如 localStorage，sessionStorage，router 传参，cookie（不推荐，虽然就跟之前做购物
车差不多的传递形式）

#### sessionstorage

项目中使用的 sessionStorage

```
sessionStorage.setItem("msg", JSON.stringify(res.data)); //为了兼容之前的代码，有用到msg这个本地缓存的数据
sessionStorage.setItem("isMobile", res.data.mobile);
sessionStorage.setItem("invi", res.data.invitation);
sessionStorage.setItem("isLogin", res.data.trier);
sessionStorage.setItem("setPwd", res.data.fundpwd);
sessionStorage.setItem("isShow", res.data.bankcard);
```

#### localStorage

项目中关于声音的开关，用来将用户的一些操作一直保存

```
//组件userSetting
localStorage.setItem("audio", this.switchValue);
//组件audioPlay
let audio = localStorage.getItem("audio");
```

> sessionstorage 和 localStorage 看情况使用就好，sessionstorage 是浏览器关闭没了，localStorage 是一直存储不删除就在存在

#### params

依赖于 vue-router

```
this.$router.push({
  name: "Main",
  params: {
    id: this.setting_id,
    type: "3"
  }
});
```

[Vuex](https://vuex.vuejs.org/zh/guide/)
[vuejs](https://cn.vuejs.org/v2/guide/computed.html#%E8%AE%A1%E7%AE%97%E5%B1%9E%E6%80%A7)
[Vuex - 标签 - 掘金](https://juejin.im/search?query=vuex&type=all)
[imooc](http://www.imooc.com/t/3017249)
[浪里行舟 从头开始学习 Vuex](https://juejin.im/post/5bbe15dcf265da0a867c57bd)
[VueJS 中学习使用 Vuex 详解](https://segmentfault.com/a/1190000015782272)
[到底 vuex 是什么？](https://segmentfault.com/a/1190000007516967)
[基于 vue2 + vuex 构建一个具有 45 个页面的大型单页面应用](https://github.com/bailicangdu/vue2-elm)
