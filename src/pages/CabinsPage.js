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

const API_URL = '/admin/cabins';

const initialFormState = {
  name: '',
  capacity: '',
  price: '',
  description: '',
  photo: null,
};

const CabinsPage = () => {
  const [cabins, setCabins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [form, setForm] = useState(initialFormState);
  const [editId, setEditId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fetchCabins = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setCabins(data);
    } catch (error) {
      setSnackbar({ open: true, message: 'Error cargando cabañas', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCabins();
  }, []);

  const handleOpenDialog = (cabin = null) => {
    if (cabin) {
      setForm({
        name: cabin.name || '',
        capacity: cabin.capacity || '',
        price: cabin.price || '',
        description: cabin.description || '',
        photo: null,
      });
      setEditId(cabin.cabin_id);
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
    const { name, value, files } = e.target;
    if (name === 'photo') {
      setForm((prev) => ({ ...prev, photo: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!form.name || !form.capacity || !form.price) {
      setSnackbar({ open: true, message: 'Por favor completa los campos obligatorios', severity: 'warning' });
      return;
    }

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('capacity', form.capacity);
    formData.append('price', form.price);
    formData.append('description', form.description);
    if (form.photo) {
      formData.append('photo', form.photo);
    }

    try {
      let res;
      if (editId) {
        res = await fetch(`${API_URL}/${editId}`, {
          method: 'PUT',
          body: formData,
        });
      } else {
        res = await fetch(API_URL, {
          method: 'POST',
          body: formData,
        });
      }
      const data = await res.json();
      if (data.success) {
        setSnackbar({ open: true, message: 'Guardado exitoso', severity: 'success' });
        fetchCabins();
        handleCloseDialog();
      } else {
        setSnackbar({ open: true, message: data.message || 'Error al guardar', severity: 'error' });
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Error en la solicitud', severity: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta cabaña?')) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setSnackbar({ open: true, message: 'Cabaña eliminada', severity: 'success' });
        fetchCabins();
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
        Gestión de Cabañas
      </Typography>
      <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenDialog()}>
        Nueva Cabaña
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
                <TableCell>Nombre</TableCell>
                <TableCell>Capacidad</TableCell>
                <TableCell>Precio</TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cabins.map((cabin) => (
                <TableRow key={cabin.cabin_id}>
                  <TableCell>{cabin.name}</TableCell>
                  <TableCell>{cabin.capacity}</TableCell>
                  <TableCell>${cabin.price}</TableCell>
                  <TableCell>{cabin.description}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenDialog(cabin)} color="primary">
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(cabin.cabin_id)} color="error">
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {cabins.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No hay cabañas registradas.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editId ? 'Editar Cabaña' : 'Nueva Cabaña'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Nombre"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            margin="dense"
            label="Capacidad"
            name="capacity"
            type="number"
            value={form.capacity}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            margin="dense"
            label="Precio"
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            margin="dense"
            label="Descripción"
            name="description"
            value={form.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
          />
          <Button variant="contained" component="label" sx={{ mt: 2 }}>
            Subir Foto
            <input type="file" name="photo" hidden onChange={handleChange} accept="image/*" />
          </Button>
          {form.photo && <Typography variant="body2" sx={{ mt: 1 }}>{form.photo.name}</Typography>}
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

export default CabinsPage;
