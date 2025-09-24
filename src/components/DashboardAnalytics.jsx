/**
 * Dashboard Analytics Frontend Component
 * Componente React para mostrar gráficos y métricas avanzadas
 */

import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
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
  Divider
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  People,
  Hotel,
  AttachMoney,
  CalendarToday,
  Insights,
  Star
} from '@mui/icons-material';

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const DashboardAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('monthly');
  const [metrics, setMetrics] = useState(null);
  const [revenueData, setRevenueData] = useState(null);
  const [occupancyData, setOccupancyData] = useState(null);
  const [userBehavior, setUserBehavior] = useState(null);
  const [trends, setTrends] = useState(null);

  const API_BASE = process.env.REACT_APP_API_URL;

  // Obtener token de localStorage
  const getAuthToken = () => {
    return localStorage.getItem('adminToken');
  };

  // Headers para requests autenticados
  const getAuthHeaders = () => ({
    'Authorization': `Bearer ${getAuthToken()}`,
    'Content-Type': 'application/json'
  });

  // Cargar todas las métricas
  useEffect(() => {
    loadAllAnalytics();
  }, [period]);

  const loadAllAnalytics = async () => {
    setLoading(true);
    setError(null);

    try {
      const [metricsRes, revenueRes, occupancyRes, usersRes, trendsRes] = await Promise.all([
  fetch(`${API_BASE}/admin/dashboard`, { headers: getAuthHeaders() }),
  fetch(`${API_BASE}/admin/dashboard/revenue?period=${period}`, { headers: getAuthHeaders() }),
  fetch(`${API_BASE}/admin/dashboard/occupancy`, { headers: getAuthHeaders() }),
  fetch(`${API_BASE}/admin/dashboard/users`, { headers: getAuthHeaders() }),
  fetch(`${API_BASE}/admin/dashboard/trends`, { headers: getAuthHeaders() })
      ]);

      if (!metricsRes.ok || !revenueRes.ok || !occupancyRes.ok || !usersRes.ok || !trendsRes.ok) {
        throw new Error('Error loading analytics data');
      }

      const [metricsData, revenueDataRes, occupancyDataRes, usersDataRes, trendsDataRes] = await Promise.all([
        metricsRes.json(),
        revenueRes.json(),
        occupancyRes.json(),
        usersRes.json(),
        trendsRes.json()
      ]);

      setMetrics(metricsData.data);
      setRevenueData(revenueDataRes.data);
      setOccupancyData(occupancyDataRes.data);
      setUserBehavior(usersDataRes.data);
      setTrends(trendsDataRes.data);

    } catch (err) {
      console.error('Error loading analytics:', err);
      setError('Error cargando datos de analytics');
    } finally {
      setLoading(false);
    }
  };

  // Configuración de gráficos
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Datos para gráfico de ingresos
  const getRevenueChartData = () => {
    if (!revenueData?.data) return null;

    return {
      labels: revenueData.data.map(item => item.date),
      datasets: [
        {
          label: 'Ingresos ($)',
          data: revenueData.data.map(item => item.revenue),
          borderColor: 'rgb(53, 162, 235)',
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
          tension: 0.1,
        },
        {
          label: 'Reservas',
          data: revenueData.data.map(item => item.reservations),
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          yAxisID: 'y1',
        },
      ],
    };
  };

  // Datos para gráfico de ocupación
  const getOccupancyChartData = () => {
    if (!occupancyData?.cabins) return null;

    const topCabins = occupancyData.cabins.slice(0, 8); // Top 8 cabañas

    return {
      labels: topCabins.map(cabin => cabin.name),
      datasets: [
        {
          label: 'Tasa de Ocupación (%)',
          data: topCabins.map(cabin => cabin.occupancyRate),
          backgroundColor: [
            'rgba(255, 99, 132, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 205, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(153, 102, 255, 0.8)',
            'rgba(255, 159, 64, 0.8)',
            'rgba(199, 199, 199, 0.8)',
            'rgba(83, 102, 255, 0.8)',
          ],
        },
      ],
    };
  };

  // Datos para gráfico de tendencias semanales
  const getWeekdayTrendsData = () => {
    if (!trends?.weekdayTrends) return null;

    return {
      labels: trends.weekdayTrends.map(day => day.dayOfWeek),
      datasets: [
        {
          label: 'Reservas por día de la semana',
          data: trends.weekdayTrends.map(day => day.reservationsCount),
          backgroundColor: 'rgba(153, 102, 255, 0.8)',
        },
      ],
    };
  };

  // Componente de métrica
  const MetricCard = ({ title, value, icon, trend, subtitle }) => (
    <Card elevation={3}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="textSecondary" gutterBottom variant="body2">
              {title}
            </Typography>
            <Typography variant="h4" component="div">
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="textSecondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box>
            {icon}
            {trend && (
              <Box mt={1}>
                <Chip
                  icon={trend > 0 ? <TrendingUp /> : <TrendingDown />}
                  label={`${trend > 0 ? '+' : ''}${trend.toFixed(1)}%`}
                  color={trend > 0 ? 'success' : 'error'}
                  size="small"
                />
              </Box>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ margin: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        📊 Dashboard Analytics Avanzado
      </Typography>

      {/* Controles */}
      <Box mb={3}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Período de Análisis</InputLabel>
          <Select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            label="Período de Análisis"
          >
            <MenuItem value="daily">Diario (30 días)</MenuItem>
            <MenuItem value="weekly">Semanal (12 semanas)</MenuItem>
            <MenuItem value="monthly">Mensual (12 meses)</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Métricas principales */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Usuarios"
            value={metrics?.totalUsers?.toLocaleString() || '0'}
            icon={<People color="primary" />}
            subtitle={`+${metrics?.newUsersThisMonth || 0} este mes`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Reservas Activas"
            value={metrics?.activeReservations?.toLocaleString() || '0'}
            icon={<CalendarToday color="primary" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Ingresos Totales"
            value={`$${metrics?.totalRevenue?.toLocaleString() || '0'}`}
            icon={<AttachMoney color="primary" />}
            trend={metrics?.revenueGrowth}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Tasa de Ocupación"
            value={`${metrics?.occupancyRate?.toFixed(1) || '0'}%`}
            icon={<Hotel color="primary" />}
          />
        </Grid>
      </Grid>

      {/* Gráficos principales */}
      <Grid container spacing={3} mb={4}>
        {/* Gráfico de ingresos */}
        <Grid item xs={12} lg={8}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📈 Análisis de Ingresos - {period === 'daily' ? 'Diario' : period === 'weekly' ? 'Semanal' : 'Mensual'}
              </Typography>
              {revenueData?.data?.length > 0 ? (
                <Line 
                  data={getRevenueChartData()} 
                  options={{
                    ...chartOptions,
                    plugins: {
                      ...chartOptions.plugins,
                      title: {
                        display: true,
                        text: `Ingresos y Reservas - Últimos ${revenueData.data.length} períodos`
                      }
                    },
                    scales: {
                      y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                      },
                      y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        grid: {
                          drawOnChartArea: false,
                        },
                      },
                    },
                  }} 
                />
              ) : (
                <Typography>No hay datos de ingresos disponibles</Typography>
              )}
              
              {/* Resumen de ingresos */}
              {revenueData?.summary && (
                <Box mt={2}>
                  <Divider sx={{ my: 2 }} />
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Typography variant="body2" color="textSecondary">Total del Período</Typography>
                      <Typography variant="h6">${revenueData.summary.totalRevenue.toLocaleString()}</Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="body2" color="textSecondary">Total Reservas</Typography>
                      <Typography variant="h6">{revenueData.summary.totalReservations}</Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="body2" color="textSecondary">Promedio por Período</Typography>
                      <Typography variant="h6">${revenueData.summary.averagePeriodRevenue.toLocaleString()}</Typography>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Gráfico de ocupación */}
        <Grid item xs={12} lg={4}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🏠 Ocupación por Cabaña
              </Typography>
              {occupancyData?.cabins?.length > 0 ? (
                <Bar 
                  data={getOccupancyChartData()} 
                  options={{
                    ...chartOptions,
                    plugins: {
                      ...chartOptions.plugins,
                      title: {
                        display: true,
                        text: 'Tasa de Ocupación (%)'
                      }
                    }
                  }} 
                />
              ) : (
                <Typography>No hay datos de ocupación disponibles</Typography>
              )}
              
              {/* Mejor cabaña */}
              {occupancyData?.summary?.bestPerformingCabin && (
                <Box mt={2}>
                  <Divider sx={{ my: 2 }} />
                  <Box display="flex" alignItems="center">
                    <Star color="warning" sx={{ mr: 1 }} />
                    <Box>
                      <Typography variant="body2" color="textSecondary">Mejor Rendimiento</Typography>
                      <Typography variant="subtitle1">{occupancyData.summary.bestPerformingCabin.name}</Typography>
                      <Typography variant="body2">
                        ${occupancyData.summary.bestPerformingCabin.totalRevenue?.toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tendencias y comportamiento */}
      <Grid container spacing={3}>
        {/* Tendencias por día de la semana */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📅 Tendencias por Día de la Semana
              </Typography>
              {trends?.weekdayTrends?.length > 0 ? (
                <Bar 
                  data={getWeekdayTrendsData()} 
                  options={{
                    ...chartOptions,
                    plugins: {
                      ...chartOptions.plugins,
                      title: {
                        display: true,
                        text: 'Reservas por día de la semana'
                      }
                    }
                  }} 
                />
              ) : (
                <Typography>No hay datos de tendencias disponibles</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Top clientes */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🌟 Top Clientes
              </Typography>
              {userBehavior?.topCustomers?.slice(0, 5).map((customer, index) => (
                <Box key={customer.userId} mb={2}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="subtitle2">{customer.name}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {customer.totalReservations} reservas
                      </Typography>
                    </Box>
                    <Box textAlign="right">
                      <Typography variant="subtitle2">
                        ${customer.lifetimeValue.toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        LTV
                      </Typography>
                    </Box>
                  </Box>
                  {index < 4 && <Divider sx={{ mt: 1 }} />}
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Información adicional */}
      <Box mt={3}>
        <Typography variant="body2" color="textSecondary" align="center">
          📊 Datos actualizados en tiempo real • Última actualización: {new Date(metrics?.lastUpdated).toLocaleString()}
        </Typography>
      </Box>
    </Box>
  );
};

export default DashboardAnalytics;
