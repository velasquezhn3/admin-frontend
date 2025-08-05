/**
 * Dashboard Analytics con Recharts
 * Componente React optimizado para mostrar métricas avanzadas
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
  ResponsiveContainer
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
  Avatar
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  AttachMoney,
  People,
  Hotel,
  Analytics
} from '@mui/icons-material';
import ReservationsDebugComponent from './ReservationsDebugComponent';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

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
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Analytics sx={{ mr: 2, fontSize: 40 }} />
        Dashboard Analytics Avanzado
      </Typography>

      {/* Controles */}
      <Box sx={{ mb: 3 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Período de Tiempo</InputLabel>
          <Select
            value={timeRange}
            label="Período de Tiempo"
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <MenuItem value="daily">Diario (últimos 30 días)</MenuItem>
            <MenuItem value="weekly">Semanal (últimas 12 semanas)</MenuItem>
            <MenuItem value="monthly">Mensual (últimos 12 meses)</MenuItem>
          </Select>
        </FormControl>
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

      {/* Métricas Principales */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <AttachMoney color="primary" sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Ingresos Totales
                  </Typography>
                  <Typography variant="h5">
                    {dashboardData?.summary?.totalRevenue 
                      ? formatCurrency(dashboardData.summary.totalRevenue)
                      : formatCurrency(0)
                    }
                  </Typography>
                  {!dashboardData && (
                    <Typography variant="caption" color="error">
                      Sin datos disponibles
                    </Typography>
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Hotel color="success" sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Ocupación Promedio
                  </Typography>
                  <Typography variant="h5">
                    {dashboardData?.summary?.occupancyRate 
                      ? formatPercentage(dashboardData.summary.occupancyRate)
                      : '0.0%'
                    }
                  </Typography>
                  {!dashboardData && (
                    <Typography variant="caption" color="error">
                      Sin datos disponibles
                    </Typography>
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <People color="info" sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Usuarios
                  </Typography>
                  <Typography variant="h5">
                    {dashboardData?.summary?.totalUsers || 0}
                  </Typography>
                  {!dashboardData && (
                    <Typography variant="caption" color="error">
                      Sin datos disponibles
                    </Typography>
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <TrendingUp color="warning" sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Reservas Activas
                  </Typography>
                  <Typography variant="h5">
                    {dashboardData?.summary?.activeReservations || 0}
                  </Typography>
                  {!dashboardData && (
                    <Typography variant="caption" color="error">
                      Sin datos disponibles
                    </Typography>
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
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
