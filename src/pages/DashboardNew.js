import React, { useState, useEffect } from 'react';
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
} from '@mui/icons-material';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import DashboardLayout from '../components/Layout/DashboardLayout';
import MetricCard from '../components/Common/MetricCard';
import EmptyState from '../components/Common/EmptyState';
import StatusChip from '../components/Common/StatusChip';
import axios from 'axios';

// Datos de ejemplo para gráficos
const monthlyReservations = [
  { name: 'Ene', reservas: 45, ingresos: 125000 },
  { name: 'Feb', reservas: 52, ingresos: 142000 },
  { name: 'Mar', reservas: 48, ingresos: 138000 },
  { name: 'Abr', reservas: 61, ingresos: 168000 },
  { name: 'May', reservas: 55, ingresos: 155000 },
  { name: 'Jun', reservas: 67, ingresos: 185000 },
];

const cabinPopularity = [
  { name: 'Cabaña Bosque', value: 35, color: '#2563eb' },
  { name: 'Cabaña Lago', value: 28, color: '#10b981' },
  { name: 'Cabaña Vista', value: 20, color: '#f59e0b' },
  { name: 'Cabaña Pino', value: 17, color: '#8b5cf6' },
];

const recentActivities = [
  { id: 1, type: 'reservation', message: 'Nueva reserva de Juan Pérez', time: '5 min', status: 'confirmada' },
  { id: 2, type: 'checkin', message: 'Check-in María García', time: '12 min', status: 'check-in' },
  { id: 3, type: 'cancellation', message: 'Cancelación Carlos López', time: '25 min', status: 'cancelada' },
  { id: 4, type: 'payment', message: 'Pago recibido Ana Ruiz', time: '1 hora', status: 'confirmada' },
];

const Dashboard = () => {
  const [metrics, setMetrics] = useState({
    reservationsToday: 12,
    occupancyRate: 85,
    todayRevenue: 45000,
    totalUsers: 1247
  });
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // Simular carga de datos
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Aquí cargarías los datos reales desde la API
      // const response = await axios.get('/api/dashboard/metrics');
      // setMetrics(response.data);
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setLoading(false);
    }
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleRefresh = () => {
    handleMenuClose();
    loadDashboardData();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <DashboardLayout title="Dashboard Principal">
      <Box sx={{ mb: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5 }}>
              Bienvenido de vuelta 👋
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Aquí tienes un resumen de la actividad de hoy
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
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
            </Menu>
          </Box>
        </Box>

        {/* Alertas */}
        <Box sx={{ mb: 3 }}>
          <Alert severity="info" sx={{ borderRadius: 2, mb: 1 }}>
            <AlertTitle>Recordatorio</AlertTitle>
            Tienes 3 check-ins programados para hoy y 2 check-outs pendientes
          </Alert>
        </Box>

        {/* Métricas principales */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Reservas Hoy"
              value={metrics.reservationsToday}
              change="+12%"
              changeType="positive"
              icon={<ReservationsIcon />}
              color="primary"
              loading={loading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Ocupación"
              value={`${metrics.occupancyRate}%`}
              change="+5%"
              changeType="positive"
              icon={<HomeIcon />}
              color="success"
              loading={loading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Ingresos Hoy"
              value={formatCurrency(metrics.todayRevenue)}
              change="+18%"
              changeType="positive"
              icon={<MoneyIcon />}
              color="warning"
              loading={loading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Total Usuarios"
              value={metrics.totalUsers.toLocaleString()}
              change="+3%"
              changeType="positive"
              icon={<PeopleIcon />}
              color="info"
              loading={loading}
            />
          </Grid>
        </Grid>

        {/* Gráficos */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Gráfico de reservas mensuales */}
          <Grid item xs={12} lg={8}>
            <Card sx={{ height: 400, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
              <CardContent sx={{ p: 3, height: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Tendencia de Reservas
                  </Typography>
                  <StatusChip status="alta" size="small" />
                </Box>
                
                {loading ? (
                  <Box sx={{ height: 300, display: 'flex', alignItems: 'center' }}>
                    <LinearProgress sx={{ width: '100%' }} />
                  </Box>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={monthlyReservations}>
                      <defs>
                        <linearGradient id="colorReservas" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" stroke="#666" />
                      <YAxis stroke="#666" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e0e0e0',
                          borderRadius: 8,
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="reservas" 
                        stroke="#2563eb" 
                        fillOpacity={1} 
                        fill="url(#colorReservas)"
                        strokeWidth={3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Gráfico de popularidad de cabañas */}
          <Grid item xs={12} lg={4}>
            <Card sx={{ height: 400, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
              <CardContent sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Cabañas Más Populares
                </Typography>
                
                {loading ? (
                  <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <LinearProgress sx={{ width: '80%' }} />
                  </Box>
                ) : (
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={cabinPopularity}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        dataKey="value"
                      >
                        {cabinPopularity.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                )}
                
                <Box sx={{ mt: 2 }}>
                  {cabinPopularity.map((cabin, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Box 
                        sx={{ 
                          width: 12, 
                          height: 12, 
                          borderRadius: 1, 
                          bgcolor: cabin.color,
                          mr: 1 
                        }} 
                      />
                      <Typography variant="body2" sx={{ flexGrow: 1 }}>
                        {cabin.name}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {cabin.value}%
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Actividad reciente */}
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <Card sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Actividad Reciente
                </Typography>
                
                {recentActivities.length === 0 ? (
                  <EmptyState
                    title="No hay actividad reciente"
                    description="La actividad aparecerá aquí cuando ocurran eventos en el sistema"
                    size="small"
                  />
                ) : (
                  <Box>
                    {recentActivities.map((activity) => (
                      <Box 
                        key={activity.id}
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          py: 2,
                          borderBottom: '1px solid',
                          borderColor: 'divider',
                          '&:last-child': { borderBottom: 'none' }
                        }}
                      >
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            bgcolor: 'primary.light',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mr: 2,
                            color: 'primary.main'
                          }}
                        >
                          <Notifications />
                        </Box>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {activity.message}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            hace {activity.time}
                          </Typography>
                        </Box>
                        <StatusChip status={activity.status} size="small" />
                      </Box>
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Card sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider', mb: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Acciones Rápidas
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Button 
                    variant="outlined" 
                    fullWidth 
                    sx={{ borderRadius: 2, textTransform: 'none', justifyContent: 'flex-start' }}
                    startIcon={<ReservationsIcon />}
                  >
                    Nueva Reserva
                  </Button>
                  <Button 
                    variant="outlined" 
                    fullWidth 
                    sx={{ borderRadius: 2, textTransform: 'none', justifyContent: 'flex-start' }}
                    startIcon={<CalendarToday />}
                  >
                    Ver Calendario
                  </Button>
                  <Button 
                    variant="outlined" 
                    fullWidth 
                    sx={{ borderRadius: 2, textTransform: 'none', justifyContent: 'flex-start' }}
                    startIcon={<TrendingUpIcon />}
                  >
                    Generar Reporte
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </DashboardLayout>
  );
};

export default Dashboard;
