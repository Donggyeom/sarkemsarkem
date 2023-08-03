const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    createProxyMiddleware(['/api', '/ws-stomp'], {
      target: 'http://localhost:8081',
      changeOrigin: true,
      ws: true,
      router: {
        '/ws-stomp': 'ws://nginx:80'
      },
    })
  );
};