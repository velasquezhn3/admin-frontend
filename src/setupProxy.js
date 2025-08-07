// Configuración de proxy personalizada para el frontend
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/admin',
    createProxyMiddleware({
      target: 'http://localhost:4000',
      changeOrigin: true,
      logLevel: 'debug'
    })
  );
  
  app.use(
    '/auth',
    createProxyMiddleware({
      target: 'http://localhost:4000',
      changeOrigin: true,
      logLevel: 'debug'
    })
  );
};
