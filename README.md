[![npm](https://img.shields.io/npm/v/xhr-overwrite.svg?maxAge=2592000)](https://www.npmjs.com/package/xhr-overwrite)
#xhr-overwrite
xhr-overwrite提供了一种重写XMLHttpRequest(ie下为ActiveXObject)的机制，可对常见的open、send等方法进行重写。大部分前端框架都有和jQuery beforeSend类似的拦截器机制，允许在请求发送前进行某些处理。xhr-overwrite则是在xhr底层做了包装，不依赖任何框架，对上层框架是透明的。

一个常见的应用场景是跨项目的前端http请求加密。不同项目使用了不同的前端框架，但请求加密的算法是一样的。此时可以通过xhr-orverwrite在xhr底层做统一的处理，否则就需要针对不同的框架编写不同的代码。
### 安装
####npm
```
npm i xhr-overwrite --save
```

####浏览器
直接引入xhr-overwrite.min.js。

注意：xhr-overwrite的引入一定要在其他前端框架之前，否则将不能有效拦截。
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

## License
MIT:[http://vinnyguitar.mit-license.org]()
