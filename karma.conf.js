var CustomMiddlewareFactory = function (config) {
    return function (request, response, next) {
        if(request.url === '/return/request/method') {
            response.writeHead(200);
            return response.end(request.method);
        } else {
            next();
        }
    }
};

module.exports = function(config) {
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
        middleware: ['custom'],
        plugins: [
            'karma-browserify',
            'karma-chrome-launcher',
            'karma-ie-launcher',
            'karma-mocha',
            {'middleware:custom': ['factory', CustomMiddlewareFactory]}
        ]
    });
};