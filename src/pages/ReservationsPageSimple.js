import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import DashboardLayout from '../components/Layout/DashboardLayout';
import apiService from '../services/apiService';

const ReservationsPageSimple = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingReservation, setEditingReservation] = useState(null);
  const [formData, setFormData] = useState({
    cabin_id: '',
    user_id: '',
    start_date: '',
    end_date: '',
    status: 'pendiente',
    total_price: '',
    personas: ''
  });

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const data = await apiService.getReservations();
      setReservations(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching reservations:', err);
      setError('Error al cargar las reservas');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (reservation = null) => {
    setEditingReservation(reservation);
    if (reservation) {
      setFormData({
        cabin_id: reservation.cabin_id || '',
        user_id: reservation.user_id || '',
        start_date: reservation.start_date || '',
        end_date: reservation.end_date || '',
        status: reservation.status || 'pendiente',
        total_price: reservation.total_price || '',
        personas: reservation.personas || ''
      });
    } else {
      setFormData({
        cabin_id: '',
        user_id: '',
        start_date: '',
        end_date: '',
        status: 'pendiente',
        total_price: '',
        personas: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingReservation(null);
  };

  const handleSubmit = async () => {
    try {
      // Mapear los datos al formato que espera el backend
      const requestData = {
        cabin_id: formData.cabin_id,
        user_id: formData.user_id,
        start_date: formData.start_date,
        end_date: formData.end_date,
        status: formData.status,
        total_price: formData.total_price,
        number_of_people: formData.personas
      };
      
      if (editingReservation) {
        await apiService.updateReservation(editingReservation.reservation_id, requestData);
      } else {
        await apiService.createReservation(requestData);
      }
      await fetchReservations();
      handleCloseDialog();
    } catch (err) {
      console.error('Error saving reservation:', err);
      setError('Error al guardar la reserva');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta reserva?')) {
      try {
        await apiService.deleteReservation(id);
        await fetchReservations();
      } catch (err) {
        console.error('Error deleting reservation:', err);
        setError('Error al eliminar la reserva');
      }
    }
  };

  const getStatusColor = (estado) => {
    switch (estado) {
      case 'confirmado': return 'success';
      case 'cancelada': return 'error';
      case 'pendiente': return 'warning';
      default: return 'default';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const formatCurrency = (amount) => {
    if (!amount) return '-';
    return `L. ${parseFloat(amount).toLocaleString('es-HN')}`;
  };

  return (
    <DashboardLayout title="Gestión de Reservas">
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Reservas
          </Typography>
          <Box>
            <Button
              startIcon={<RefreshIcon />}
              onClick={fetchReservations}
              sx={{ mr: 2 }}
              disabled={loading}
            >
              Actualizar
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
            >
              Nueva Reserva
            </Button>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Card>
          <CardContent>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : reservations.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" color="text.secondary">
                  No hay reservas registradas
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Comienza agregando tu primera reserva
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenDialog()}
                >
                  Crear Primera Reserva
                </Button>
              </Box>
            ) : (
              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>ID</strong></TableCell>
                      <TableCell><strong>Usuario</strong></TableCell>
                      <TableCell><strong>Teléfono</strong></TableCell>
                      <TableCell><strong>Cabaña</strong></TableCell>
                      <TableCell><strong>Personas</strong></TableCell>
                      <TableCell><strong>Fecha Inicio</strong></TableCell>
                      <TableCell><strong>Fecha Fin</strong></TableCell>
                      <TableCell><strong>Estado</strong></TableCell>
                      <TableCell><strong>Precio</strong></TableCell>
                      <TableCell><strong>Acciones</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reservations.map((reservation) => (
                      <TableRow key={reservation.reservation_id}>
                        <TableCell>{reservation.reservation_id}</TableCell>
                        <TableCell>{reservation.user_name || `Usuario ${reservation.user_id}`}</TableCell>
                        <TableCell>{reservation.phone_number}</TableCell>
                        <TableCell>{reservation.cabin_name || `Cabaña ${reservation.cabin_id}`}</TableCell>
                        <TableCell>{reservation.personas}</TableCell>
                        <TableCell>{formatDate(reservation.start_date)}</TableCell>
                        <TableCell>{formatDate(reservation.end_date)}</TableCell>
                        <TableCell>
                          <Chip
                            label={reservation.status}
                            color={getStatusColor(reservation.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{formatCurrency(reservation.total_price)}</TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDialog(reservation)}
                            sx={{ mr: 1 }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(reservation.reservation_id)}
                            color="error"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      </Box>

      {/* Dialog for Create/Edit */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingReservation ? 'Editar Reserva' : 'Nueva Reserva'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="ID Cabaña"
                type="number"
                value={formData.cabin_id}
                onChange={(e) => setFormData({ ...formData, cabin_id: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="ID Usuario"
                type="number"
                value={formData.user_id}
                onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Cantidad de Personas"
                type="number"
                value={formData.personas}
                onChange={(e) => setFormData({ ...formData, personas: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Fecha Inicio"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Fecha Fin"
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  value={formData.status}
                  label="Estado"
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <MenuItem value="pendiente">Pendiente</MenuItem>
                  <MenuItem value="confirmado">Confirmado</MenuItem>
                  <MenuItem value="cancelada">Cancelada</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Precio Total"
                type="number"
                value={formData.total_price}
                onChange={(e) => setFormData({ ...formData, total_price: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingReservation ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};

export default ReservationsPageSimple;
