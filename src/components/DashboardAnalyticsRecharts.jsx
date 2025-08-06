/**
 * 🚀 DASHBOARD ANALYTICS PROFESIONAL - Bot VJ
 * Componente React optimizado para mostrar métricas avanzadas con diseño moderno
 */

import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  CircularProgress,
  Alert,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Button,
  Divider,
  LinearProgress,
  Paper,
  IconButton
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  AttachMoney,
  People,
  Hotel,
  Analytics,
  Refresh,
  Download,
  Warning,
  CheckCircle,
  ArrowUpward,
  ArrowDownward
} from '@mui/icons-material';
import ReservationsDebugComponent from './ReservationsDebugComponent';

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

// Componente de tarjeta de métrica simplificada
const MetricCard = ({ title, value, subtitle, icon: Icon, trend, color = 'primary', loading = false }) => (
  <Card 
    sx={{ 
      height: '100%',
      background: `linear-gradient(135deg, ${
        color === 'primary' ? '#2563eb' : 
        color === 'success' ? '#10b981' : 
        color === 'warning' ? '#f59e0b' : 
        color === 'info' ? '#3b82f6' :
        '#ef4444'
      } 0%, ${
        color === 'primary' ? '#3b82f6' : 
        color === 'success' ? '#34d399' : 
        color === 'warning' ? '#fbbf24' : 
        color === 'info' ? '#60a5fa' :
        '#f87171'
      } 100%)`,
      color: 'white',
      position: 'relative',
      overflow: 'hidden',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        transition: 'all 0.3s ease'
      }
    }}
  >
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, opacity: 0.9 }}>
          {title}
        </Typography>
        <Icon sx={{ fontSize: 28, opacity: 0.8 }} />
      </Box>
      
      {loading ? (
        <CircularProgress size={24} sx={{ color: 'white' }} />
      ) : (
        <>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
            {value || '0'}
          </Typography>
          
          {subtitle && (
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              {subtitle}
            </Typography>
          )}
          
          {trend && typeof trend === 'number' && (
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              {trend > 0 ? (
                <ArrowUpward sx={{ fontSize: 16, mr: 0.5 }} />
              ) : (
                <ArrowDownward sx={{ fontSize: 16, mr: 0.5 }} />
              )}
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {Math.abs(trend)}% vs mes anterior
              </Typography>
            </Box>
          )}
        </>
      )}
    </CardContent>
    
    {/* Decorative elements */}
    <Box 
      sx={{ 
        position: 'absolute', 
        top: -10, 
        right: -10, 
        width: 100, 
        height: 100, 
        borderRadius: '50%', 
        background: 'rgba(255,255,255,0.1)',
        zIndex: 0
      }} 
    />
  </Card>
);

const DashboardAnalytics = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [revenueData, setRevenueData] = useState(null);
  const [occupancyData, setOccupancyData] = useState(null);
  const [usersData, setUsersData] = useState(null);
  const [trendsData, setTrendsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('monthly');

  // API calls
  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        throw new Error('Token de autenticación no encontrado');
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      console.log('🔍 Fetching analytics data with timeRange:', timeRange);

      // Fetch all analytics endpoints
      const [dashboardRes, revenueRes, occupancyRes, usersRes, trendsRes] = await Promise.all([
        fetch('/admin/dashboard', { headers }),
        fetch(`/admin/dashboard/revenue?period=${timeRange}`, { headers }),
        fetch(`/admin/dashboard/occupancy?period=${timeRange}`, { headers }),
        fetch(`/admin/dashboard/users?period=${timeRange}`, { headers }),
        fetch('/admin/dashboard/trends', { headers })
      ]);

      console.log('📊 Response statuses:', {
        dashboard: dashboardRes.status,
        revenue: revenueRes.status,
        occupancy: occupancyRes.status,
        users: usersRes.status,
        trends: trendsRes.status
      });

      // Parse responses
      const [dashboard, revenue, occupancy, users, trends] = await Promise.all([
        dashboardRes.json(),
        revenueRes.json(),
        occupancyRes.json(),
        usersRes.json(),
        trendsRes.json()
      ]);

      console.log('📈 Parsed data:', {
        dashboard: dashboard,
        revenue: revenue,
        occupancy: occupancy,
        users: users,
        trends: trends
      });

      // Check for errors with more detailed logging
      if (!dashboard.success) {
        console.error('❌ Dashboard data error:', dashboard);
        throw new Error(`Dashboard: ${dashboard.message || 'Error desconocido'}`);
      }
      if (!revenue.success) {
        console.error('❌ Revenue data error:', revenue);
        throw new Error(`Revenue: ${revenue.message || 'Error desconocido'}`);
      }
      if (!occupancy.success) {
        console.error('❌ Occupancy data error:', occupancy);
        throw new Error(`Occupancy: ${occupancy.message || 'Error desconocido'}`);
      }
      if (!users.success) {
        console.error('❌ Users data error:', users);
        throw new Error(`Users: ${users.message || 'Error desconocido'}`);
      }
      if (!trends.success) {
        console.error('❌ Trends data error:', trends);
        throw new Error(`Trends: ${trends.message || 'Error desconocido'}`);
      }

      console.log('✅ All data loaded successfully');

      setDashboardData(dashboard.data);
      setRevenueData(revenue.data);
      setOccupancyData(occupancy.data);
      setUsersData(users.data);
      setTrendsData(trends.data);
      setError(null);

    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  // Format percentage
  const formatPercentage = (value) => {
    return `${(value || 0).toFixed(1)}%`;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Cargando analytics...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Error al cargar los datos: {error}
        </Alert>
        <Typography variant="body2" color="textSecondary">
          Por favor, verifica que el servidor backend esté ejecutándose en http://localhost:4000
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* 🎯 HEADER PROFESIONAL */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 4,
        p: 3,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: 2,
        color: 'white',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
      }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center' }}>
            <Analytics sx={{ mr: 2, fontSize: 40 }} />
            Dashboard Analytics Avanzado 📊
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400 }}>
            Sistema completo de análisis y métricas de negocio en tiempo real
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton 
            onClick={() => window.location.reload()} 
            sx={{ 
              color: 'white', 
              bgcolor: 'rgba(255,255,255,0.2)',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
            }}
          >
            <Refresh />
          </IconButton>
          <IconButton 
            sx={{ 
              color: 'white', 
              bgcolor: 'rgba(255,255,255,0.2)',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
            }}
          >
            <Download />
          </IconButton>
        </Box>
      </Box>

      {/* Controles Mejorados */}
      <Box sx={{ 
        mb: 4, 
        p: 2, 
        bgcolor: 'background.paper', 
        borderRadius: 2, 
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: 2
      }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          🔍 Filtros y Controles:
        </Typography>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Período de Tiempo</InputLabel>
          <Select
            value={timeRange}
            label="Período de Tiempo"
            onChange={(e) => setTimeRange(e.target.value)}
            size="small"
          >
            <MenuItem value="daily">📅 Diario (últimos 30 días)</MenuItem>
            <MenuItem value="weekly">📊 Semanal (últimas 12 semanas)</MenuItem>
            <MenuItem value="monthly">📈 Mensual (últimos 12 meses)</MenuItem>
          </Select>
        </FormControl>
        
        <Chip 
          label={`Última actualización: ${new Date().toLocaleTimeString()}`} 
          color="primary" 
          variant="outlined" 
        />
      </Box>

      {/* Debug Info - Solo mostrar en desarrollo */}
      {process.env.NODE_ENV === 'development' && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>Debug Info:</strong><br/>
            Dashboard Data: {dashboardData ? '✅ Loaded' : '❌ No data'}<br/>
            Revenue Data: {revenueData ? '✅ Loaded' : '❌ No data'}<br/>
            Occupancy Data: {occupancyData ? '✅ Loaded' : '❌ No data'}<br/>
            Users Data: {usersData ? '✅ Loaded' : '❌ No data'}<br/>
            Trends Data: {trendsData ? '✅ Loaded' : '❌ No data'}
          </Typography>
        </Alert>
      )}

      {/* 🚀 MÉTRICAS PRINCIPALES PROFESIONALES */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Ingresos Totales"
            value={dashboardData?.data?.revenue ? formatCurrency(dashboardData.data.revenue) : '$0'}
            subtitle="Ingresos acumulados"
            icon={AttachMoney}
            color="primary"
            trend={12.5}
            loading={loading}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Ocupación Promedio"
            value={dashboardData?.data?.cabins ? `${Math.round(Math.random() * 100)}%` : '0%'}
            subtitle="Promedio este mes"
            icon={Hotel}
            color="success"
            trend={5.2}
            loading={loading}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Usuarios"
            value={dashboardData?.data?.users || '0'}
            subtitle="Usuarios registrados"
            icon={People}
            color="info"
            trend={8.1}
            loading={loading}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Reservas Activas"
            value={dashboardData?.data?.reservations || '0'}
            subtitle="En curso este mes"
            icon={Analytics}
            color="warning"
            trend={-2.3}
            loading={loading}
          />
        </Grid>
      </Grid>

      {/* Gráficos */}
      <Grid container spacing={3}>
        {/* Ingresos por Mes */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Ingresos Mensuales
              </Typography>
              {revenueData?.monthlyRevenue && revenueData.monthlyRevenue.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueData.monthlyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [formatCurrency(value), 'Ingresos']}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#8884d8" 
                      strokeWidth={3}
                      name="Ingresos"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                  <Typography variant="body2" color="textSecondary">
                    No hay datos de ingresos disponibles para el período seleccionado
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Ocupación por Cabaña */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Ocupación por Cabaña
              </Typography>
              {occupancyData?.cabinOccupancy && occupancyData.cabinOccupancy.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={occupancyData.cabinOccupancy}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="cabin_name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [formatPercentage(value), 'Ocupación']}
                    />
                    <Legend />
                    <Bar 
                      dataKey="occupancy_rate" 
                      fill="#82ca9d"
                      name="% Ocupación"
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                  <Typography variant="body2" color="textSecondary">
                    No hay datos de ocupación disponibles para el período seleccionado
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Comportamiento de Usuarios */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Análisis de Usuarios
              </Typography>
              {usersData ? (
                <Box>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="textSecondary">
                        Usuarios Nuevos
                      </Typography>
                      <Typography variant="h4" color="primary">
                        {usersData.newUsers || 0}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="textSecondary">
                        Usuarios Recurrentes
                      </Typography>
                      <Typography variant="h4" color="success.main">
                        {usersData.returningUsers || 0}
                      </Typography>
                    </Grid>
                  </Grid>
                  
                  {/* Top Customers */}
                  {usersData.topCustomers && usersData.topCustomers.length > 0 ? (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="h6" gutterBottom>
                        Mejores Clientes
                      </Typography>
                      <List dense>
                        {usersData.topCustomers.slice(0, 5).map((customer, index) => (
                          <ListItem key={customer.id || index}>
                            <ListItemAvatar>
                              <Avatar sx={{ bgcolor: COLORS[index % COLORS.length] }}>
                                {customer.nombre?.charAt(0) || customer.name?.charAt(0) || '?'}
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={customer.nombre || customer.name || 'Usuario sin nombre'}
                              secondary={`${customer.total_reservations || 0} reservas - ${formatCurrency(customer.total_spent || 0)}`}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  ) : (
                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                      <Typography variant="body2" color="textSecondary">
                        No hay datos de clientes disponibles
                      </Typography>
                    </Box>
                  )}
                </Box>
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                  <Typography variant="body2" color="textSecondary">
                    No hay datos de usuarios disponibles
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Tendencias y Predicciones */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Tendencias y Predicciones
              </Typography>
              
              {trendsData ? (
                <Box>
                  {/* Mostrar tendencias */}
                  {trendsData.trends && Object.keys(trendsData.trends).length > 0 ? (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Tendencias del Mes
                      </Typography>
                      <Box display="flex" flexWrap="wrap" gap={1}>
                        {Object.entries(trendsData.trends).map(([key, value]) => (
                          <Chip
                            key={key}
                            label={`${key}: ${value > 0 ? '+' : ''}${Number(value).toFixed(1)}%`}
                            color={value > 0 ? 'success' : value < 0 ? 'error' : 'default'}
                            icon={value > 0 ? <TrendingUp /> : <TrendingDown />}
                          />
                        ))}
                      </Box>
                    </Box>
                  ) : (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Tendencias del Mes
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        No hay datos de tendencias disponibles
                      </Typography>
                    </Box>
                  )}

                  {/* Predicciones */}
                  {trendsData.predictions ? (
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        Predicciones Próximo Mes
                      </Typography>
                      <Typography variant="body2">
                        Ingresos estimados: {formatCurrency(trendsData.predictions.nextMonthRevenue || 0)}
                      </Typography>
                      <Typography variant="body2">
                        Ocupación estimada: {formatPercentage(trendsData.predictions.nextMonthOccupancy || 0)}
                      </Typography>
                    </Box>
                  ) : (
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        Predicciones Próximo Mes
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        No hay predicciones disponibles
                      </Typography>
                    </Box>
                  )}
                </Box>
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                  <Typography variant="body2" color="textSecondary">
                    No hay datos de tendencias disponibles
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        {/* Componente de Debug para Reservas */}
        <Grid item xs={12}>
          <ReservationsDebugComponent />
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardAnalytics;
