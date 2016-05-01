var overwriteXhr = require('../index');
overwriteXhr({
    open: function(method, url, asynchronous) {
        return this.xhr.open(method == 'GET' ? 'POST' : 'GET', url, asynchronous);
    },
    send: function(data) {
        return this.xhr.send(data);
    }
});
var jQuery = require('jquery');
it('should change request method', function(done) {
    jQuery.get('/return/request/method')
        .success(function(result) {
            if(result !== 'POST') {
                throw new Error('not equal');
            }
            done();
        });
});