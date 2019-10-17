## 1.Vue.observable 你有了解过吗？说说看

vue2.6 发布一个新的 API,让一个对象可响应.Vue 内部会用它来处理 data 函数返回的对象.返回的对象可以直接用于渲染函数和计算属性内,并且会在发生改变时触发相应的更新；也可以作为最小化的跨组件状态存储器.

## 2.你知道 style 加 scoped 属性的用途和原理吗？

用途：防止全局同名 CSS 污染
原理：在标签加上 v-data-something 属性,再在选择器时加上对应[v-data-something],即 CSS 带属性选择器,以此完成类似作用域的选择方式

## 3.如何在子组件中访问父组件的实例？

this.$parent拿到父组件实例
this.$children 拿到子组件实例（数组）
无限循环调用 this.\$parent 直到没有这个属性为止访问到根实例

子=>父(:event / $emit) 父=>子(this.$refs)

[父=>子](https://www.cnblogs.com/jin-zhe/p/9523029.html)
[子=>父](https://www.cnblogs.com/jin-zhe/p/9523782.html)

## 4.watch 的属性用箭头函数定义结果会怎么样？

因为箭头函数默绑定父级作用域的上下文,所以不会绑定 vue 实例,所以 this 是 undefind

## 5.你有使用过 babel-polyfill 模块吗？主要是用来做什么的？

babel 默认只转换语法,而不转换新的 API,如需使用新的 API,还需要使用对应的转换插件或者 polyfill 去模拟这些新特性.

## 6.说说你对 vue 的错误处理的了解？

分为 errorCaptured 与 errorHandler.
errorCaptured 是组件内部钩子,可捕捉本组件与子孙组件抛出的错误,接收 error、vm、info 三个参数,return false 后可以阻止错误继续向上抛出.
errorHandler 为全局钩子,使用 Vue.config.errorHandler 配置,接收参数与 errorCaptured 一致,2.6 后可捕捉 v-on 与 promise 链的错误,可用于统一错误处理与错误兜底.
[5 种处理 Vue 异常的方法](http://www.imooc.com/article/288017?block_id=tuijian_wz)

## 7.vue 怎么实现强制刷新组件？

- this.\$forceUpdate() 强制重新渲染
- `<Component :key="theKey"/>` 模版上绑定 key,然后修改 data 中的 keys,强制重新刷新某组件

## 8.vue 给组件绑定自定义事件无效怎么解决？

- 组件外部加修饰符.navtive
- 组件内部声明\$emit('自定义事件')

## 9.vue 如果想扩展某个现有的组件时,怎么做呢？

- 使用 Vue.extend 直接扩展
- 使用 Vue.mixin 全局混入
- HOC 封装
- 加 slot 扩展

## 10.v-once 的使用场景有哪些？

表单提交(单次触发的场景).可防止用户在请求未及时响应时,多次提交.
