## 1.render 函数中 return 如果没有使用()会有什么问题？

我们在使用 JSX 语法书写 react 代码时，babel 会将 JSX 语法编译成 js，同时会在每行自动添加分号（；），如果 return 后换行了，那么就会变成 return；

渲染没有返回任何内容。这通常意味着缺少 return 语句。或者，为了不渲染，返回 null。

为了代码可读性我们一般会在 return 后面添加括号这样代码可以折行书写，否则就在 return 后面紧跟着语句.

错误

```
const Nav = () => {
  return
    <nav className="c_navbar">
      { some jsx magic here }
    </nav>
}
```

## 2.componentWillUpdate 可以直接修改 state 的值吗？

react 组件在每次需要重新渲染时候都会调用 componentWillUpdate(),

例如，我们调用 this.setState()时候

在这个函数中我们之所以不调用 this.setState()是因为该方法会触发另一个 componentWillUpdate(),如果我们 componentWillUpdate()中触发状态更改,我们将以无限循环.

## 3.什么渲染劫持？

首先，什么是渲染劫持：渲染劫持的概念是控制组件从另一个组件输出的能力，当然这个概念一般和 react 中的高阶组件（HOC）放在一起解释比较有明了。

高阶组件可以在 render 函数中做非常多的操作，从而控制原组件的渲染输出，只要改变了原组件的渲染，我们都将它称之为一种渲染劫持。

实际上，在高阶组件中，组合渲染和条件渲染都是渲染劫持的一种，通过反向继承，不仅可以实现以上两点，还可以增强由原组件 render 函数产生的 React 元素。

实际的操作中 通过 操作 state、props 都可以实现渲染劫持

## 4.React Intl

react-intl 实现 React 国际化多语言

## 5.说说 Context 有哪些属性？

新版本的 context api 中 常用的只有 Provider 和 Consumer 两个对象

## 6.怎么使用 Context 开发组件？

```
import React, {Component} from 'react'

// 首先创建一个 context 对象这里命名为：ThemeContext
const ThemeContext = React.createContext('light')

// 创建一个祖先组件组件 内部使用Provier 这个对象创建一个组件 其中 value 属性是真实传递的属性
class App extends Component {
  render () {
    return (
      <ThemeContext.Provider value="dark">
        <Toolbar />
      </ThemeContext.Provider>
    )
  }
}

// 渲染 button 组件的外层包裹的属性
function Toolbar () {
  return (
    <div>
      <ThemeButton />
    </div>
  )
}
// 在 Toolbar 中渲染的button 组件 返回一个 consumer （消费者）将组件组件的 value 值跨组件传递给 // ThemeButton 组件
function ThemeButton (props) {
  return (
    <ThemeContext.Consumer>
      { theme => <button {...props} theme={theme}>{theme}</button> }
    </ThemeContext.Consumer>
  )
}
```

## 7.为什么 React 并不推荐我们优先考虑使用 Context？

- Context 目前还处于实验阶段，可能会在后面的发行版本中有很大的变化，事实上这种情况已经发生了，所以为了避免给今后升级带来大的影响和麻烦，不建议在 app 中使用 context。
- 尽管不建议在 app 中使用 context，但是独有组件而言，由于影响范围小于 app，如果可以做到高内聚，不破坏组件树之间的依赖关系，可以考虑使用 context
- 对于组件之间的数据通信或者状态管理，有效使用 props 或者 state 解决，然后再考虑使用第三方的成熟库进行解决，以上的方法都不是最佳的方案的时候，在考虑 context。
- context 的更新需要通过 setState()触发，但是这并不是很可靠的，Context 支持跨组件的访问，但是如果中间的子组件通过一些方法不影响更新，比如 shouldComponentUpdate() 返回 false 那么不能保证 Context 的更新一定可以使用 Context 的子组件，因此，Context 的可靠性需要关注。

## 8.React15 和 16 别支持 IE 几以上？

React15 版本不直接支持 IE8 浏览器的，官方文档中说 React16 中依赖于集合类型 Map 和 Set 因此不再支持 IE 11 以下的浏览器，如果想要支持，需要使用全局的 polyfill

## 9.举例说明 React 的插槽有哪些运用场景？

对于 portal 的一个典型用例是当父组件有 overflow: hidden 或 z-index 样式，但你需要子组件能够在视觉上 “跳出(break out)” 其容器。例如，对话框、hovercards 以及提示框。所以一般 react 组件里的模态框，就是这样实现的

## 10.你有用过 React 的插槽(Portals)吗？怎么用？

- 首先简单的介绍下 react 中的插槽（Portals），通过 ReactDOM.createPortal(child, container)创建，是 ReactDOM 提供的接口，可以实现将子节点渲染到父组件 DOM 层次结构之外的 DOM 节点。
- 第一个参数（child）是任何可渲染的 React 子元素，例如一个元素，字符串或 片段(fragment)。第二个参数（container）则是一个 DOM 元素。
- 对于 portal 的一个典型用例是当父组件有 overflow: hidden 或 z-index 样式，但你需要子组件能够在视觉上 “跳出(break out)” 其容器。例如，对话框、hovercards 以及提示框。所以一般 react 组件里的模态框，就是这样实现的。

## 11.React 的严格模式有什么用处？

react 的 strictMode 是一个突出显示应用程序中潜在问题的工具，与 Fragment 一样，strictMode 不会渲染任何的可见 UI，它为其后代元素触发额外的检查和警告。

注意：严格模式仅在开发模式下运行，它们不会影响生产构建

可以为程序的任何部分使用严格模式

```
import React from 'react';

function ExampleApplication() {
  return (
    <div>
      <Header />
      <React.StrictMode>
        <div>
          <ComponentOne />
          <ComponentTwo />
        </div>
      </React.StrictMode>
      <Footer />
    </div>
  );
}
```

在上述的示例中，不会对 Header 和 Footer 组件运行严格模式检查。但是，ComponentOne 和 ComponentTwo 以及它们的所有后代元素都将进行检查。

StrictMode 目前有助于：

- 识别不安全的生命周期
- 关于使用过时字符串 ref API 的警告
- 关于使用废弃的 findDOMNode 方法的警告
- 检测意外的副作用
- 检测过时的 context API

## 题目和答案来源于 [react 每日 3 问]](https://github.com/haizlin/fe-interview/blob/master/lib/React.md)
