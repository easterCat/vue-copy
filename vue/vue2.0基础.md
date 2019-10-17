## vue实例

- 所有的 Vue 组件都是 Vue 实例，并且接受相同的选项对象

- 当一个 Vue 实例被创建时，它将 data 对象中的所有的属性加入到 Vue 的响应式系统中。当这些属性的值发生改变时，视图将会产生“响应”，即匹配更新为新的值

- Vue 实例还暴露了一些有用的实例属性与方法。它们都有前缀 $，以便与用户定义的属性区分开来。 [api](https://cn.vuejs.org/v2/api/#%E5%AE%9E%E4%BE%8B%E5%B1%9E%E6%80%A7)

```
var app01 = new Vue({
  el: "#app",     //里面是选择器可以是id,class,body...
  data: {
    msg: 'welcome vue'
  },
  methods: {
  }
});
```

#### vue实例的简单方法
- vm.$el  ->就是元素
- vm.$data  ->就是data
- vm.$mount  ->手动挂载vue程序
- vm.$options  ->获取自定义属性
- vm.$log()  ->查看现在数据的状态
- vm.$destroy  ->销毁对象

#### 生命周期

[01](https://github.com/easterCat/common_js/blob/master/vue/img/01.png?raw=true)

## template模板

[render-function](https://cn.vuejs.org/v2/guide/render-function.html)

[实例属性](https://cn.vuejs.org/v2/api/#%E5%AE%9E%E4%BE%8B%E5%B1%9E%E6%80%A7)

#### 文本插值
```
<span>Message: {{ msg }}</span>
```

#### v-once  指令，执行一次，数据改变时内容并不更新
```
<span v-once>这个将不会改变: {{ msg }}</span>
```

> 旧版 ：{{ *msg }}数据只绑定一次

#### 原始 HTML

```
<p>Using v-html directive: <span v-html="rawHtml"></span></p>
```
       
> 旧版 ： ：{{{ msg }}}html转义输出

#### 使用 JavaScript 表达式

```
{{ number + 1 }}

{{ ok ? 'YES' : 'NO' }}

{{ message.split('').reverse().join('') }}

<div v-bind:id="'list-' + id"></div>
```

> 每个绑定都只能包含单个表达式

#### 指令

指令 (Directives) 是带有 v- 前缀的特殊特性。

###### 常见指令

- v-model=""		一般用于表单，双向数据绑定
- v-for = "item in arr"    数组
- v-on:click="函数"
- v-bind:参数="值"
- v-show='true/false'  //true/false可以是一段语句

#### 参数

一些指令能够接收一个“参数”，在指令名称之后以冒号表示。

```
<a v-bind:href="url">...</a>
```

在这里 href 是参数，告知 v-bind 指令将该元素的 href 特性与表达式 url 的值绑定。

#### 动态参数(new)

```
<a v-bind:[attributeName]="url"> ... </a>


{
  data:{
    return {
      attributeName:'href',
      url:'www.baidu.com',
    }
  }
}
```
这里的 attributeName 会被作为一个 JavaScript 表达式进行动态求值，求得的值将会作为最终的参数来使用。总之就是之前能够动态改变绑定的参数的值，现在绑定的参数也可以动态改变。

> 用于动态切换绑定的事件比较好用，mouseenter,mouseleave

#### 修饰符

修饰符 (modifier) 是以半角句号 . 指明的特殊后缀，用于指出一个指令应该以特殊方式绑定。例如，.prevent 修饰符告诉 v-on 指令对于触发的事件调用 event.preventDefault()

```
<form v-on:submit.prevent="onSubmit">...</form>
```

#### v-bind 缩写

```
<!-- 完整语法 -->
<a v-bind:href="url">...</a>

<!-- 缩写 -->
<a :href="url">...</a>
```

#### v-on 缩写

```
<!-- 完整语法 -->
<a v-on:click="doSomething">...</a>

<!-- 缩写 -->
<a @click="doSomething">...</a>
```

## 计算属性

任何复杂逻辑，你都应当使用计算属性

#### 计算属性的使用

```
  computed: {
    // 计算属性的 getter
    reversedMessage: function () {
      // `this` 指向 vm 实例
      return this.message.split('').reverse().join('')
    }
  }
```

这里我们声明了一个计算属性 reversedMessage。我们提供的函数将用作属性 vm.reversedMessage 的 getter 函数：

```
console.log(vm.reversedMessage) // => 'olleH'
vm.message = 'Goodbye'
console.log(vm.reversedMessage) // => 'eybdooG'
```

#### 计算属性缓存 vs 方法

在表达式中调用方法来达到同样的效果

```
<p>Reversed message: "{{ reversedMessage() }}"</p>

// 在组件中
methods: {
  reversedMessage: function () {
    return this.message.split('').reverse().join('')
  }
}
```

> 两种方式的最终结果确实是完全相同的。然而，不同的是计算属性是基于它们的响应式依赖进行缓存的。只在相关响应式依赖发生改变时它们才会重新求值。这就意味着只要 message 还没有发生改变，多次访问 reversedMessage 计算属性会立即返回之前的计算结果，而不必再次执行函数。

#### 计算属性 vs 侦听属性

通常更好的做法是使用计算属性而不是命令式的 watch 回调

```
var vm = new Vue({
  el: '#demo',
  data: {
    firstName: 'Foo',
    lastName: 'Bar',
    fullName: 'Foo Bar'
  },
  watch: {
    firstName: function (val) {
      this.fullName = val + ' ' + this.lastName
    },
    lastName: function (val) {
      this.fullName = this.firstName + ' ' + val
    }
  }
})


//计算属性
var vm = new Vue({
  el: '#demo',
  data: {
    firstName: 'Foo',
    lastName: 'Bar'
  },
  computed: {
    fullName: function () {
      return this.firstName + ' ' + this.lastName
    }
  }
})
```

#### 计算属性的 setter

计算属性默认只有 getter ，不过在需要时你也可以提供一个 setter ：

```
// ...
computed: {
  fullName: {
    // getter
    get: function () {
      return this.firstName + ' ' + this.lastName
    },
    // setter
    set: function (newValue) {
      var names = newValue.split(' ')
      this.firstName = names[0]
      this.lastName = names[names.length - 1]
    }
  }
}
// ...
```

#### 侦听器

当需要在数据变化时执行异步或开销较大的操作时，这个方式是最有用的。

[vm.$watch API](https://cn.vuejs.org/v2/api/#vm-watch)

## Class 与 Style 绑定

在将 v-bind 用于 class 和 style 时，Vue.js 做了专门的增强,表达式结果的类型除了字符串之外，还可以是对象或数组

#### 绑定 HTML Class 

```
//对象语法
<div v-bind:class="{ active: isActive }"></div>

//v-bind:class 指令也可以与普通的 class 属性共存
<div class="static" v-bind:class="{ active: isActive, 'text-danger': hasError }"></div>

//返回对象的计算属性
<div v-bind:class="classObject"></div>

data: {
  isActive: true,
  error: null
},
computed: {
  classObject: function () {
    return {
      active: this.isActive && !this.error,
      'text-danger': this.error && this.error.type === 'fatal'
    }
  }
}

//数组语法
<div v-bind:class="[activeClass, errorClass]"></div>

data: {
  activeClass: 'active',
  errorClass: 'text-danger'
}

//用三元表达式
<div v-bind:class="[isActive ? activeClass : '', errorClass]"></div>

//数组语法中也可以使用对象语法
<div v-bind:class="[{ active: isActive }, errorClass]"></div>
```

#### 绑定内联样式

```
//对象语法
<div v-bind:style="{ color: activeColor, fontSize: fontSize + 'px' }"></div>

data: {
  activeColor: 'red',
  fontSize: 30
}

//样式对象
<div v-bind:style="styleObject"></div>

data: {
  styleObject: {
    color: 'red',
    fontSize: '13px'
  }
}

//数组语法
<div v-bind:style="[baseStyles, overridingStyles]"></div>

//多重值
<div :style="{ display: ['-webkit-box', '-ms-flexbox', 'flex'] }"></div>
```

[术语表 Truthy](https://developer.mozilla.org/zh-CN/docs/Glossary/Truthy)

## 条件渲染

#### v-if 、 v-else

```
<h1 v-if="awesome">Vue is awesome!</h1>
<h1 v-else>Oh no 😢</h1>
```
> v-else 元素必须紧跟在带 v-if 或者 v-else-if 的元素的后面，否则它将不会被识别

#### 在 <template> 元素上使用 v-if 条件渲染分组

可以把一个 <template> 元素当做不可见的包裹元素，并在上面使用 v-if。最终的渲染结果将不包含 <template> 元素。

```
<template v-if="ok">
  <h1>Title</h1>
  <p>Paragraph 1</p>
  <p>Paragraph 2</p>
</template>
```

#### v-else-if(new)

```
<div v-if="type === 'A'">
  A
</div>
<div v-else-if="type === 'B'">
  B
</div>
<div v-else-if="type === 'C'">
  C
</div>
<div v-else>
  Not A/B/C
</div>
```

> v-else-if 也必须紧跟在带 v-if 或者 v-else-if 的元素之后

#### 用 key 管理可复用的元素

Vue 会尽可能高效地渲染元素，通常会复用已有元素而不是从头开始渲染。这时候可以通过添加key值来区分

```
<template v-if="loginType === 'username'">
  <label>Username</label>
  <input placeholder="Enter your username" key="username-input">
</template>
<template v-else>
  <label>Email</label>
  <input placeholder="Enter your email address" key="email-input">
</template>
```

> <label> 元素仍然会被高效地复用，因为它们没有添加 key 属性

#### v-show

将元素隐藏，v-show 只是简单地切换元素的 CSS 属性 display。v-show 不支持 <template> 元素，也不支持 v-else。

#### v-if vs v-show

- v-if 是“真正”的条件渲染，因为它会确保在切换过程中条件块内的事件监听器和子组件适当地被销毁和重建。
- v-if 也是惰性的：如果在初始渲染时条件为假，则什么也不做——直到条件第一次变为真时，才会开始渲染条件块。
- 相比之下，v-show 就简单得多——不管初始条件是什么，元素总是会被渲染，并且只是简单地基于 CSS 进行切换。
- 一般来说，v-if 有更高的切换开销，而 v-show 有更高的初始渲染开销。因此，如果需要非常频繁地切换，则使用 v-show 较好；如果在运行时条件很少改变，则使用 v-if 较好。

#### v-if 与 v-for 一起使用

当 v-if 与 v-for 一起使用时，v-for 具有比 v-if 更高的优先级。[列表渲染指南](https://cn.vuejs.org/v2/style-guide/#%E9%81%BF%E5%85%8D-v-if-%E5%92%8C-v-for-%E7%94%A8%E5%9C%A8%E4%B8%80%E8%B5%B7-%E5%BF%85%E8%A6%81)

## 列表渲染

我们用 v-for 指令根据一组数组的选项列表进行渲染。在 v-for 块中，我们拥有对父作用域属性的完全访问权限。v-for 还支持一个可选的第二个参数为当前项的索引。

```
<ul id="example-2">
  <li v-for="(item, index) in items">
    {{ parentMessage }} - {{ index }} - {{ item.message }}
  </li>
</ul>
```

> 你也可以用 of 替代 in 作为分隔符，因为它是最接近 JavaScript 迭代器的语法：

#### 一个对象的 v-for

第一个的参数为值，第二个的参数为键名，第三个参数为索引。

```
<div v-for="(value, key, index) in object">
  {{ index }}. {{ key }}: {{ value }}
</div>

data: {
  object: {
    firstName: 'John',
    lastName: 'Doe',
    age: 30
  }
}
```

#### key

为了给 Vue 一个提示，以便它能跟踪每个节点的身份，从而重用和重新排序现有元素，你需要为每项提供一个唯一 key 属性。

```
<div v-for="item in items" :key="item.id">
  <!-- 内容 -->
</div>
```

#### 数组更新检测

Vue 包含一组观察数组的变异方法，所以它们也将会触发视图更新

变异方法 (mutation method)，顾名思义，会改变被这些方法调用的原始数组。

非变异 (non-mutating method) 方法，例如：filter(), concat() 和 slice() 。这些不会改变原始数组，但总是返回一个新数组。

- push()
- pop()
- shift()
- unshift()
- splice()
- sort()
- reverse()


由于 JavaScript 的限制，Vue 不能检测以下变动的数组：

1. 当你利用索引直接设置一个项时，例如：vm.items[indexOfItem] = newValue
2. 当你修改数组的长度时，例如：vm.items.length = newLength

问题一
```
// Vue.set
Vue.set(vm.items, indexOfItem, newValue)
vm.$set(vm.items, indexOfItem, newValue)

// Array.prototype.splice
vm.items.splice(indexOfItem, 1, newValue)
```

问题二
```
vm.items.splice(newLength)
```

还是由于 JavaScript 的限制，Vue 不能检测对象属性的添加或删除：

Vue 不能动态添加根级别的响应式属性。但是，可以使用 Vue.set(object, key, value) 方法向嵌套对象添加响应式属性。

```
var vm = new Vue({
  data: {
    userProfile: {
      name: 'Anika'
    }
  }
})


Vue.set(vm.userProfile, 'age', 27)
vm.$set(vm.userProfile, 'age', 27)
```

为已有对象赋予多个新属性
```
vm.userProfile = Object.assign({}, vm.userProfile, {
  age: 27,
  favoriteColor: 'Vue Green'
})
```

#### 显示过滤/排序结果

数组的过滤或排序副本，而不实际改变或重置原始数据。在这种情况下，可以创建返回过滤或排序数组的计算属性，还可以使用一个 method 方法


#### 一段取值范围的 v-for

v-for 也可以取整数。在这种情况下，它将重复多次模板。

```
<div>
  <span v-for="n in 10">{{ n }} </span>
</div>
```

#### v-for on a <template>

```
<ul>
  <template v-for="item in items">
    <li>{{ item.msg }}</li>
    <li class="divider" role="presentation"></li>
  </template>
</ul>
```

#### v-for with v-if

当它们处于同一节点，v-for 的优先级比 v-if 更高，这意味着 v-if 将分别重复运行于每个 v-for 循环中。可以将 v-if 置于外层元素 (或 <template>)上。

```
<ul v-if="todos.length">
  <li v-for="todo in todos">
    {{ todo }}
  </li>
</ul>
<p v-else>No todos left!</p>
```

## 监听事件

v-on:事件

```
 <button v-on:click="counter += 1">Add 1</button>
 <button v-on:click="greet">Greet</button>
 <button v-on:click="say('hi')">Say hi</button>
 
 
 //有时也需要在内联语句处理器中访问原始的 DOM 事件。可以用特殊变量 $event 把它传入方法
 <button v-on:click="warn('Form cannot be submitted yet.', $event)">Submit</button>
```

#### 事件修饰符

- .stop
- .prevent
- .capture
- .self
- .once
- .passive

```
<!-- 阻止单击事件继续传播 -->
<a v-on:click.stop="doThis"></a>

<!-- 提交事件不再重载页面 -->
<form v-on:submit.prevent="onSubmit"></form>

<!-- 修饰符可以串联 -->
<a v-on:click.stop.prevent="doThat"></a>

<!-- 只有修饰符 -->
<form v-on:submit.prevent></form>

<!-- 添加事件监听器时使用事件捕获模式 -->
<!-- 即元素自身触发的事件先在此处理，然后才交由内部元素进行处理 -->
<div v-on:click.capture="doThis">...</div>

<!-- 只当在 event.target 是当前元素自身时触发处理函数 -->
<!-- 即事件不是从内部元素触发的 -->
<div v-on:click.self="doThat">...</div>

<!-- 点击事件将只会触发一次 -->
<a v-on:click.once="doThis"></a>

<!-- 滚动事件的默认行为 (即滚动行为) 将会立即触发 -->
<!-- 而不会等待 `onScroll` 完成  -->
<!-- 这其中包含 `event.preventDefault()` 的情况 -->
<div v-on:scroll.passive="onScroll">...</div>
```

> 使用修饰符时，顺序很重要；相应的代码会以同样的顺序产生。因此，用 v-on:click.prevent.self 会阻止所有的点击，而 v-on:click.self.prevent 只会阻止对元素自身的点击。(修饰符可以串联 )

> 不要把 .passive 和 .prevent 一起使用，因为 .prevent 将会被忽略，同时浏览器可能会向你展示一个警告。请记住，.passive 会告诉浏览器你不想阻止事件的默认行为。


#### 按键修饰符

你可以直接将 KeyboardEvent.key 暴露的任意有效按键名转换为 kebab-case 来作为修饰符。

```
<!-- 只有在 `key` 是 `Enter` 时调用 `vm.submit()` -->
<input v-on:keyup.enter="submit">
```

- .enter
- .tab
- .delete (捕获“删除”和“退格”键)
- .esc
- .space
- .up
- .down
- .left
- .right

通过全局 config.keyCodes 对象自定义按键修饰符别名
```
// 可以使用 `v-on:keyup.f1`
Vue.config.keyCodes.f1 = 112
```

#### 系统修饰键

- .ctrl
- .alt
- .shift
- .meta

```
<!-- Alt + C -->
<input @keyup.alt.67="clear">

<!-- Ctrl + Click -->
<div @click.ctrl="doSomething">Do something</div>
```

#### .exact 修饰符

.exact 修饰符允许你控制由精确的系统修饰符组合触发的事件。

```
<!-- 即使 Alt 或 Shift 被一同按下时也会触发 -->
<button @click.ctrl="onClick">A</button>

<!-- 有且只有 Ctrl 被按下的时候才触发 -->
<button @click.ctrl.exact="onCtrlClick">A</button>

<!-- 没有任何系统修饰符被按下的时候才触发 -->
<button @click.exact="onClick">A</button>
```

#### 鼠标按钮修饰符

- .left
- .right
- .middle

## 表单输入绑定

你可以用 v-model 指令在表单 <input>、<textarea> 及 <select> 元素上创建双向数据绑定。

v-model 在内部使用不同的属性为不同的输入元素并抛出不同的事件：

- text 和 textarea 元素使用 value 属性和 input 事件；
- checkbox 和 radio 使用 checked 属性和 change 事件；
- select 字段将 value 作为 prop 并将 change 作为事件。


#### 修饰符

- .lazy
- .number 如果想自动将用户的输入值转为数值类型
- .trim 自动过滤用户输入的首尾空白字符

## 过滤器

过滤器可以用在两个地方：双花括号插值和 v-bind 表达式

```
<!-- 在双花括号中 -->
{{ message | capitalize }}

<!-- 在 `v-bind` 中 -->
<div v-bind:id="rawId | formatId"></div>
```


本地的过滤器

```
filters: {
  capitalize: function (value) {
    if (!value) return ''
    value = value.toString()
    return value.charAt(0).toUpperCase() + value.slice(1)
  }
}
```

全局定义过滤器
```
Vue.filter('capitalize', function (value) {
  if (!value) return ''
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
})

new Vue({
  // ...
})
```

{{meg | filterA}}    一个过滤器
{{meg | filterA | filterB}}    多个过滤器
{{meg | filterA | filterB('arg','arg2')}}    接收参数

{{'message' | uppercase}}     全部变为大写
{{'MESSAGE' | lowercase}}     全部变为小写
{{'message' | capitalize}}     首字母变为大写
{{'MESSAGE' | lowercase | capitalize}}     全部变为小写,首字母大写

{{12 | currency}}	钱的表示=》$12.00
{{12 | currency '￥'}}    可以传参数=》￥12.00
