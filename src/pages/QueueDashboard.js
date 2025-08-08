/**
 * Dashboard principal para visualizar el sistema de colas de WhatsApp
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Button,
  Chip,
  Alert,
  CircularProgress,
  LinearProgress,
  Tabs,
  Tab,
  Switch,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Pause as PauseIcon,
  PlayArrow as PlayIcon,
  Clear as ClearIcon,
  Settings as SettingsIcon,
  Message as MessageIcon,
  Schedule as ScheduleIcon,
  Error as ErrorIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Speed as SpeedIcon,
  Storage as StorageIcon,
  Timeline as TimelineIcon,
  Visibility as VisibilityIcon,
  Refresh as RetryIcon
} from '@mui/icons-material';
import QueueService from '../services/QueueService';
// Import del servicio robusto como fallback
import QueueServiceRobust from '../services/QueueServiceRobust';
// Import alternativo en caso de problemas
import * as QueueServiceModule from '../services/QueueService';
import QueueMetrics from '../components/QueueMetrics';

// Verificar importación y usar el servicio que funcione
console.log('QueueService import:', QueueService);
console.log('QueueServiceModule import:', QueueServiceModule);
console.log('QueueServiceRobust import:', QueueServiceRobust);

// Seleccionar el servicio que funcione
const WorkingQueueService = QueueService || QueueServiceRobust || QueueServiceModule.default;

const QueueDashboard = () => {
  // Estado principal
  const [queueStats, setQueueStats] = useState(null);
  const [queueStatus, setQueueStatus] = useState(null);
  const [queueJobs, setQueueJobs] = useState([]);
  const [queueConfig, setQueueConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  
  // Estado para tabs
  const [activeTab, setActiveTab] = useState(0);
  const [jobsFilter, setJobsFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Estado para diálogos
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [jobDetailsDialogOpen, setJobDetailsDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  // Función para cargar todos los datos
  const loadAllData = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      setRefreshing(true);
      setError(null);

      // Debug: Verificar que QueueService esté disponible
      console.log('WorkingQueueService:', WorkingQueueService);
      console.log('getQueueStats function:', WorkingQueueService.getQueueStats);

      // Verificar si las funciones están disponibles
      if (!WorkingQueueService || typeof WorkingQueueService.getQueueStats !== 'function') {
        throw new Error('QueueService no está disponible o no tiene las funciones requeridas');
      }

      const [stats, status, jobs, config] = await Promise.all([
        WorkingQueueService.getQueueStats(),
        WorkingQueueService.getQueueSystemStatus ? WorkingQueueService.getQueueSystemStatus() : Promise.resolve({ success: true, data: { status: 'unknown' } }),
        WorkingQueueService.getQueueJobs ? WorkingQueueService.getQueueJobs(jobsFilter, 100) : Promise.resolve({ success: true, data: [] }),
        WorkingQueueService.getQueueConfig ? WorkingQueueService.getQueueConfig() : Promise.resolve({ success: true, data: {} })
      ]);

      setQueueStats(stats);
      setQueueStatus(status);
      setQueueJobs(jobs);
      setQueueConfig(config);
    } catch (err) {
      console.error('Error cargando datos del dashboard:', err);
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Efecto para carga inicial
  useEffect(() => {
    loadAllData();
  }, [jobsFilter]);

  // Auto-refresh cada 10 segundos
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      loadAllData(false);
    }, 10000);

    return () => clearInterval(interval);
  }, [autoRefresh, jobsFilter]);

  // Funciones de control de cola
  const handlePauseQueue = async () => {
    try {
      await WorkingQueueService.pauseQueue();
      await loadAllData(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleResumeQueue = async () => {
    try {
      await WorkingQueueService.resumeQueue();
      await loadAllData(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleClearQueue = async () => {
    if (window.confirm('¿Estás seguro de que deseas limpiar toda la cola?')) {
      try {
        await WorkingQueueService.clearQueue();
        await loadAllData(false);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleRetryJob = async (jobId) => {
    try {
      await WorkingQueueService.retryJob(jobId);
      await loadAllData(false);
    } catch (err) {
      setError(err.message);
    }
  };

  // Función para obtener color del estado
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'failed': return 'error';
      case 'active': return 'primary';
      case 'waiting': return 'warning';
      case 'paused': return 'secondary';
      default: return 'default';
    }
  };

  // Función para formatear fecha
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleString('es-ES');
  };

  // Función para formatear duración
  const formatDuration = (ms) => {
    if (!ms) return 'N/A';
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}min`;
  };

  // Renderizado de estadísticas principales
  const renderStatsCards = () => (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <PendingIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
            <Typography variant="h4" component="div">
              {queueStats?.waiting || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              En Espera
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <SpeedIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
            <Typography variant="h4" component="div">
              {queueStats?.active || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Procesando
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <CheckCircleIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
            <Typography variant="h4" component="div">
              {queueStats?.completed || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Completados
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <ErrorIcon sx={{ fontSize: 40, color: 'error.main', mb: 1 }} />
            <Typography variant="h4" component="div">
              {queueStats?.failed || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Fallidos
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  // Renderizado de controles
  const renderControls = () => (
    <Card sx={{ mb: 3 }}>
      <CardHeader 
        title="Control de Cola"
        action={
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <FormControlLabel
              control={
                <Switch
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  size="small"
                />
              }
              label="Auto-refresh"
              sx={{ mr: 2 }}
            />
            
            <Tooltip title="Actualizar">
              <IconButton onClick={() => loadAllData()} disabled={refreshing}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            
            {queueStatus?.isPaused ? (
              <Tooltip title="Reanudar Cola">
                <IconButton onClick={handleResumeQueue} color="success">
                  <PlayIcon />
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip title="Pausar Cola">
                <IconButton onClick={handlePauseQueue} color="warning">
                  <PauseIcon />
                </IconButton>
              </Tooltip>
            )}
            
            <Tooltip title="Limpiar Cola">
              <IconButton onClick={handleClearQueue} color="error">
                <ClearIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Configuración">
              <IconButton onClick={() => setConfigDialogOpen(true)}>
                <SettingsIcon />
              </IconButton>
            </Tooltip>
          </Box>
        }
      />
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <StorageIcon color={queueStatus?.redisConnected ? 'success' : 'error'} />
              <Typography variant="body1">
                Redis: <Chip 
                  label={queueStatus?.redisConnected ? 'Conectado' : 'Desconectado'} 
                  color={queueStatus?.redisConnected ? 'success' : 'error'} 
                  size="small" 
                />
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ScheduleIcon />
              <Typography variant="body1">
                Estado: <Chip 
                  label={queueStatus?.isPaused ? 'Pausada' : 'Activa'} 
                  color={queueStatus?.isPaused ? 'warning' : 'success'} 
                  size="small" 
                />
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <MessageIcon />
              <Typography variant="body1">
                Delay: <Chip 
                  label={`${queueConfig?.delay || 2000}ms`} 
                  color="info" 
                  size="small" 
                />
              </Typography>
            </Box>
          </Grid>
        </Grid>
        
        {refreshing && <LinearProgress sx={{ mt: 2 }} />}
      </CardContent>
    </Card>
  );

  // Renderizado de tabla de trabajos
  const renderJobsTable = () => {
    const displayJobs = queueJobs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    
    return (
      <Card>
        <CardHeader 
          title="Trabajos en Cola"
          action={
            <Tabs value={jobsFilter} onChange={(e, v) => setJobsFilter(v)}>
              <Tab label="Todos" value="all" />
              <Tab label="Pendientes" value="waiting" />
              <Tab label="Activos" value="active" />
              <Tab label="Completados" value="completed" />
              <Tab label="Fallidos" value="failed" />
            </Tabs>
          }
        />
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Usuario</TableCell>
                <TableCell>Mensaje</TableCell>
                <TableCell>Creado</TableCell>
                <TableCell>Procesado</TableCell>
                <TableCell>Intentos</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayJobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell>{job.id}</TableCell>
                  <TableCell>
                    <Chip 
                      label={job.status} 
                      color={getStatusColor(job.status)} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>
                    {job.data?.sender?.split('@')[0] || 'N/A'}
                  </TableCell>
                  <TableCell>
                    {job.data?.text?.substring(0, 30) + (job.data?.text?.length > 30 ? '...' : '') || 'N/A'}
                  </TableCell>
                  <TableCell>{formatDate(job.timestamp)}</TableCell>
                  <TableCell>{formatDate(job.processedOn)}</TableCell>
                  <TableCell>{job.attemptsMade || 0}/{job.opts?.attempts || 3}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Ver Detalles">
                        <IconButton 
                          size="small" 
                          onClick={() => {
                            setSelectedJob(job);
                            setJobDetailsDialogOpen(true);
                          }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      
                      {job.status === 'failed' && (
                        <Tooltip title="Reintentar">
                          <IconButton 
                            size="small" 
                            color="primary"
                            onClick={() => handleRetryJob(job.id)}
                          >
                            <RetryIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          component="div"
          count={queueJobs.length}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          labelRowsPerPage="Filas por página:"
        />
      </Card>
    );
  };

  // Renderizado de tabs de contenido
  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <Box>
            {renderStatsCards()}
            {renderControls()}
            {renderJobsTable()}
          </Box>
        );
      case 1:
        return <QueueMetrics />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <MessageIcon />
        Dashboard de Colas WhatsApp
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Control de Cola" />
          <Tab label="Métricas y Análisis" />
        </Tabs>
      </Box>

      {renderTabContent()}

      {/* Diálogo de detalles de trabajo */}
      <Dialog 
        open={jobDetailsDialogOpen} 
        onClose={() => setJobDetailsDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Detalles del Trabajo</DialogTitle>
        <DialogContent>
          {selectedJob && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>Información General</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography><strong>ID:</strong> {selectedJob.id}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography><strong>Estado:</strong> {selectedJob.status}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography><strong>Creado:</strong> {formatDate(selectedJob.timestamp)}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography><strong>Procesado:</strong> {formatDate(selectedJob.processedOn)}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography><strong>Intentos:</strong> {selectedJob.attemptsMade || 0}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography><strong>Duración:</strong> {formatDuration(selectedJob.processedOn - selectedJob.timestamp)}</Typography>
                </Grid>
              </Grid>
              
              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Datos del Mensaje</Typography>
              <Paper sx={{ p: 2, bgcolor: 'grey.100' }}>
                <pre>{JSON.stringify(selectedJob.data, null, 2)}</pre>
              </Paper>
              
              {selectedJob.failedReason && (
                <>
                  <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Error</Typography>
                  <Paper sx={{ p: 2, bgcolor: 'error.light', color: 'error.contrastText' }}>
                    <Typography>{selectedJob.failedReason}</Typography>
                  </Paper>
                </>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setJobDetailsDialogOpen(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default QueueDashboard;
