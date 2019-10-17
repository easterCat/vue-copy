### 问题

vue 跳转外部链接问题,当跳转的时候会添加在当前地址后面

```
var url = 'www.baidu.com'

//跳转1
window.localtion.href = url

//跳转2
window.history.pushState(url);
window.history.replaceState(url);

//跳转3
window.open(url,"_blank");

//跳转4
var a = document.createElement("a");
a.setAttribute("href", "www.baidu.com");
a.setAttribute("target", "_blank");
a.click();
```

```
http://192.168.0.139:8080/#/
http://192.168.0.139:8080/www.baidu.com#/
```

> 这时将 url 前面添加响应的 http 协议就好了(http:// 或 https://)

```
var p = window.location.protocol;
var a = document.createElement("a");
a.setAttribute("href", `${p}//www.baidu.com`);
a.setAttribute("target", "_blank");
a.click();
document.getElementsByTagName("body")[0].appendChild(a);
```
