import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Divider,
  Paper
} from '@mui/material';
import {
  CheckCircle,
  TrendingUp,
  People,
  Hotel,
  Event
} from '@mui/icons-material';
import DashboardLayout from '../components/Layout/DashboardLayout';

const DashboardSimple = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState('local');

  useEffect(() => {
    const loadData = async () => {
      try {
        // Datos temporales con lempiras hondureñas
        const tempData = [
          {
            id: 1,
            guest: "María García",
            cabin: "Villa Premium",
            checkin: "05/08/2025",
            checkout: "08/08/2025",
            status: "confirmed",
            guests: 4,
            price: 7500 // Ya en lempiras
          }
        ];
        setReservations(tempData);

        // Intentar obtener datos reales del backend
        const token = localStorage.getItem('adminToken') || 'admin-temp-token';
        
        const response = await fetch('http://localhost:4000/admin/reservations', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const result = await response.json();
          console.log('✅ Datos del backend:', result);
          
          if (result.success && result.data && result.data.length > 0) {
            // Transformar datos del backend
            const transformedData = result.data.slice(0, 10).map(reservation => ({
              id: reservation.reservation_id,
              guest: reservation.user_name || `Usuario ${reservation.user_id}`,
              cabin: reservation.cabin_name || `Cabaña ${reservation.cabin_id}`,
              checkin: new Date(reservation.start_date).toLocaleDateString('es-HN'),
              checkout: new Date(reservation.end_date).toLocaleDateString('es-HN'),
              status: reservation.status === 'confirmada' || reservation.status === 'confirmado' ? 'confirmed' : 'pending',
              guests: reservation.personas || 1,
              price: reservation.total_price || 0 // Ya en lempiras
            }));
            
            setReservations(transformedData);
            setDataSource('backend');
            console.log('✅ Datos del backend cargados:', transformedData.length, 'reservas');
          }
        } else {
          console.log('⚠️ Backend no disponible, usando datos de ejemplo');
          setDataSource('local');
        }
      } catch (error) {
        console.log('⚠️ Error conectando backend:', error.message);
        setDataSource('local');
      } finally {
        setLoading(false);
      }
    };

    loadData();
    
    // Actualizar cada 30 segundos
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const stats = {
    totalReservations: reservations.length,
    totalRevenue: reservations.reduce((sum, r) => sum + r.price, 0),
    totalGuests: reservations.reduce((sum, r) => sum + r.guests, 0),
    occupancyRate: 85
  };

  return (
    <DashboardLayout title="Dashboard">
      <Box sx={{ p: 3 }}>
        {/* Título con bandera de Honduras */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            🇭🇳 Dashboard de Reservas - Honduras
          </Typography>
          <Chip 
            label={dataSource === 'backend' ? '🟢 Datos en vivo' : '🟡 Datos de ejemplo'}
            color={dataSource === 'backend' ? 'success' : 'warning'}
            size="small"
          />
        </Box>

        {/* Métricas principales */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={3}>
            <Card sx={{ textAlign: 'center', p: 2, bgcolor: '#1976d2', color: 'white' }}>
              <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mx: 'auto', mb: 1 }}>
                <Event />
              </Avatar>
              <Typography variant="h3" sx={{ fontWeight: 700 }}>
                {stats.totalReservations}
              </Typography>
              <Typography>Reservas Activas</Typography>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card sx={{ textAlign: 'center', p: 2, bgcolor: '#2e7d32', color: 'white' }}>
              <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mx: 'auto', mb: 1 }}>
                <TrendingUp />
              </Avatar>
              <Typography variant="h3" sx={{ fontWeight: 700 }}>
                L{stats.totalRevenue.toLocaleString('es-HN')}
              </Typography>
              <Typography>Ingresos Totales</Typography>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card sx={{ textAlign: 'center', p: 2, bgcolor: '#ed6c02', color: 'white' }}>
              <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mx: 'auto', mb: 1 }}>
                <People />
              </Avatar>
              <Typography variant="h3" sx={{ fontWeight: 700 }}>
                {stats.totalGuests}
              </Typography>
              <Typography>Huéspedes Total</Typography>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card sx={{ textAlign: 'center', p: 2, bgcolor: '#9c27b0', color: 'white' }}>
              <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mx: 'auto', mb: 1 }}>
                <Hotel />
              </Avatar>
              <Typography variant="h3" sx={{ fontWeight: 700 }}>
                {stats.occupancyRate}%
              </Typography>
              <Typography>Ocupación</Typography>
            </Card>
          </Grid>
        </Grid>

        {/* Lista de reservas */}
        <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#1976d2' }}>
            🏨 Próximas Reservas
          </Typography>

          {loading ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="textSecondary">
                Cargando reservas...
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {reservations.map((reservation, index) => (
                <React.Fragment key={reservation.id}>
                  <ListItem sx={{ px: 0, py: 3 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ 
                        bgcolor: reservation.status === 'confirmed' ? '#2e7d32' : '#ed6c02',
                        width: 56,
                        height: 56
                      }}>
                        <CheckCircle sx={{ fontSize: 28 }} />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      sx={{ ml: 2 }}
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1976d2' }}>
                            {reservation.guest}
                          </Typography>
                          <Chip 
                            label={reservation.status === 'confirmed' ? 'Confirmada' : 'Pendiente'}
                            color={reservation.status === 'confirmed' ? 'success' : 'warning'}
                            size="small"
                            sx={{ fontWeight: 600 }}
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body1" sx={{ mb: 0.5, fontWeight: 600 }}>
                            🏠 {reservation.cabin}
                          </Typography>
                          <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
                            📅 {reservation.checkin} → {reservation.checkout}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            👥 {reservation.guests} huéspedes • 💰 L{reservation.price.toLocaleString('es-HN')}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < reservations.length - 1 && <Divider sx={{ my: 1 }} />}
                </React.Fragment>
              ))}
            </List>
          )}

          {!loading && reservations.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="textSecondary">
                No hay reservas disponibles
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>
    </DashboardLayout>
  );
};

export default DashboardSimple;
