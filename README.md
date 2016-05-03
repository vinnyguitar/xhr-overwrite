#xhr-overwrite
xhr-overwrite提供了一种重写XMLHttpRequest(ie ActiveXObject)的机制，可用于在底层对ajax进行统一拦截和处理。一个常见的应用场景是http请求加密。大多数前端框架都会提供一种拦截器的机制，可以在拦截器中处理请求加密。但也有些框架并未提供拦截器，又或是你的项目同时使用了多个框架，各个框架的拦截器实现并不一样。这个时候xhr-overwrite就能发挥作用了，它能在xhr底层进行了拦截，对上层框架来说是完全透明的。
### 安装
npm：npm i xhr-overwrite --save

浏览器：直接在浏览器引入xhr-overwrite.min.js。

注意：xhr-overwrite的引入一定要在其他前端框架之前，否则不能有效拦截。
### 使用
```
xhrOverwrite({
	open: function(method, url, async) {
		// do some before open
		this.xhr.open(method, url);
	},
	send: function(data) {
		// do some before send
		this.xhr.send(data);
	}
});
```
xhrOverwrite(options)为一全局方法，可在options中指定需要重写的方法。重写方法的this指向xhr的包装类型的实例，this.xhr字段指向真实的xhr。

### 兼容性
兼容chrome、ff、safari和ie6+。
