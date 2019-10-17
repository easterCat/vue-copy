vue基本：
			var app01 = new Vue({
				el: "#app",     //里面是选择器可以是id,class,body...
				data: {
					msg: 'welcome vue'
				},
				methods: {
				}
			});

常见指令：
v-model=""		一般用于表单，双向数据绑定

循环(列表渲染):
v-for = "item in arr"    数组
(自带{{$index}}输出当前索引值)
v-for = "item in json"    json
(自带{{$index}}输出当前索引值)
(自带{{$key}}输出key值)
<li v-for="item in json">    (拥有对父作用域得完全访问权限)
	{{item}} {{$index}} {{$key}}
	<!--分别是value值,index下标,和key键值-->
</li>
v-for="(k,v) in json"    json    (可接受第二个参数当做当前项的索引值)
{{k}} {{v}} {{$index}} 

事件：
v-on:click="函数"
v-on:click/mouseout/mouseover/mousedown/dblclick



显示隐藏：
v-show='true/false'  //true/false可以是一段语句

模板：
v-once  指令，执行一次，数据改变时内容并不更新
最简单：{{ msg }}数据更新模板变化
*         ：{{ *msg }}数据只绑定一次
     ：{{{ msg }}}html转义输出

过滤器：=》过滤模板数据
{{meg | filterA}}    一个过滤器
{{meg | filterA | filterB}}    多个过滤器

{{'message' | uppercase}}     全部变为大写
{{'MESSAGE' | lowercase}}     全部变为小写
{{'message' | capitalize}}     首字母变为大写
{{'MESSAGE' | lowercase | capitalize}}     全部变为小写,首字母大写

{{12 | currency}}	钱的表示=》$12.00
{{12 | currency '￥'}}    可以传参数=》￥12.00

交互(ajax)：(v-resource已不推荐使用，改用axios)
$http	(ajax)
this.$http.get(url,[options]).then(function(res){
响应成功回调
},function(res){
响应失败回调
})
如果vue需要交互的话，要引入官方vue-resouce
get:
获取一个普通文本
this.$http.get('a.txt').then(function(res){
alert(res.data);
},function(res){
alert(res.status);
});
给服务器发送数据
this.$http.get('app.php',{
a:1,
b:2
}).then(function(res){
alert(res.data);
},function(res){
alert(res.status);
});
post:
给服务器发送数据
this.$http.post('post.php',{
a:1,
b:20
},{
emulateJSON:true
}).then(function(res){
alert(res.data);
},function(res){
alert(res.status);
});
jsonp:
https://sug.so.360.cn/suggest?callback=suggest_so&word=aiqing
给服务器发送数据
this.$http.jsonp('https://sug.so.360.cn/suggest',{
params:{
word:'123'
},
jsonp:'callback'    //callback的名字
}).then(function(res){
alert(res.data.s);
},function(res){
alert(res.status);
});

事件
v-on:click/mouseover....
|
简写：@click=' '	推荐用简写

事件对象(ev|event)
@click = 'show($event)'   传入$event当前事件对象
事件冒泡
阻止冒	泡
@click.stop = 'show($event)' >或者>直接原生ev.cancelBubble=true
默认行为(事件)
阻止默认行为
@contextmenu.prevent = 'show($event)'>或者>ev.preventDefault();
键盘事件
@keydown = 'show($event)'    ev.keyCode获取键码
@keyup
常用键
回车
@keyup.13>或者>@keyup.enter    按下了enter键
--------------------------------------------------------------------------------
属性
v-bind:src="url"(不用带大括号)	简写	:src=""

class和style
:class="">>v-bind:class=""
// []数组里面的red是data里面的数据
:class="[red]"    一个   
:class="[red,blue,green]"    多个
:class="[r,b,g]"
|
data:{
r:red,
b:blue,
g:green
}
//json里面的red是定义的class类
:class="{red:false,blue:true,green:true}" 
:class="json" 
|
date:{
json:{
red:true,
blue:false
}
}

:style="'>>v-bind:class=""
:style="[c]"
:style="[c,d]"
:style="json"
|
data: {
	json: {
		color: 'red',
		backgroundColor: 'blue'
	}
},
注意：复合样式需要驼峰写法

vue生存周期
钩子函数:
created函数	  ->当vue实例创建的时候执行
beforeCompile  ->编译之前触发
compiled		  ->编译之后触发
ready		  ->插入到文档之中
beforeDestroy    ->销毁之前
destroyed	  ->销毁之后

打开页面开始时用户会看到花括号
v-cloak防止闪烁
v-text也能防止闪烁
v-text='msgs' === {{msgs}}
v-html='msgs' ==={{{msgs}}}

计算属性的使用
computed:{
b:function(){    //默认是get方法
业务逻辑代码...
return 2;
}
}
//b属性的值完全取决于return返回值
计算属性实际上也是一个小对象
b:{
get:function(){
return 2;
},
set:function(val){	//用来设置值
this.b = val;
}
}
//一定要return
vue实例的简单方法
vm.$el  ->就是元素
vm.$data  ->就是data
vm.$mount  ->手动挂载vue程序
vm.$options  ->获取自定义属性
vm.$log()  ->查看现在数据的状态
vm.$destroy  ->销毁对象

循环重复
v-for="item in data"
但是数据重复会warn、
可以添加track-by='$index'来解决