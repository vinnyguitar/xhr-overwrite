/**
 * xhr overwrite
 * mit
 */
var overwriteXhr = (function () {
    var CB_REG = /^on[a-z]+$/;
    var CST_REG = /^[A-Z]+$/;

    var FieldType = {
        config: 1,
        status: 2,
        method: 3,
        callback: 4,
        constant: 5
    };
    var BasicFields = {
        timeout: FieldType.config,
        withCredentials: FieldType.config,
        readyState: FieldType.status,
        response: FieldType.status,
        responseText: FieldType.status,
        responseBody: FieldType.status,
        responseType: FieldType.status,
        responseURL: FieldType.status,
        responseXML: FieldType.status,
        status: FieldType.status,
        statusText: FieldType.status,
        abort: FieldType.method,
        getAllResponseHeaders: FieldType.method,
        getResponseHeader: FieldType.method,
        open: FieldType.method,
        send: FieldType.method,
        setRequestHeader: FieldType.method,
        onreadystatechange: FieldType.callback,
        ontimeout: FieldType.callback
    };

    var XHR = window.XMLHttpRequest;

    return function overwrite(methods) {
        if (methods) {
            window.XMLHttpRequest = XHRWrapper;
        }

        function XHRWrapper() {
            var xhr = getXhr(),
                confFields = [],
                statusFields = [],
                fields = {};
            this.xhr = xhr;
            this.constructor = XHRWrapper;
            for (var k in BasicFields) {
                BasicFields.hasOwnProperty(k) && (fields[k] = BasicFields[k]);
            }
            /* ie浏览器native方法不能列举,所以先在BasicFields将基本方法列举 */
            forIn(xhr, function (value, key) {
                if (!this[key]) {
                    if (CST_REG.test(key) && typeof value != 'undefined') {
                        this[key] = FieldType.constant;
                    } else if (isFunction(value) && !CB_REG.test(key)) {
                        this[key] = FieldType.method;
                    } else if (CB_REG.test(key) && value === null) {
                        this[key] = FieldType.callback;
                    } else {
                        this[key] = FieldType.config;
                    }
                }
            }, fields);

            forIn(fields, function (type, key) {
                if (type === FieldType.config) {
                    confFields.push(key);
                } else if (type === FieldType.status) {
                    statusFields.push(key);
                }
            });
            /* 将重写方法拷贝给xhrWrapper */
            forIn(methods, function (value, key) {
                if (isFunction(value)) {
                    this[key] = value;
                }
            }, this);
            /* 针对每个属性做包装 */
            forIn(fields, function (type, key) {
                try {
                    var value = xhr[key];// ie某些属性只能在特定时机访问,异常则忽略
                } catch (e) {
                }
                if (value === undefined && !key in BasicFields) return;
                switch (type) {
                    case FieldType.constant:
                        this[key] = value;
                        break;
                    case FieldType.method:
                        if (!this[key]) {
                            if (key === 'setRequestHeader') {
                                this.setRequestHeader = function (key, value) {
                                    return xhr.setRequestHeader(key, value);
                                };
                            } else if(key === 'send') {
                                this.send = function(data) {
                                    return xhr.send(data);
                                };
                            } else if(key === 'open') {
                                this.open = function(method, url, asynchronous, username, password) {
                                    return xhr.open(method, url, asynchronous, username, password);
                                };
                            } else if (key in BasicFields) {
                                this[key] = function () {
                                    return xhr[key]();
                                };
                            } else {
                                this[key] = function () {
                                    return xhr[key](arguments[0], arguments[1]);
                                };
                            }
                        }
                        // 在send方法调用前,需要将一些配置字段拷贝到真实的xhr
                        if (key === 'send') {
                            var send = this.send;
                            this.send = function () {
                                forEach(confFields, function (field) {
                                    try {
                                        xhr[field] = this[field];
                                    } catch (e) {
                                    }

                                }, this);
                                return send.apply(this, arguments);
                            }
                        }
                        break;
                    case FieldType.callback:
                        var ctx = this;
                        xhr[key] = function () {
                            forEach(statusFields, function (field) {
                                try {
                                    ctx[field] = xhr[field];
                                } catch (e) {
                                }
                            });
                            if (isFunction(ctx[key])) {
                                ctx[key]();
                            }
                        };
                        break;
                }
            }, this);
        }
    };

    function forIn(obj, cb, ctx) {
        for (var k in obj) {
            try {
                cb.call(ctx, obj[k], k, obj);
            } catch (e) {
            }
        }
    }

    function forEach(arr, cb, ctx) {
        for (var i = 0; i < arr.length; i++) {
            cb.call(ctx, arr[i], i);
        }
    }

    function isFunction(value) {
        return Object.prototype.toString.call(value).toLowerCase() == '[object function]';
    }

    function getXhr() {
        if (XHR) {
            return new XHR();
        } else {
            var msxml = ['Msxml2.XMLHTTP.6.0',
                'Msxml2.XMLHTTP.3.0',
                'Msxml2.XMLHTTP.4.0',
                'Msxml2.XMLHTTP.5.0',
                'MSXML2.XMLHTTP',
                'Microsoft.XMLHTTP'];
            for (var i = 0; i < msxml.length; i++) {
                try {
                    return new ActiveXObject(msxml[i]);
                } catch (e) {
                    // ignore exception
                }
            }
        }
    }
})();

if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = overwriteXhr;
}