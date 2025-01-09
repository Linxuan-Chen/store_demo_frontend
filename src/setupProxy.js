const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/api', 
        createProxyMiddleware({
            target: 'http://127.0.0.1:8000/api',
            changeOrigin: true,
            logLevel: 'debug',
            pathRewrite: (path, req) => path,
        })
    );
    app.use(
        '/account', 
        createProxyMiddleware({
            target: 'http://127.0.0.1:8000/account',
            changeOrigin: true,
            logLevel: 'debug',
            pathRewrite: (path, req) => path,
        })
    );
    app.use(
        '/media', 
        createProxyMiddleware({
            target: 'http://127.0.0.1:8000/media',
            changeOrigin: true,
            logLevel: 'debug', // 启用调试日志以便于调试
            pathRewrite: (path, req) => path, // 确保请求路径保持不变
        })
    );
};