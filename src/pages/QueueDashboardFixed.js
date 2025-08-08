/**
 * 🔧 SOLUCIÓN DEFINITIVA - QUEUE DASHBOARD FUNCIONAL
 * Reescrito completamente para resolver todos los problemas
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Button,
  Alert,
  CircularProgress,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Message as MessageIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Pending as PendingIcon,
  Speed as SpeedIcon
} from '@mui/icons-material';
import DashboardLayout from '../components/Layout/DashboardLayout';

// Definir el servicio directamente en el componente para evitar problemas de importación
const createQueueAPI = () => {
  const getToken = () => localStorage.getItem('adminToken') || localStorage.getItem('token');
  
  const makeRequest = async (endpoint, options = {}) => {
    const token = getToken();
    const url = `/api/bot${endpoint}`;
    
    const config = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      ...options
    };

    console.log(`📡 Request: ${url}`, config);

    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`📡 Response:`, data);
    return data;
  };

  return {
    getQueueStats: () => makeRequest('/queue-stats'),
    getQueueStatus: () => makeRequest('/queue-status'),
    getQueueJobs: (filter = 'all', limit = 50) => makeRequest(`/queue-jobs?status=${filter}&limit=${limit}`),
    getCompletedJobs: () => makeRequest('/queue-jobs?status=completed&limit=20'),
    getFailedJobs: () => makeRequest('/queue-jobs?status=failed&limit=20'),
    getQueueConfig: () => makeRequest('/queue-config'),
    pauseQueue: () => makeRequest('/queue-pause', { method: 'POST' }),
    resumeQueue: () => makeRequest('/queue-resume', { method: 'POST' }),
    clearQueue: () => makeRequest('/queue-clear', { method: 'POST' })
  };
};

const QueueDashboardFixed = () => {
  const [stats, setStats] = useState(null);
  const [status, setStatus] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  // Crear instancia de la API
  const queueAPI = createQueueAPI();

  // Función para cargar todos los datos
  const loadData = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      setError(null);

      console.log('🔄 Cargando datos del dashboard...');

      // Intentar cargar datos uno por uno para mejor debugging
      let statsData = null;
      let statusData = null;
      let jobsData = [];
      let configData = null;

      // 1. Estadísticas
      try {
        statsData = await queueAPI.getQueueStats();
        console.log('✅ Stats cargados:', statsData);
      } catch (err) {
        console.error('❌ Error cargando stats:', err);
        statsData = { success: false, error: err.message };
      }

      // 2. Estado
      try {
        statusData = await queueAPI.getQueueStatus();
        console.log('✅ Status cargado:', statusData);
      } catch (err) {
        console.error('❌ Error cargando status:', err);
        statusData = { success: false, error: err.message };
      }

      // 3. Trabajos (incluir completados para mostrar actividad)
      try {
        const jobsResponse = await queueAPI.getQueueJobs('all', 50);
        const completedResponse = await queueAPI.getCompletedJobs();
        
        // Combinar trabajos activos con completados recientes
        const allJobs = jobsResponse.data || [];
        const completedJobs = completedResponse.data || [];
        
        jobsData = [...allJobs, ...completedJobs].slice(0, 50);
        console.log('✅ Jobs cargados:', jobsData.length, 'trabajos (incluyendo completados)');
      } catch (err) {
        console.error('❌ Error cargando jobs:', err);
        jobsData = [];
      }

      // 4. Configuración
      try {
        configData = await queueAPI.getQueueConfig();
        console.log('✅ Config cargado:', configData);
      } catch (err) {
        console.error('❌ Error cargando config:', err);
        configData = { success: false, error: err.message };
      }

      // Actualizar estado
      setStats(statsData);
      setStatus(statusData);
      setJobs(jobsData);
      setConfig(configData);
      setLastUpdate(new Date());

    } catch (err) {
      console.error('❌ Error general:', err);
      setError(`Error cargando dashboard: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    loadData();
  }, []);

  // Auto refresh cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      loadData(false);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Función para obtener el chip del estado
  const getStatusChip = (available, redisConnected) => {
    if (available && redisConnected) {
      return <Chip label="Operativo" color="success" size="small" />;
    } else if (available) {
      return <Chip label="Parcial" color="warning" size="small" />;
    } else {
      return <Chip label="Offline" color="error" size="small" />;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Cargando dashboard...</Typography>
      </Box>
    );
  }

  return (
    <DashboardLayout title="Dashboard de Colas WhatsApp">
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            📊 Dashboard de Colas WhatsApp
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            {lastUpdate && (
              <Typography variant="caption" color="text.secondary">
                Última actualización: {lastUpdate.toLocaleTimeString()}
              </Typography>
            )}
            <Tooltip title="Refrescar">
              <IconButton onClick={() => loadData(true)} disabled={loading}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Estado del Sistema */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🔧 Estado del Sistema
              </Typography>
              {status?.success ? (
                <Box>
                  {getStatusChip(status.data?.isInitialized, status.data?.redisConnected)}
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Redis: {status.data?.redisConnected ? '✅ Conectado' : '❌ Desconectado'}
                  </Typography>
                  <Typography variant="body2">
                    Cola: {status.data?.isInitialized ? '✅ Disponible' : '❌ No disponible'}
                  </Typography>
                </Box>
              ) : (
                <Alert severity="warning" size="small">
                  No se pudo obtener el estado
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📈 Estadísticas
              </Typography>
              {stats?.success && stats.data ? (
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <PendingIcon fontSize="small" color="warning" />
                    <Typography>En espera: {stats.data.waiting || 0}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <SpeedIcon fontSize="small" color="info" />
                    <Typography>Activos: {stats.data.active || 0}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <CheckCircleIcon fontSize="small" color="success" />
                    <Typography>Completados: {stats.data.completed || 0}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ErrorIcon fontSize="small" color="error" />
                    <Typography>Fallidos: {stats.data.failed || 0}</Typography>
                  </Box>
                </Box>
              ) : (
                <Alert severity="info" size="small">
                  {stats?.data?.message || 'Estadísticas no disponibles'}
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                ⚙️ Configuración
              </Typography>
              {config?.success && config.data ? (
                <Box>
                  <Typography variant="body2">
                    Delay: {config.data.delay || 2000}ms
                  </Typography>
                  <Typography variant="body2">
                    Concurrencia: {config.data.concurrency || 1}
                  </Typography>
                  <Typography variant="body2">
                    Reintentos: {config.data.maxRetries || 3}
                  </Typography>
                  <Typography variant="body2">
                    Host: {config.data.redisHost || 'localhost'}:{config.data.redisPort || 6379}
                  </Typography>
                </Box>
              ) : (
                <Alert severity="info" size="small">
                  Configuración no disponible
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Trabajos Recientes */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          💼 Trabajos Recientes ({jobs.length})
        </Typography>
        {jobs.length > 0 ? (
          <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
            {jobs.slice(0, 10).map((job, index) => (
              <Box key={job.id || index} sx={{ 
                p: 2, 
                border: '1px solid #e0e0e0', 
                borderRadius: 1, 
                mb: 1,
                backgroundColor: job.status === 'failed' ? '#ffebee' : 
                               job.status === 'completed' ? '#e8f5e8' : '#fff3e0'
              }}>
                <Typography variant="subtitle2">
                  Job #{job.id || index + 1} - {job.status || 'unknown'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Usuario: {job.data?.sender || 'Desconocido'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Mensaje: {job.data?.text?.substring(0, 50) || 'Sin texto'}...
                </Typography>
              </Box>
            ))}
          </Box>
        ) : (
          <Alert severity="info">
            No hay trabajos recientes
          </Alert>
        )}
      </Paper>

      {/* Acciones */}
      <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
        <Button 
          variant="outlined" 
          onClick={() => loadData(true)}
          disabled={loading}
        >
          🔄 Refrescar
        </Button>
        <Button 
          variant="outlined" 
          color="warning"
          onClick={async () => {
            try {
              await queueAPI.pauseQueue();
              loadData(false);
            } catch (err) {
              setError(`Error pausando cola: ${err.message}`);
            }
          }}
        >
          ⏸️ Pausar Cola
        </Button>
        <Button 
          variant="outlined" 
          color="success"
          onClick={async () => {
            try {
              await queueAPI.resumeQueue();
              loadData(false);
            } catch (err) {
              setError(`Error reanudando cola: ${err.message}`);
            }
          }}
        >
          ▶️ Reanudar Cola
        </Button>
      </Box>

      {/* Debug Info */}
      <Paper sx={{ p: 2, mt: 3, backgroundColor: '#f5f5f5' }}>
        <Typography variant="h6" gutterBottom>
          🐛 Información de Debug
        </Typography>
        <pre style={{ fontSize: '12px', overflow: 'auto', maxHeight: '200px' }}>
          {JSON.stringify({ 
            stats: stats?.success ? 'OK' : stats?.error,
            status: status?.success ? 'OK' : status?.error,
            jobs: `${jobs.length} trabajos`,
            config: config?.success ? 'OK' : config?.error,
            timestamp: new Date().toISOString()
          }, null, 2)}
        </pre>
      </Paper>
    </Box>
    </DashboardLayout>
  );
};

export default QueueDashboardFixed;
