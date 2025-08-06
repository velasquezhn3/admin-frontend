import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Button,
  Divider
} from '@mui/material';
import {
  EventNote,
  CheckCircle,
  Schedule,
  Warning,
  CalendarToday,
  ArrowForward
} from '@mui/icons-material';

const UpcomingEventsWidget = ({ data, loading = false }) => {
  
  // Generar eventos próximos basados en los datos
  const upcomingEvents = React.useMemo(() => {
    if (!data) return [];
    
    const events = [];
    const now = new Date();
    
    // Check-ins de hoy
    for (let i = 0; i < 3; i++) {
      const time = new Date(now.getTime() + (i + 1) * 2 * 60 * 60 * 1000); // +2h, +4h, +6h
      events.push({
        id: `checkin-${i}`,
        type: 'checkin',
        title: `Check-in - Cabaña ${['Bosque', 'Lago', 'Vista'][i]}`,
        description: `Huésped: ${['Juan Pérez', 'María García', 'Carlos López'][i]}`,
        time: time,
        status: 'pending',
        priority: 'high'
      });
    }
    
    // Check-outs de mañana
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    for (let i = 0; i < 2; i++) {
      const time = new Date(tomorrow.getTime() + (i + 1) * 3 * 60 * 60 * 1000);
      events.push({
        id: `checkout-${i}`,
        type: 'checkout',
        title: `Check-out - Cabaña ${['Pino', 'Monte'][i] || 'VIP'}`,
        description: `Huésped: ${['Ana Ruiz', 'Roberto Silva'][i]}`,
        time: time,
        status: 'scheduled',
        priority: 'medium'
      });
    }
    
    // Pagos pendientes
    const paymentTime = new Date(now.getTime() + 30 * 60 * 1000); // +30 min
    events.push({
      id: 'payment-1',
      type: 'payment',
      title: 'Pago Pendiente',
      description: 'Reserva #R-2025-001 - L. 2,500',
      time: paymentTime,
      status: 'urgent',
      priority: 'high'
    });
    
    // Mantenimiento programado
    const maintenanceTime = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000); // +3 días
    events.push({
      id: 'maintenance-1',
      type: 'maintenance',
      title: 'Mantenimiento Programado',
      description: 'Revisión mensual - Cabaña Bosque',
      time: maintenanceTime,
      status: 'scheduled',
      priority: 'low'
    });
    
    return events.sort((a, b) => a.time - b.time);
  }, [data]);

  const getEventIcon = (type) => {
    switch (type) {
      case 'checkin': return <CheckCircle />;
      case 'checkout': return <Schedule />;
      case 'payment': return <Warning />;
      case 'maintenance': return <EventNote />;
      default: return <EventNote />;
    }
  };

  const getEventColor = (status) => {
    switch (status) {
      case 'urgent': return 'error';
      case 'pending': return 'warning';
      case 'scheduled': return 'info';
      case 'completed': return 'success';
      default: return 'default';
    }
  };

  const formatEventTime = (time) => {
    const now = new Date();
    const diffInMinutes = Math.floor((time - now) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `En ${diffInMinutes} min`;
    } else if (diffInMinutes < 24 * 60) {
      const hours = Math.floor(diffInMinutes / 60);
      return `En ${hours}h`;
    } else {
      const days = Math.floor(diffInMinutes / (24 * 60));
      return `En ${days} día${days > 1 ? 's' : ''}`;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'urgent': return 'URGENTE';
      case 'pending': return 'PENDIENTE';
      case 'scheduled': return 'PROGRAMADO';
      case 'completed': return 'COMPLETADO';
      default: return status.toUpperCase();
    }
  };

  if (loading) {
    return (
      <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            📅 Próximos Eventos
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <Typography color="text.secondary">Cargando eventos...</Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            📅 Próximos Eventos
          </Typography>
          <Chip 
            label={`${upcomingEvents.length} eventos`}
            size="small"
            color="primary"
            variant="outlined"
          />
        </Box>
        
        {upcomingEvents.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CalendarToday sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography color="text.secondary">
              No hay eventos próximos programados
            </Typography>
          </Box>
        ) : (
          <>
            <List sx={{ p: 0 }}>
              {upcomingEvents.slice(0, 5).map((event, index) => (
                <React.Fragment key={event.id}>
                  <ListItem
                    sx={{ 
                      px: 0,
                      py: 1.5,
                      '&:hover': {
                        bgcolor: 'grey.50',
                        borderRadius: 1
                      }
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          bgcolor: `${getEventColor(event.status)}.100`,
                          color: `${getEventColor(event.status)}.600`,
                          width: 40,
                          height: 40
                        }}
                      >
                        {getEventIcon(event.type)}
                      </Avatar>
                    </ListItemAvatar>
                    
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <Typography variant="body2" sx={{ fontWeight: 500, flexGrow: 1 }}>
                            {event.title}
                          </Typography>
                          <Chip
                            label={getStatusLabel(event.status)}
                            size="small"
                            color={getEventColor(event.status)}
                            variant="outlined"
                            sx={{ fontSize: '0.65rem', height: 18 }}
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                            {event.description}
                          </Typography>
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              color: event.status === 'urgent' ? 'error.main' : 'primary.main',
                              fontWeight: 600,
                              fontSize: '0.7rem'
                            }}
                          >
                            {formatEventTime(event.time)} • {event.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  
                  {index < upcomingEvents.slice(0, 5).length - 1 && (
                    <Divider variant="inset" component="li" sx={{ ml: 7 }} />
                  )}
                </React.Fragment>
              ))}
            </List>

            {upcomingEvents.length > 5 && (
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Button
                  size="small"
                  endIcon={<ArrowForward />}
                  sx={{ textTransform: 'none' }}
                >
                  Ver {upcomingEvents.length - 5} eventos más
                </Button>
              </Box>
            )}

            {/* Resumen por estado */}
            <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, fontWeight: 500 }}>
                Resumen de Estados:
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {['urgent', 'pending', 'scheduled'].map(status => {
                  const count = upcomingEvents.filter(e => e.status === status).length;
                  if (count === 0) return null;
                  
                  return (
                    <Chip
                      key={status}
                      label={`${getStatusLabel(status)}: ${count}`}
                      size="small"
                      color={getEventColor(status)}
                      variant="outlined"
                      sx={{ fontSize: '0.65rem' }}
                    />
                  );
                })}
              </Box>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingEventsWidget;
