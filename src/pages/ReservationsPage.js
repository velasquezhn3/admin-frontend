import React, { useEffect, useState } from 'react';
import {
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';

const API_URL = 'http://localhost:4000/admin/reservations';

const initialFormState = {
  cabin_id: '',
  user_id: '',
  start_date: '',
  end_date: '',
  status: '',
  total_price: '',
  personas: '',
};

const ReservationsPage = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [form, setForm] = useState(initialFormState);
  const [editId, setEditId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      console.log('Datos recibidos de reservas:', data);
      if (data.success === false) {
        setSnackbar({ open: true, message: data.message || 'No se pudo cargar reservas', severity: 'error' });
        setReservations([]);
      } else {
        // Los datos ya vienen en el formato correcto del backend
        setReservations(data);
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Error cargando reservas', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleOpenDialog = (reservation = null) => {
    if (reservation) {
      setForm({
        cabin_id: reservation.cabin_id || '',
        user_id: reservation.user_id || '',
        start_date: reservation.start_date || '',
        end_date: reservation.end_date || '',
        status: reservation.status || '',
        total_price: reservation.total_price || '',
        personas: reservation.personas || '',
      });
      setEditId(reservation.reservation_id);
    } else {
      setForm(initialFormState);
      setEditId(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setForm(initialFormState);
    setEditId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!form.cabin_id || !form.user_id || !form.start_date || !form.end_date || !form.status) {
      setSnackbar({ open: true, message: 'Por favor completa los campos obligatorios', severity: 'warning' });
      return;
    }

    try {
      let res;
      // Mapear los datos al formato que espera el backend
      const requestData = {
        cabin_id: form.cabin_id,
        user_id: form.user_id,
        start_date: form.start_date,
        end_date: form.end_date,
        status: form.status,
        total_price: form.total_price,
        number_of_people: form.personas
      };
      
      if (editId) {
        res = await fetch(`${API_URL}/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestData),
        });
      } else {
        res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestData),
        });
      }
      const data = await res.json();
      if (data.success) {
        setSnackbar({ open: true, message: 'Guardado exitoso', severity: 'success' });
        fetchReservations();
        handleCloseDialog();
      } else {
        setSnackbar({ open: true, message: data.message || 'Error al guardar', severity: 'error' });
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Error en la solicitud', severity: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta reserva?')) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setSnackbar({ open: true, message: 'Reserva eliminada', severity: 'success' });
        fetchReservations();
      } else {
        setSnackbar({ open: true, message: 'Error al eliminar', severity: 'error' });
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Error en la solicitud', severity: 'error' });
    }
  };

  return (
    <Box p={2}>
      <Typography variant="h4" gutterBottom>
        Gestión de Reservas
      </Typography>
      <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenDialog()}>
        Nueva Reserva
      </Button>
      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID Reserva</TableCell>
              <TableCell>Cabaña</TableCell>
              <TableCell>Usuario</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell>Personas</TableCell>
              <TableCell>Fecha Inicio</TableCell>
              <TableCell>Fecha Fin</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Precio Total</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reservations.map((reservation) => (
              <TableRow key={reservation.reservation_id}>
                <TableCell>{reservation.reservation_id}</TableCell>
                <TableCell>{reservation.cabin_name || `Cabaña ${reservation.cabin_id}`}</TableCell>
                <TableCell>{reservation.user_name || `Usuario ${reservation.user_id}`}</TableCell>
                <TableCell>{reservation.phone_number}</TableCell>
                <TableCell>{reservation.personas}</TableCell>
                <TableCell>{reservation.start_date}</TableCell>
                <TableCell>{reservation.end_date}</TableCell>
                <TableCell>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    backgroundColor: 
                      reservation.status === 'confirmado' ? '#d4edda' :
                      reservation.status === 'pendiente' ? '#fff3cd' :
                      reservation.status === 'cancelada' ? '#f8d7da' : '#e2e3e5',
                    color:
                      reservation.status === 'confirmado' ? '#155724' :
                      reservation.status === 'pendiente' ? '#856404' :
                      reservation.status === 'cancelada' ? '#721c24' : '#383d41'
                  }}>
                    {reservation.status}
                  </span>
                </TableCell>
                <TableCell>L. {reservation.total_price}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(reservation)} color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(reservation.reservation_id)} color="error">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {reservations.length === 0 && (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  No hay reservas registradas.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editId ? 'Editar Reserva' : 'Nueva Reserva'}</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="ID Cabaña"
              name="cabin_id"
              type="number"
              value={form.cabin_id}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              margin="dense"
              label="ID Usuario"
              name="user_id"
              type="text"
              value={form.user_id}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              margin="dense"
              label="Cantidad Personas"
              name="personas"
              type="number"
              value={form.personas}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              margin="dense"
              label="Fecha Inicio"
              name="start_date"
              type="date"
              value={form.start_date}
              onChange={handleChange}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              margin="dense"
              label="Fecha Fin"
              name="end_date"
              type="date"
              value={form.end_date}
              onChange={handleChange}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              margin="dense"
              label="Estado"
              name="status"
              value={form.status}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              margin="dense"
              label="Precio Total"
              name="total_price"
              type="number"
              value={form.total_price}
              onChange={handleChange}
              fullWidth
            />
          </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editId ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ReservationsPage;
