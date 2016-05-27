var getRawBody = require('raw-body');
var MockMiddleware = function (request, response, next) {
    if (request.url === '/return/request/method') {
        response.writeHead(200);
        response.end(request.method);
    } else if (request.url === '/return/request/body') {
        response.writeHead(200);
        getRawBody(request, {encoding: 'utf8'}, function(err, res) {
            response.end(res);
        });
    } else {
        next();
    }
};

module.exports = function (config) {
    config.set({
        frameworks: ['mocha', 'browserify'],
        files: [
            './test/e2e.js'
        ],
        preprocessors: {
            './test/e2e.js': 'browserify'
        },
        reporters: ['progress'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['Chrome'],
        singleRun: false,
        middleware: ['mock'],
        plugins: [
            'karma-browserify',
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-ie-launcher',
            'karma-mocha',
            {'middleware:mock': ['value', MockMiddleware]}
        ]
    });
};