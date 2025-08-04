import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Box,
  CircularProgress,
  Alert,
  Divider,
  Button,
} from '@mui/material';
import {
  Login as CheckInIcon,
  ExitToApp as CheckOutIcon,
  Phone as PhoneIcon,
  Person as PersonIcon,
  Home as HomeIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import apiService from '../../services/apiService';

const UpcomingReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUpcomingReservations = async () => {
      try {
        setLoading(true);
        const data = await apiService.getUpcomingReservations();
        setReservations(data || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching upcoming reservations:', err);
        setError('Error al cargar las reservas inminentes');
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingReservations();
  }, []);

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'today':
        return 'error';
      case 'tomorrow':
        return 'warning';
      case 'later':
        return 'info';
      default:
        return 'info';
    }
  };

  const getUrgencyLabel = (urgency) => {
    switch (urgency) {
      case 'today':
        return 'HOY';
      case 'tomorrow':
        return 'MAÑANA';
      case 'later':
        return 'PRÓXIMAMENTE';
      default:
        return 'PRÓXIMAMENTE';
    }
  };

  const getEventIcon = (eventType) => {
    return eventType === 'check_in' ? <CheckInIcon /> : <CheckOutIcon />;
  };

  const getEventLabel = (eventType) => {
    return eventType === 'check_in' ? 'Check-in' : 'Check-out';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-HN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-HN', {
      style: 'currency',
      currency: 'HNL',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <Card sx={{ borderRadius: 2 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Reservas Inminentes
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card sx={{ borderRadius: 2 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Reservas Inminentes
          </Typography>
          <Alert severity="error">{error}</Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ borderRadius: 2 }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Reservas Inminentes (24-72h)
          </Typography>
          <Button
            size="small"
            onClick={() => navigate('/reservations')}
            sx={{ textTransform: 'none' }}
          >
            Ver todas
          </Button>
        </Box>
        
        {reservations.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <ScheduleIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
            <Typography variant="body2" color="text.secondary">
              No hay reservas próximas en las siguientes 72 horas
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {reservations.map((reservation, index) => (
              <React.Fragment key={reservation.reservation_id}>
                <ListItem sx={{ px: 0, py: 2, alignItems: 'flex-start' }}>
                  <ListItemIcon sx={{ mt: 0.5 }}>
                    {getEventIcon(reservation.event_type)}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {getEventLabel(reservation.event_type)} - {reservation.cabin_name}
                        </Typography>
                        <Chip
                          label={getUrgencyLabel(reservation.urgency)}
                          size="small"
                          color={getUrgencyColor(reservation.urgency)}
                          sx={{ height: 20, fontSize: '0.75rem', fontWeight: 600 }}
                        />
                      </Box>
                    }
                    secondary={
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <PersonIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {reservation.user_name}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <PhoneIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {reservation.phone_number}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <HomeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {reservation.personas} persona{reservation.personas !== 1 ? 's' : ''} | {formatCurrency(reservation.total_price)}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {reservation.event_type === 'check_in' ? 'Entrada' : 'Salida'}: {formatDate(reservation.event_type === 'check_in' ? reservation.start_date : reservation.end_date)}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
                {index < reservations.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingReservations;
