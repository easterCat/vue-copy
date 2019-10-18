## 1.v-model 的原理

v-model 是一个语法糖,它即可以支持原生表单元素,也可以支持自定义组件.v-model 在内部为不同的输入元素使用不同的属性并抛出不同的事件.

- text 和 textarea 元素使用 value 属性和 input 事件
- checkbox 和 radio 使用 checked 属性和 change 事件
- select 字段将 value 作为 prop 并将 change 作为事件
- 自定义组件的时候的 v-model 默认会利用名为 value 的 prop 和名为 input 的事件

在自定义组件中,因为 value 可能作为其他的用处,所有官方推荐的解决方式就是自定 model

```
// 子组件创建
<template>
  <div id="app">
    <input
      type="checkbox"
      v-bind:checked="lovingVue"
      v-on:change="$emit('change', $event.target.checked)"
    />
  </div>
</template>

<script>
export default {
  name: "app",
  props: ["lovingVue"],
  model: {
    prop: "lovingVue",
    event: "change"
  }
};
</script>

// 父组件使用
<Children v-model="lovingVue"/>
```

## 2.vue 事件中传入\$event,使用 e.target 和 e.currentTarget 有什么区别？

在 vue 中绑定事件

```
<div class="outer" @click="handleClickEvent($event)">
  <div class="inner"></div>
</div>

......

handleClickEvent(e) {
  console.log("arguments :", arguments[0]); //MouseEvent
  console.log("event :", e); //MouseEvent
  console.log("e.target :", e.target); // <div class="inner"></div>
  console.log("e.currentTarget :", e.currentTarget); //<div class="outer"><div class="inner"></div></div>
}
```

这样点击内部的 inner 也能触发事件,但是 e.target 和 e.currentTarget 指向不同的对象,currentTarge 是事件绑定的元素而 target 是鼠标触发的元素

## 3.组件进来请求接口时你是放在哪个生命周期?为什么?

- created => 因为在这个生命周期我们常用到的都已经初始化好了
- 涉及到需要页面加载完成之后的话就用 mounted,可以操作 dom
- beforeCreate => beforeCreate 到 created 是同步,可以更早执行

## 4.使用计算属性的时,函数名和 data 数据源中的数据可以同名吗？

不能同名 因为不管是计算属性还是 data 还是 props 都会被挂载在 vm 实例上,因此 这三个都不能同名

## 5.vue 中 data 的属性可以和 methods 中的方法同名吗？为什么？

1.  eslint 不允许你这么做
2.  [源码地址](https://github.com/vuejs/vue/blob/77796596adc48d050beefd11e827e8e4d44c6b3c/src/core/instance/state.js#L48)`Method "${key}" has already been defined as a data property.`,

## 6.使用 vue 后怎么针对搜索引擎做 SEO 优化？

- ssr,即单页面后台渲染
- vue-meta-info 与 prerender-spa-plugin 预渲染
- nuxt
- phantomjs

## 7.怎么给 vue 定义全局的方法？

- Vue.prototype[key] = tools[key]
- Vue.mixin(mixin)全局混入 mixin
- Vue.use(plugin)
- // 创建全局方法 this.$root.$on('test', callback) , this.$root.$off 关闭,this.$root.$emit 触发

## 8.跟 keep-alive 有关的生命周期是哪些？描述下这些生命周期

- activated： 页面第一次进入的时候,钩子触发的顺序是 created->mounted->activated
- deactivated: 页面退出的时候会触发 deactivated,当再次前进或者后退的时候只触发 activated

## 9.你知道 vue 中 key 的原理吗？说说你对它的理解

作用的话,便于 diff 算法的更新,key 的唯一性,能让算法更快的找到需要更新的 dom,需要注意的是,key 要唯一,不然会出现很隐蔽性的更新问题。

[你知道 vue 中 key 的原理吗](https://www.zhihu.com/question/61064119/answer/183717717)

## 10.vue 中怎么重置 data？

vm.\$data 可以获取当前状态下的 data
vm.\$options.data 可以获取到组件初始化状态下的 data

```
Object.assign(this.$data, this.$options.data())
```

## 题目和答案来源于 [vue 每日 3 问]](https://github.com/haizlin/fe-interview/issues)
