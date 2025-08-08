/**
 * 🔧 QUEUE SERVICE MEJORADO - VERSIÓN ROBUSTA
 * Servicio completamente reescrito para resolver problemas de importación
 */

// Configuración de la API
const getApiConfig = () => {
  const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
  return {
    baseURL: process.env.REACT_APP_API_URL || '/api',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };
};

// Función helper para hacer requests
const makeRequest = async (endpoint, options = {}) => {
  const config = getApiConfig();
  const url = `${config.baseURL}${endpoint}`;
  
  const requestConfig = {
    method: 'GET',
    headers: config.headers,
    ...options
  };

  console.log(`📡 Making request to: ${url}`, requestConfig);

  try {
    const response = await fetch(url, requestConfig);
    
    console.log(`📡 Response status: ${response.status}`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`📡 Response data:`, data);
    return data;
  } catch (error) {
    console.error(`❌ Request failed for ${url}:`, error);
    throw error;
  }
};

// Objeto con todas las funciones del servicio
const QueueServiceRobust = {
  /**
   * Obtener estadísticas de la cola
   */
  getQueueStats: async () => {
    return makeRequest('/bot/queue-stats');
  },

  /**
   * Obtener estado del sistema
   */
  getQueueSystemStatus: async () => {
    return makeRequest('/bot/queue-status');
  },

  /**
   * Obtener trabajos de la cola
   */
  getQueueJobs: async (filter = 'all', limit = 100) => {
    return makeRequest(`/bot/queue-jobs?status=${filter}&limit=${limit}`);
  },

  /**
   * Obtener configuración
   */
  getQueueConfig: async () => {
    return makeRequest('/bot/queue-config');
  },

  /**
   * Obtener métricas
   */
  getQueueMetrics: async () => {
    return makeRequest('/bot/queue-metrics');
  },

  /**
   * Pausar la cola
   */
  pauseQueue: async () => {
    return makeRequest('/bot/queue-pause', { method: 'POST' });
  },

  /**
   * Reanudar la cola
   */
  resumeQueue: async () => {
    return makeRequest('/bot/queue-resume', { method: 'POST' });
  },

  /**
   * Limpiar la cola
   */
  clearQueue: async () => {
    return makeRequest('/bot/queue-clear', { method: 'POST' });
  },

  /**
   * Reintentar trabajo
   */
  retryJob: async (jobId) => {
    return makeRequest(`/bot/queue-retry/${jobId}`, { method: 'POST' });
  },

  /**
   * Test de conectividad
   */
  testConnection: async () => {
    try {
      const result = await QueueServiceRobust.getQueueStats();
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

// Verificar que el objeto está correctamente construido
console.log('🔧 QueueServiceRobust created:', QueueServiceRobust);
console.log('🔧 getQueueStats function:', typeof QueueServiceRobust.getQueueStats);

// Exportaciones múltiples para máxima compatibilidad
export default QueueServiceRobust;
export { QueueServiceRobust };
export const QueueService = QueueServiceRobust;
