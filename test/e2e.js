var overwriteXhr = require('../index');
overwriteXhr({
    open: function (method, url, asynchronous) {
        var arr = url.split('?');
        if (arr.length > 1) {
            this.queryString = arr[1];
        }
        return this.xhr.open('POST', arr[0], asynchronous);
    },
    send: function (data) {
        if(this.queryString) {
            if(data) {
                data = data + '&' + this.queryString;
            } else {
                data = this.queryString;
            }
        }
        return this.xhr.send(data);
    }
});
var jQuery = require('jquery');

function ok(left, right, message) {
    if (left !== right) {
        throw new Error(message || 'not equal exception');
    }
};

it('should use post method', function (done) {
    jQuery.get('/return/request/method')
        .success(function (result) {
            ok(result, 'POST');
            done();
        });
});

it('should put query string to body', function (done) {
    jQuery.get('/return/request/body?query=test')
        .success(function (result) {
            ok(result, 'query=test');
            done();
        });
});

it('should send data', function (done) {
    jQuery.post('/return/request/body', 'data=test')
        .success(function (result) {
            ok(result, 'data=test');
            done();
        });
});