const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'http://backend:8000/api',
            changeOrigin: true,
            logLevel: 'debug',
            pathRewrite: (path, req) => path,
        })
    );
    app.use(
        '/account',
        createProxyMiddleware({
            target: 'http://backend:8000/account',
            changeOrigin: true,
            logLevel: 'debug',
            pathRewrite: (path, req) => path,
        })
    );
    app.use(
        '/media',
        createProxyMiddleware({
            target: 'http://backend:8000/media',
            changeOrigin: true,
            logLevel: 'debug', 
            pathRewrite: (path, req) => path, 
        })
    );
    app.use(
        '/admin',
        createProxyMiddleware({
            target: 'http://backend:8000/admin',
            changeOrigin: true,
            logLevel: 'debug', 
            pathRewrite: (path, req) => path, 
        })
    );
    app.use(
        '/static/admin',
        createProxyMiddleware({
            target: 'http://backend:8000/static/admin',
            changeOrigin: true,
            logLevel: 'debug', 
            pathRewrite: (path, req) => path, 
        })
    );
};