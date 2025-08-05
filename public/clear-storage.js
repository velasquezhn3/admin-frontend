/**
 * Script para limpiar localStorage del frontend
 * Ejecutar esto en la consola del navegador para limpiar tokens incorrectos
 */

console.log('🧹 Limpiando localStorage...');

// Limpiar tokens viejos
localStorage.removeItem('token');
localStorage.removeItem('user');

// Limpiar tokens correctos también para forzar nuevo login
localStorage.removeItem('adminToken');
localStorage.removeItem('adminUser');

console.log('✅ localStorage limpio');
console.log('🔄 Recarga la página y haz login nuevamente');

// Opcional: recargar la página automáticamente
// window.location.reload();
