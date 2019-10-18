## 1.React 如何进行代码拆分？拆分的原则是什么？

这里我认为 react 的拆分前提是代码目录设计规范，模块定义规范，代码设计规范，符合程序设计的一般原则，例如高内聚、低耦合等等。

在我们的 react 项目中：

- 在 api 层面我们单独封装，对外暴露 http 请求的结果。
- 数据层我们使用的 react-redux 异步中间件使用的是 redux-thunk 分装处理异步请求，合业务逻辑处理。
- 试图层，尽量使用 redux 层面的传递过来的数据，修改逻辑 也是重新触发 action 更改 props。
- 静态类型的资源单独放置
- 公共组件、高阶组件、插件单独放置
- 工具类文件单独放置

## 2.React 组件的构造函数有什么作用？

在 react 的新的写法中，每一个组件都是一个类，这个很符合 es6 的语法规范，在 es6 中要想创建一个对象，就要调用相应的构造函数, react 的组件渲染有两种情况，第一种情况是第一次渲染，第二种情况是状态更新时候重新渲染,构造函数在组件的初次渲染中只会运行一次，构造函数里进行的操作一般有三种用途：

- 指定 this --> super(props)
- 设置初始化的状态 --> this.setState({});
- 为组件上的构造函数绑定 this

## 3.React 组件的构造函数是必须的吗？

构造函数并不是必须的,对于无状态组件，内部没有维护自己的 state，只接收外部传入的 props 是不需要声明构造函数的

## 4.React 中在哪捕获错误？

在 react 15 极其以前的版本中,组件内的 UI 异常将中断组件内部状态，导致下一次渲染时触发隐藏异常。React 并未提供友好的异常捕获和处理方式，一旦发生异常，应用将不能很好的运行。而 React 16 版本有所改进。

组件内异常，也就是异常边界组件能够捕获的异常，主要包括：

- 渲染过程中异常；
- 生命周期方法中的异常；
- 子组件树中各组件的 constructor 构造函数中异常。

当然异常边界也有一些无法捕获的异常，主要是异步及服务端触发异常：

- 事件处理器中的异常；
- 异步任务异常，如 setTiemout，ajax 请求异常等；
- 服务端渲染异常；
- 异常边界组件自身内的异常；

## 5.为什么说 React 中的 props 是只读的？

react 官方文档中说道，组件无论是使用函数声明还是通过 class 声明，都绝不能修改自身的 props，props 作为组件对外通信的一个接口，为了保证组件像纯函数一样没有响应的副作用，所有的组件都必须像纯函数一样保护它们的 props 不被修改

## 6.你有使用过 formik 库吗？说说它的优缺点

formik 和 redux-form 一样,是一个 react 表单的解决方案

## 7.如果组件的属性没有传值，那么它的默认值是什么？

默认值是 undefined

## 8. `super()`和`super(props)`有什么区别？

react 中的 class 是基于 es6 的规范实现的, 继承是使用 extends 关键字实现继承的，子类必须在 constructor()中调用 super() 方法否则新建实例
就会报错，报错的原因是 子类是没有自己的 this 对象的，它只能继承父类的 this 对象，然后对其进行加工，而 super()就是将父类中的 this 对象继承给子类的，没有 super() 子类就得不到 this 对象。

如果你使用了 constructor 就必须写 super() 这个是用来初始化 this 的，可以绑定事件到 this 上
如果你想要在 constructor 中使用 this.props,就必须给 super 添加参数 super(props)
注意，无论有没有 constructor，在 render 中的 this.props 都是可以使用的，这是 react 自动附带的
如果没有用到 constructor 是可以不写的，react 会默认添加一个空的 constroctor.

## 9.你有使用过 loadable 组件吗？它帮我们解决了什么问题？

用于代码分割的高阶组件,使用异步组件解决组件加载速度

## 10.你有使用过 suspense 组件吗？它帮我们解决了什么问题？

React.lazy 提供了一种非常简便的方法动态导入组件，实现按需加载与代码分割

Suspense 组件用于包装 lazy 组件，在 lazy 组件还没有完全加载时，将 fallback 内容呈现给用户。

用动态加载，编译时会将文件分割，从加载文件到呈现会有时间延迟，此时可以使用 Suspense 展示一个 loading。

## 11.怎样动态导入组件？

- 自己使用 import 和 async/await 实现的异步组件
- [React.lazy](https://reactjs.org/docs/code-splitting.html#reactlazy)
- 开源库 react-loadable 库/react-lazyload 库
- babel 动态导入（Dynamic Import）

## 12.React 必须使用 JSX 吗？

首先解释一下什么是 JSX,是 JavaScript 的语法扩展，可以让我们编写像 html 一样的代码，在 JSX 中使用的”元素“，不局限于 HTML 中的元素，可以是任何一个 react 组件。

react 判断一个元素是 HTML 元素还是 react 组件的原则就是看第一个字母是否大写。

jsx 是进步还是倒退呢？开始的时候大家对于这种书写方式是诟病的，但是后来被大家认可，根据同一件事情的代码应该具有高耦合性的设计原则，react 的设计正好也是符合这种的

## 13.需要把 keys 设置为全局唯一吗？

不需要,key 是用来进行 diff 算法的时候进行同层比较,准备的说 key 只需要在兄弟节点之间唯一,一般情况 key 选取是后端定义的 id.万不得已的时候可以选择 index(选择 index 是万不得已的选择,因为选择了 index 后,一些操作会改变 index 的值,违背了唯一不变,在进行 diff 算法的时候出现问题)

## 题目和答案来源于 [react 每日 3 问]](https://github.com/haizlin/fe-interview/blob/master/lib/React.md)
