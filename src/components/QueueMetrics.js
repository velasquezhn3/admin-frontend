/**
 * Componente para mostrar métricas en tiempo real del sistema de colas
 */

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Grid,
  Typography,
  LinearProgress,
  Box,
  Chip,
  Alert,
  Paper
} from '@mui/material';
import {
  Speed as SpeedIcon,
  TrendingUp as TrendingUpIcon,
  Storage as StorageIcon,
  Timeline as TimelineIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import QueueService from '../services/QueueService';

const QueueMetrics = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);

  // Cargar métricas
  const loadMetrics = async () => {
    try {
      const data = await QueueService.getQueueMetrics('1h');
      setMetrics(data);
      
      // Simular datos históricos (en producción vendrían del backend)
      const now = new Date();
      const historical = Array.from({ length: 20 }, (_, i) => ({
        time: new Date(now - i * 30000).toLocaleTimeString('es-ES', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        processed: Math.floor(Math.random() * 10) + 1,
        waiting: Math.floor(Math.random() * 5),
        failed: Math.floor(Math.random() * 2)
      })).reverse();
      
      setHistoricalData(historical);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMetrics();
    
    // Actualizar cada 30 segundos
    const interval = setInterval(loadMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <LinearProgress />
            <Typography variant="body2" sx={{ mt: 2 }}>
              Cargando métricas...
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        Error cargando métricas: {error}
      </Alert>
    );
  }

  if (!metrics?.available) {
    return (
      <Alert severity="info">
        Métricas no disponibles - Sistema funcionando en modo fallback
      </Alert>
    );
  }

  const { current, performance, system } = metrics;
  const total = (current.waiting || 0) + (current.completed || 0) + (current.failed || 0);

  return (
    <Grid container spacing={3}>
      {/* Métricas principales */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader 
            title="Rendimiento del Sistema"
            avatar={<SpeedIcon color="primary" />}
          />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Tiempo Promedio
                </Typography>
                <Typography variant="h6">
                  {performance?.averageProcessingTime || 0}ms
                </Typography>
              </Grid>
              
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Tasa de Error
                </Typography>
                <Typography variant="h6" color={performance?.errorRate > 10 ? 'error' : 'success'}>
                  {performance?.errorRate?.toFixed(1) || 0}%
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Distribución de Trabajos
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={total > 0 ? ((current.completed || 0) / total) * 100 : 0}
                  color="success"
                  sx={{ mb: 1, height: 8, borderRadius: 4 }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                  <span>Completados: {current.completed || 0}</span>
                  <span>Fallidos: {current.failed || 0}</span>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Estado del sistema */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader 
            title="Estado del Sistema"
            avatar={<StorageIcon color="primary" />}
          />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Typography variant="body2">Redis:</Typography>
                  <Chip 
                    label={system?.redisConnected ? 'Conectado' : 'Desconectado'} 
                    color={system?.redisConnected ? 'success' : 'error'} 
                    size="small" 
                  />
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Typography variant="body2">Sistema:</Typography>
                  <Chip 
                    label={system?.queueHealthy ? 'Saludable' : 'Atención'} 
                    color={system?.queueHealthy ? 'success' : 'warning'} 
                    size="small" 
                  />
                </Box>
                
                <Typography variant="body2" color="text.secondary">
                  Tiempo Activo: {Math.floor((system?.uptime || 0) / 60)} minutos
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Gráfico de tendencia */}
      <Grid item xs={12}>
        <Card>
          <CardHeader 
            title="Tendencia de Procesamiento (Últimos 10 minutos)"
            avatar={<TimelineIcon color="primary" />}
          />
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="processed" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="Procesados"
                />
                <Line 
                  type="monotone" 
                  dataKey="waiting" 
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  name="En Espera"
                />
                <Line 
                  type="monotone" 
                  dataKey="failed" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  name="Fallidos"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      {/* Gráfico de barras - Estados actuales */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader 
            title="Estado Actual de la Cola"
            avatar={<TrendingUpIcon color="primary" />}
          />
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={[
                { name: 'En Espera', value: current.waiting || 0, color: '#f59e0b' },
                { name: 'Procesando', value: current.active || 0, color: '#3b82f6' },
                { name: 'Completados', value: current.completed || 0, color: '#10b981' },
                { name: 'Fallidos', value: current.failed || 0, color: '#ef4444' }
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      {/* Alertas y notificaciones */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader 
            title="Alertas del Sistema"
            avatar={<ErrorIcon color="primary" />}
          />
          <CardContent>
            {performance?.errorRate > 10 && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                Alta tasa de errores ({performance.errorRate.toFixed(1)}%)
              </Alert>
            )}
            
            {!system?.redisConnected && (
              <Alert severity="error" sx={{ mb: 2 }}>
                Redis desconectado - Sistema en modo fallback
              </Alert>
            )}
            
            {current.waiting > 50 && (
              <Alert severity="info" sx={{ mb: 2 }}>
                Cola con alto volumen ({current.waiting} mensajes pendientes)
              </Alert>
            )}
            
            {(performance?.errorRate <= 10 && system?.redisConnected && current.waiting <= 50) && (
              <Alert severity="success">
                Sistema funcionando correctamente
              </Alert>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default QueueMetrics;
