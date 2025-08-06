import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Fade,
  Alert,
  AlertTitle,
  LinearProgress,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Paper,
  Switch,
  FormControlLabel,
  Tooltip,
  Badge,
  CircularProgress
} from '@mui/material';
import {
  EventNote as ReservationsIcon,
  People as PeopleIcon,
  Home as HomeIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingUpIcon,
  CalendarToday,
  Notifications,
  MoreVert,
  Refresh,
  Download,
  Settings,
  Timeline,
  Assessment,
  Speed,
  Warning,
  CheckCircle,
  Schedule,
  Hotel,
  Payment,
  PersonAdd,
  Cancel
} from '@mui/icons-material';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  ComposedChart
} from 'recharts';
import DashboardLayout from '../components/Layout/DashboardLayout';
import MetricCardAdvanced from '../components/Common/MetricCardAdvanced';
import SystemAlertsPanel from '../components/Common/SystemAlertsPanel';
import QuickStatsWidget from '../components/Dashboard/QuickStatsWidget';
import UpcomingEventsWidget from '../components/Dashboard/UpcomingEventsWidget';
import KPICard from '../components/Common/KPICard';
import EmptyState from '../components/Common/EmptyState';
import StatusChip from '../components/Common/StatusChip';
import dashboardService from '../services/dashboardService';
import useDashboardData from '../hooks/useDashboardData';

// Colores para gráficos
const CHART_COLORS = {
  primary: '#2563eb',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
  purple: '#8b5cf6',
  pink: '#ec4899',
  orange: '#f97316'
};

const Dashboard = () => {
  // Usar el hook personalizado para datos del dashboard
  const {
    data: dashboardData,
    loading,
    error,
    refreshing,
    lastUpdated,
    refresh,
    hasError,
    lastUpdatedFormatted
  } = useDashboardData({
    autoRefresh: autoRefreshEnabled,
    refreshInterval: 60000, // 1 minuto
    onError: (err) => {
      console.error('Dashboard error:', err);
    },
    onDataUpdate: (data) => {
      console.log('Dashboard data updated:', data);
    }
  });

  // Estados adicionales
  const [anchorEl, setAnchorEl] = useState(null);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);

  // Manejadores de eventos
  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleRefresh = () => {
    handleMenuClose();
    refresh();
  };

  // Formatear fecha relativa
  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Ahora mismo';
    if (diffInMinutes < 60) return `hace ${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `hace ${Math.floor(diffInMinutes / 60)}h`;
    return `hace ${Math.floor(diffInMinutes / 1440)}d`;
  };

  // Obtener icono para actividad
  const getActivityIcon = (type) => {
    switch (type) {
      case 'reservation': return <EventNote />;
      case 'checkin': return <CheckCircle />;
      case 'checkout': return <Schedule />;
      case 'payment': return <Payment />;
      case 'user': return <PersonAdd />;
      case 'cancellation': return <Cancel />;
      default: return <Notifications />;
    }
  };

  // Obtener color para actividad
  const getActivityColor = (status) => {
    switch (status) {
      case 'confirmada': case 'completado': case 'aprobado': return 'success';
      case 'pendiente': case 'procesando': return 'warning';
      case 'cancelada': case 'rechazado': return 'error';
      default: return 'info';
    }
  };

  if (loading && !dashboardData) {
    return (
      <DashboardLayout title="Dashboard Principal">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
          <CircularProgress size={60} />
        </Box>
      </DashboardLayout>
    );
  }

  // Extraer datos para uso en componentes
  const { metrics, revenueData, occupancyData, recentActivity, systemMetrics, systemAlerts } = dashboardData || {};

  return (
    <DashboardLayout title="Dashboard Principal">
      <Box sx={{ mb: 3 }}>
        {/* Header Mejorado */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5 }}>
              🎯 Dashboard Bot VJ
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Sistema de Reservas Villas Julie - Monitoreo en Tiempo Real
            </Typography>
            {lastUpdated && (
              <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                <Schedule fontSize="small" />
                Última actualización: {lastUpdatedFormatted}
              </Typography>
            )}
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <FormControlLabel
              control={
                <Switch
                  checked={autoRefreshEnabled}
                  onChange={(e) => setAutoRefreshEnabled(e.target.checked)}
                  size="small"
                />
              }
              label="Auto-refresh"
              sx={{ mr: 2 }}
            />
            
            <Tooltip title={refreshing ? 'Actualizando...' : 'Actualizar datos'}>
              <IconButton 
                onClick={handleRefresh} 
                disabled={refreshing}
                sx={{ 
                  bgcolor: 'primary.50',
                  border: '1px solid',
                  borderColor: 'primary.200',
                  '&:hover': { bgcolor: 'primary.100' }
                }}
              >
                {refreshing ? <CircularProgress size={20} /> : <Refresh />}
              </IconButton>
            </Tooltip>
            
            <Button
              variant="outlined"
              startIcon={<Download />}
              sx={{ borderRadius: 2, textTransform: 'none' }}
            >
              Exportar
            </Button>
            
            <IconButton onClick={handleMenuClick}>
              <MoreVert />
            </IconButton>
            
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
              <MenuItem onClick={handleRefresh}>
                <Refresh sx={{ mr: 1 }} /> Actualizar datos
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <Download sx={{ mr: 1 }} /> Descargar reporte
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <Settings sx={{ mr: 1 }} /> Configuración
              </MenuItem>
            </Menu>
          </Box>
        </Box>

        {/* Alertas del Sistema Mejoradas */}
        <SystemAlertsPanel 
          alerts={dashboardData?.systemAlerts || []}
          systemStatus={dashboardData?.systemMetrics}
          onRefresh={refresh}
        />

        {/* Métricas Principales Mejoradas */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCardAdvanced
              title="Total Usuarios"
              value={metrics?.totalUsers || 0}
              previousValue={metrics?.totalUsers ? metrics.totalUsers - (metrics.newUsersThisMonth || 0) : 0}
              icon={<PeopleIcon />}
              color="primary"
              loading={loading}
              format="number"
              subtitle={`+${metrics?.newUsersThisMonth || 0} este mes`}
              target={1500}
              showInfo
              infoText="Total de usuarios registrados en el sistema"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCardAdvanced
              title="Reservas Activas"
              value={metrics?.activeReservations || 0}
              icon={<ReservationsIcon />}
              color="success"
              loading={loading}
              format="number"
              subtitle="Reservas confirmadas"
              showInfo
              infoText="Reservas confirmadas y en proceso"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCardAdvanced
              title="Ingresos Totales"
              value={metrics?.totalRevenue || 0}
              growth={metrics?.revenueGrowth || 0}
              icon={<MoneyIcon />}
              color="warning"
              loading={loading}
              format="currency"
              subtitle="Ingresos acumulados"
              target={100000}
              showInfo
              infoText="Total de ingresos generados por reservas"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCardAdvanced
              title="Tasa de Ocupación"
              value={metrics?.occupancyRate || 0}
              icon={<HomeIcon />}
              color="info"
              loading={loading}
              format="percentage"
              subtitle="Promedio actual"
              target={90}
              progress={metrics?.occupancyRate || 0}
              showInfo
              infoText="Porcentaje de ocupación de todas las cabañas"
            />
          </Grid>
        </Grid>

        {/* Gráficos Principales */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Gráfico de Ingresos y Reservas */}
          <Grid item xs={12} lg={8}>
            <Card sx={{ height: 450, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
              <CardContent sx={{ p: 3, height: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Timeline color="primary" />
                    Tendencia de Ingresos y Reservas
                  </Typography>
                  <Chip label="Últimos 6 meses" size="small" color="primary" variant="outlined" />
                </Box>
                
                {loading ? (
                  <Box sx={{ height: 350, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CircularProgress size={40} />
                  </Box>
                ) : (
                  <ResponsiveContainer width="100%" height={350}>
                    <ComposedChart data={revenueData?.data || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="period" 
                        stroke="#666" 
                        fontSize={12}
                        tickLine={false}
                      />
                      <YAxis 
                        yAxisId="revenue"
                        orientation="left"
                        stroke="#666" 
                        fontSize={12}
                        tickLine={false}
                        tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                      />
                      <YAxis 
                        yAxisId="reservations"
                        orientation="right"
                        stroke="#666" 
                        fontSize={12}
                        tickLine={false}
                      />
                      <RechartsTooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e0e0e0',
                          borderRadius: 12,
                          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                        }}
                        formatter={(value, name) => [
                          name === 'revenue' ? dashboardService.formatCurrency(value) : value,
                          name === 'revenue' ? 'Ingresos' : 'Reservas'
                        ]}
                      />
                      <Area 
                        yAxisId="revenue"
                        type="monotone" 
                        dataKey="revenue" 
                        fill={CHART_COLORS.primary}
                        fillOpacity={0.2}
                        stroke={CHART_COLORS.primary}
                        strokeWidth={3}
                      />
                      <Bar 
                        yAxisId="reservations"
                        dataKey="reservations" 
                        fill={CHART_COLORS.success}
                        radius={[4, 4, 0, 0]}
                        maxBarSize={40}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Gráfico de Ocupación por Cabañas */}
          <Grid item xs={12} lg={4}>
            <Card sx={{ height: 450, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
              <CardContent sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Hotel color="primary" />
                  Ocupación por Cabaña
                </Typography>
                
                {loading ? (
                  <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CircularProgress size={40} />
                  </Box>
                ) : (
                  <>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={occupancyData?.cabins?.map((cabin, index) => ({
                            ...cabin,
                            color: Object.values(CHART_COLORS)[index % Object.values(CHART_COLORS).length]
                          })) || []}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={90}
                          dataKey="occupancy"
                        >
                          {occupancyData?.cabins?.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={Object.values(CHART_COLORS)[index % Object.values(CHART_COLORS).length]} 
                            />
                          ))}
                        </Pie>
                        <RechartsTooltip 
                          formatter={(value, name) => [`${value}%`, 'Ocupación']}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    
                    <Box sx={{ mt: 2 }}>
                      {occupancyData?.cabins?.map((cabin, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1, p: 1, borderRadius: 1, bgcolor: 'grey.50' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box 
                              sx={{ 
                                width: 12, 
                                height: 12, 
                                borderRadius: 1, 
                                bgcolor: Object.values(CHART_COLORS)[index % Object.values(CHART_COLORS).length],
                              }} 
                            />
                            <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                              {cabin.name}
                            </Typography>
                          </Box>
                          <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                              {cabin.occupancy}%
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                              {dashboardService.formatCurrency(cabin.revenue)}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Actividad Reciente y Acciones Rápidas */}
        <Grid container spacing={3}>
          {/* Actividad Reciente Mejorada */}
          <Grid item xs={12} lg={8}>
            <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Assessment color="primary" />
                  Actividad Reciente
                  <Chip 
                    label={recentActivity?.length || 0} 
                    size="small" 
                    color="primary" 
                    variant="outlined"
                  />
                </Typography>
                
                {!recentActivity || recentActivity.length === 0 ? (
                  <EmptyState
                    title="No hay actividad reciente"
                    description="La actividad aparecerá aquí cuando ocurran eventos en el sistema"
                    size="small"
                  />
                ) : (
                  <List sx={{ p: 0 }}>
                    {recentActivity.map((activity, index) => (
                      <React.Fragment key={activity.id}>
                        <ListItem sx={{ px: 0, py: 1.5 }}>
                          <ListItemAvatar>
                            <Avatar
                              sx={{
                                bgcolor: `${getActivityColor(activity.status)}.100`,
                                color: `${getActivityColor(activity.status)}.600`,
                                width: 40,
                                height: 40
                              }}
                            >
                              {getActivityIcon(activity.type)}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {activity.message}
                              </Typography>
                            }
                            secondary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                <Typography variant="caption" color="text.secondary">
                                  {formatTimeAgo(activity.timestamp)}
                                </Typography>
                                <StatusChip 
                                  status={activity.status} 
                                  size="small"
                                  variant="outlined"
                                />
                              </Box>
                            }
                          />
                        </ListItem>
                        {index < recentActivity.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Panel de Acciones Rápidas y Métricas Adicionales */}
          <Grid item xs={12} lg={4}>
            {/* Acciones Rápidas */}
            <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', mb: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Speed color="primary" />
                  Acciones Rápidas
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Button 
                    variant="outlined" 
                    fullWidth 
                    sx={{ 
                      borderRadius: 2, 
                      textTransform: 'none', 
                      justifyContent: 'flex-start',
                      py: 1.5,
                      borderColor: 'primary.200',
                      '&:hover': { borderColor: 'primary.400', bgcolor: 'primary.50' }
                    }}
                    startIcon={<ReservationsIcon />}
                  >
                    Nueva Reserva
                  </Button>
                  <Button 
                    variant="outlined" 
                    fullWidth 
                    sx={{ 
                      borderRadius: 2, 
                      textTransform: 'none', 
                      justifyContent: 'flex-start',
                      py: 1.5,
                      borderColor: 'success.200',
                      color: 'success.600',
                      '&:hover': { borderColor: 'success.400', bgcolor: 'success.50' }
                    }}
                    startIcon={<CalendarToday />}
                  >
                    Ver Calendario
                  </Button>
                  <Button 
                    variant="outlined" 
                    fullWidth 
                    sx={{ 
                      borderRadius: 2, 
                      textTransform: 'none', 
                      justifyContent: 'flex-start',
                      py: 1.5,
                      borderColor: 'warning.200',
                      color: 'warning.600',
                      '&:hover': { borderColor: 'warning.400', bgcolor: 'warning.50' }
                    }}
                    startIcon={<TrendingUpIcon />}
                  >
                    Generar Reporte
                  </Button>
                  <Button 
                    variant="outlined" 
                    fullWidth 
                    sx={{ 
                      borderRadius: 2, 
                      textTransform: 'none', 
                      justifyContent: 'flex-start',
                      py: 1.5,
                      borderColor: 'info.200',
                      color: 'info.600',
                      '&:hover': { borderColor: 'info.400', bgcolor: 'info.50' }
                    }}
                    startIcon={<Settings />}
                  >
                    Configuración
                  </Button>
                </Box>
              </CardContent>
            </Card>

            {/* Métricas Adicionales */}
            <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Resumen del Sistema
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {/* Valor Promedio por Reserva */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, bgcolor: 'primary.50', borderRadius: 2 }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Valor Promedio
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {dashboardService.formatCurrency(metrics?.averageReservationValue || 0)}
                      </Typography>
                    </Box>
                    <MoneyIcon color="primary" />
                  </Box>

                  {/* Total de Reservas */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, bgcolor: 'success.50', borderRadius: 2 }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Total Reservas
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {(metrics?.totalReservations || 0).toLocaleString()}
                      </Typography>
                    </Box>
                    <EventNote color="success" />
                  </Box>

                  {/* Tiempo de Respuesta DB */}
                  {systemMetrics?.database && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, bgcolor: 'info.50', borderRadius: 2 }}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Respuesta DB
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {systemMetrics.database.responseTime}ms
                        </Typography>
                      </Box>
                      <Speed color="info" />
                    </Box>
                  )}

                  {/* Estado General */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, bgcolor: 'success.50', borderRadius: 2 }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Estado del Sistema
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.700' }}>
                        ✅ Operacional
                      </Typography>
                    </Box>
                    <CheckCircle color="success" />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Widgets Adicionales */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Widget de Estadísticas Rápidas */}
          <Grid item xs={12} lg={6}>
            <QuickStatsWidget data={dashboardData} loading={loading} />
          </Grid>

          {/* Widget de Próximos Eventos */}
          <Grid item xs={12} lg={6}>
            <UpcomingEventsWidget data={dashboardData} loading={loading} />
          </Grid>
        </Grid>

        {/* KPIs Adicionales */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <KPICard
              title="Eficiencia Operativa"
              value={dashboardData?.systemMetrics?.requests?.total > 0 ? 
                (1 - (dashboardData.systemMetrics.requests.errors / dashboardData.systemMetrics.requests.total)) * 100 : 98.5}
              target={99}
              format="percentage"
              status={dashboardData?.systemMetrics?.requests?.errors > 50 ? 'warning' : 'excellent'}
              description="Porcentaje de requests exitosos"
              color="success"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <KPICard
              title="Tiempo Respuesta"
              value={dashboardData?.systemMetrics?.database?.responseTime || 25}
              target={50}
              unit="ms"
              format="number"
              status={dashboardData?.systemMetrics?.database?.responseTime > 100 ? 'warning' : 'excellent'}
              description="Tiempo promedio de respuesta de la base de datos"
              color="info"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <KPICard
              title="Uso de Memoria"
              value={dashboardData?.systemMetrics?.memory?.used || 75}
              target={dashboardData?.systemMetrics?.memory?.total || 512}
              unit="MB"
              format="number"
              status={
                (dashboardData?.systemMetrics?.memory?.used || 75) > 400 ? 'warning' :
                (dashboardData?.systemMetrics?.memory?.used || 75) > 300 ? 'good' : 'excellent'
              }
              description="Memoria RAM utilizada por el sistema"
              color="warning"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <KPICard
              title="Conversión"
              value={dashboardData?.metrics?.totalReservations > 0 && dashboardData?.metrics?.totalUsers > 0 ? 
                (dashboardData.metrics.totalReservations / dashboardData.metrics.totalUsers) * 100 : 28.5}
              target={35}
              format="percentage"
              trend={5.2}
              status="good"
              description="Porcentaje de usuarios que hacen reservas"
              color="purple"
            />
          </Grid>
        </Grid>
      </Box>
    </DashboardLayout>
  );
};

export default Dashboard;
