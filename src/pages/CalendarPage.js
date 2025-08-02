import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Chip,
  Avatar,
  useTheme,
  Tooltip,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  Today,
  ViewWeek,
  ViewModule,
  Add as AddIcon,
  MoreVert,
  Person,
  Home,
  EventNote,
} from '@mui/icons-material';
import DashboardLayout from '../components/Layout/DashboardLayout';
import StatusChip from '../components/Common/StatusChip';

// Datos de ejemplo para el calendario
const reservationsCalendar = [
  {
    id: 1,
    title: 'Juan Pérez',
    cabana: 'Cabaña Bosque',
    startDate: '2025-08-01',
    endDate: '2025-08-03',
    status: 'confirmada',
    guests: 4,
    phone: '+54 9 11 1234-5678',
    total: 75000,
  },
  {
    id: 2,
    title: 'María García',
    cabana: 'Cabaña Lago',
    startDate: '2025-08-05',
    endDate: '2025-08-07',
    status: 'pendiente',
    guests: 2,
    phone: '+54 9 11 2345-6789',
    total: 70000,
  },
  {
    id: 3,
    title: 'Carlos López',
    cabana: 'Cabaña Vista',
    startDate: '2025-08-10',
    endDate: '2025-08-12',
    status: 'check-in',
    guests: 6,
    phone: '+54 9 11 3456-7890',
    total: 135000,
  },
  {
    id: 4,
    title: 'Ana Ruiz',
    cabana: 'Cabaña Pino',
    startDate: '2025-08-15',
    endDate: '2025-08-18',
    status: 'confirmada',
    guests: 3,
    phone: '+54 9 11 4567-8901',
    total: 105000,
  },
];

const cabins = ['Cabaña Bosque', 'Cabaña Lago', 'Cabaña Vista', 'Cabaña Pino'];

const CalendarPage = () => {
  const theme = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date(2025, 7, 1)); // Agosto 2025
  const [viewMode, setViewMode] = useState('month'); // month, week
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const isDateInRange = (date, startDate, endDate) => {
    const checkDate = new Date(date);
    const start = new Date(startDate);
    const end = new Date(endDate);
    return checkDate >= start && checkDate <= end;
  };

  const getReservationsForDate = (date) => {
    return reservationsCalendar.filter(reservation => 
      isDateInRange(date, reservation.startDate, reservation.endDate)
    );
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Días del mes anterior para completar la primera semana
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      days.push({
        date: prevDate,
        isCurrentMonth: false,
        dayNumber: prevDate.getDate(),
      });
    }

    // Días del mes actual
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      days.push({
        date: currentDate,
        isCurrentMonth: true,
        dayNumber: day,
      });
    }

    // Días del mes siguiente para completar la última semana
    const totalCells = Math.ceil(days.length / 7) * 7;
    const remainingCells = totalCells - days.length;
    for (let day = 1; day <= remainingCells; day++) {
      const nextDate = new Date(year, month + 1, day);
      days.push({
        date: nextDate,
        isCurrentMonth: false,
        dayNumber: day,
      });
    }

    return days;
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const handleReservationClick = (reservation) => {
    setSelectedReservation(reservation);
    setDetailDialogOpen(true);
  };

  const ReservationDetailDialog = () => (
    <Dialog
      open={detailDialogOpen}
      onClose={() => setDetailDialogOpen(false)}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Detalle de Reserva
          </Typography>
          <StatusChip status={selectedReservation?.status} />
        </Box>
      </DialogTitle>

      {selectedReservation && (
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar
                  sx={{
                    width: 60,
                    height: 60,
                    bgcolor: 'primary.main',
                    fontSize: '1.2rem',
                    fontWeight: 600,
                  }}
                >
                  {getInitials(selectedReservation.title)}
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {selectedReservation.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedReservation.phone}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Card sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Home sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2">
                        <strong>Cabaña:</strong> {selectedReservation.cabana}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Person sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2">
                        <strong>Huéspedes:</strong> {selectedReservation.guests}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <EventNote sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2">
                        <strong>Check-in:</strong> {new Date(selectedReservation.startDate).toLocaleDateString('es-AR')}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <EventNote sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2">
                        <strong>Check-out:</strong> {new Date(selectedReservation.endDate).toLocaleDateString('es-AR')}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                p: 2,
                bgcolor: 'primary.light',
                borderRadius: 2
              }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Total
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  {formatCurrency(selectedReservation.total)}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
      )}

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={() => setDetailDialogOpen(false)}>
          Cerrar
        </Button>
        <Button variant="outlined">
          Editar
        </Button>
        <Button variant="contained">
          Check-in/out
        </Button>
      </DialogActions>
    </Dialog>
  );

  const CalendarDay = ({ day }) => {
    const reservations = getReservationsForDate(day.date);
    const isToday = new Date().toDateString() === day.date.toDateString();

    return (
      <Box
        sx={{
          minHeight: 100,
          border: '1px solid',
          borderColor: 'divider',
          p: 0.5,
          bgcolor: day.isCurrentMonth ? 'white' : 'grey.50',
          position: 'relative',
          '&:hover': {
            bgcolor: 'action.hover',
          },
        }}
      >
        <Typography
          variant="body2"
          sx={{
            fontWeight: isToday ? 700 : 500,
            color: day.isCurrentMonth ? (isToday ? 'primary.main' : 'text.primary') : 'text.secondary',
            mb: 0.5,
          }}
        >
          {day.dayNumber}
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {reservations.slice(0, 3).map((reservation) => (
            <Tooltip
              key={reservation.id}
              title={`${reservation.title} - ${reservation.cabana}`}
              arrow
            >
              <Box
                onClick={() => handleReservationClick(reservation)}
                sx={{
                  p: 0.5,
                  borderRadius: 1,
                  bgcolor: reservation.status === 'confirmada' ? 'success.light' :
                           reservation.status === 'pendiente' ? 'warning.light' :
                           reservation.status === 'check-in' ? 'info.light' : 'grey.200',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  lineHeight: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  '&:hover': {
                    opacity: 0.8,
                  },
                }}
              >
                <Typography variant="caption" sx={{ fontWeight: 500, fontSize: '0.7rem' }}>
                  {reservation.title}
                </Typography>
              </Box>
            </Tooltip>
          ))}
          {reservations.length > 3 && (
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
              +{reservations.length - 3} más
            </Typography>
          )}
        </Box>
      </Box>
    );
  };

  return (
    <DashboardLayout title="Calendario de Reservas">
      <Box>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Calendario
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ borderRadius: 2, textTransform: 'none' }}
          >
            Nueva Reserva
          </Button>
        </Box>

        {/* Controles del calendario */}
        <Card sx={{ mb: 3, borderRadius: 2 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton onClick={() => navigateMonth(-1)}>
                  <ChevronLeft />
                </IconButton>
                <Typography variant="h5" sx={{ fontWeight: 600, minWidth: 200, textAlign: 'center' }}>
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </Typography>
                <IconButton onClick={() => navigateMonth(1)}>
                  <ChevronRight />
                </IconButton>
                <Button
                  variant="outlined"
                  startIcon={<Today />}
                  onClick={goToToday}
                  sx={{ ml: 2, borderRadius: 2, textTransform: 'none' }}
                >
                  Hoy
                </Button>
              </Box>

              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant={viewMode === 'month' ? 'contained' : 'outlined'}
                  startIcon={<ViewModule />}
                  onClick={() => setViewMode('month')}
                  sx={{ borderRadius: 2, textTransform: 'none' }}
                >
                  Mes
                </Button>
                <Button
                  variant={viewMode === 'week' ? 'contained' : 'outlined'}
                  startIcon={<ViewWeek />}
                  onClick={() => setViewMode('week')}
                  sx={{ borderRadius: 2, textTransform: 'none' }}
                  disabled
                >
                  Semana
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Leyenda */}
        <Card sx={{ mb: 3, borderRadius: 2 }}>
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Leyenda:
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 16, height: 16, bgcolor: 'success.light', borderRadius: 1 }} />
                <Typography variant="caption">Confirmada</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 16, height: 16, bgcolor: 'warning.light', borderRadius: 1 }} />
                <Typography variant="caption">Pendiente</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 16, height: 16, bgcolor: 'info.light', borderRadius: 1 }} />
                <Typography variant="caption">Check-in</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Calendario */}
        <Card sx={{ borderRadius: 2 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
            {/* Headers de días */}
            {dayNames.map((dayName) => (
              <Box
                key={dayName}
                sx={{
                  p: 2,
                  borderBottom: '2px solid',
                  borderColor: 'divider',
                  bgcolor: 'grey.100',
                  textAlign: 'center',
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {dayName}
                </Typography>
              </Box>
            ))}
            
            {/* Días del calendario */}
            {getDaysInMonth(currentDate).map((day, index) => (
              <CalendarDay key={index} day={day} />
            ))}
          </Box>
        </Card>

        {/* Resumen lateral */}
        <Grid container spacing={3} sx={{ mt: 3 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Resumen del Mes
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Total Reservas</Typography>
                    <Chip label={reservationsCalendar.length} color="primary" size="small" />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Confirmadas</Typography>
                    <Chip label="2" color="success" size="small" />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Pendientes</Typography>
                    <Chip label="1" color="warning" size="small" />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Check-in</Typography>
                    <Chip label="1" color="info" size="small" />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card sx={{ borderRadius: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Próximas Actividades
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {reservationsCalendar.slice(0, 3).map((reservation) => (
                    <Box
                      key={reservation.id}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        p: 2,
                        bgcolor: 'grey.50',
                        borderRadius: 2,
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                          sx={{
                            width: 40,
                            height: 40,
                            bgcolor: 'primary.main',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                          }}
                        >
                          {getInitials(reservation.title)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {reservation.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {reservation.cabana} • {new Date(reservation.startDate).toLocaleDateString('es-AR')}
                          </Typography>
                        </Box>
                      </Box>
                      <StatusChip status={reservation.status} size="small" />
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Dialog de detalles */}
        <ReservationDetailDialog />
      </Box>
    </DashboardLayout>
  );
};

export default CalendarPage;
