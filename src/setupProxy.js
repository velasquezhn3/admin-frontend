// Configuración de proxy personalizada para el frontend
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';
  app.use(
    '/admin',
    createProxyMiddleware({
      target: API_URL,
      changeOrigin: true,
      logLevel: 'debug'
    })
  );
  
  app.use(
    '/auth',
    createProxyMiddleware({
      target: API_URL,
      changeOrigin: true,
      logLevel: 'debug'
    })
  );
  
  app.use(
    '/api',
    createProxyMiddleware({
      target: API_URL,
      changeOrigin: true,
      logLevel: 'debug'
    })
  );
};
