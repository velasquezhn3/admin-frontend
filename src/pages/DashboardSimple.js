import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  useTheme,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  EventNote as ReservationsIcon,
  People as PeopleIcon,
  Home as HomeIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/Layout/DashboardLayout';
import MetricCard from '../components/Common/MetricCard';
import apiService from '../services/apiService';

const DashboardSimple = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  const [metrics, setMetrics] = useState({
    reservationsToday: 0,
    occupancyRate: 0,
    todayRevenue: 0,
    totalUsers: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch data from multiple endpoints
        const [users, cabins, reservations] = await Promise.all([
          apiService.getUsers(),
          apiService.getCabins(),
          apiService.getReservations()
        ]);

        // Calculate metrics
        const totalUsers = users?.length || 0;
        const totalCabins = cabins?.length || 0;
        const activeReservations = reservations?.filter(r => r.estado === 'confirmada')?.length || 0;
        const occupancyRate = totalCabins > 0 ? Math.round((activeReservations / totalCabins) * 100) : 0;
        
        // Calculate today's revenue (example calculation)
        const todayRevenue = reservations?.reduce((total, reservation) => {
          const today = new Date().toDateString();
          const reservationDate = new Date(reservation.fecha_inicio).toDateString();
          if (reservationDate === today && reservation.estado === 'confirmada') {
            return total + (reservation.precio_total || 0);
          }
          return total;
        }, 0) || 0;

        setMetrics({
          reservationsToday: activeReservations,
          occupancyRate,
          todayRevenue,
          totalUsers
        });
        
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Error al cargar los datos del dashboard');
        // Keep default values on error
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Métricas principales */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Reservas Activas"
              value={loading ? <CircularProgress size={24} /> : metrics.reservationsToday}
              change="+12%"
              changeType="positive"
              icon={<ReservationsIcon />}
              color="primary"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Ocupación"
              value={loading ? <CircularProgress size={24} /> : `${metrics.occupancyRate}%`}
              change="+5%"
              changeType="positive"
              icon={<HomeIcon />}
              color="success"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Ingresos Hoy"
              value={loading ? <CircularProgress size={24} /> : formatCurrency(metrics.todayRevenue)}
              change="+18%"
              changeType="positive"
              icon={<MoneyIcon />}
              color="warning"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Total Usuarios"
              value={loading ? <CircularProgress size={24} /> : metrics.totalUsers.toLocaleString()}
              change="+3%"
              changeType="positive"
              icon={<PeopleIcon />}
              color="info"
            />
          </Grid>
        </Grid>

        {/* Contenido básico */}
        <Card sx={{ borderRadius: 2 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Sistema de Gestión Villas Julie
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Dashboard administrativo funcionando correctamente. Las funcionalidades avanzadas se cargarán progresivamente.
            </Typography>
            <Grid container spacing={2}>
              <Grid item>
                <Button 
                  variant="contained" 
                  sx={{ borderRadius: 2 }}
                  onClick={() => navigate('/reservations')}
                >
                  Ver Reservas
                </Button>
              </Grid>
              <Grid item>
                <Button 
                  variant="outlined" 
                  sx={{ borderRadius: 2 }}
                  onClick={() => navigate('/cabins')}
                >
                  Gestionar Cabañas
                </Button>
              </Grid>
              <Grid item>
                <Button 
                  variant="outlined" 
                  sx={{ borderRadius: 2 }}
                  onClick={() => navigate('/reports')}
                >
                  Ver Reportes
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </DashboardLayout>
  );
};

export default DashboardSimple;
