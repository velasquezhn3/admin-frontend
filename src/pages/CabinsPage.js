import React, { useEffect, useState } from 'react';
import {
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Chip,
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
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {cabins.length === 0 && (
            <Typography variant="body1" sx={{ mt: 2 }}>
              No hay cabañas registradas.
            </Typography>
          )}
          {cabins.map((cabin) => (
            <Card key={cabin.cabin_id} sx={{ maxWidth: 345 }}>
              {cabin.fotos && cabin.fotos.length > 0 && (
                <CardMedia
                  component="img"
                  height="180"
                  image={cabin.fotos[0]}
                  alt={cabin.name}
                />
              )}
              <CardContent>
                <Typography variant="h6">{cabin.name}</Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Capacidad: {cabin.capacity} personas
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Precio: L {cabin.price}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {cabin.description}
                </Typography>
                <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {cabin.comodidades && cabin.comodidades.map((amenity, index) => (
                    <Chip key={index} label={amenity} size="small" />
                  ))}
                </Box>
                <Box sx={{ mt: 1 }}>
                  <Button size="small" onClick={() => handleOpenDialog(cabin)} startIcon={<Edit />}>
                    Editar
                  </Button>
                  <Button size="small" color="error" onClick={() => handleDelete(cabin.cabin_id)} startIcon={<Delete />}>
                    Eliminar
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Grid>
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
