import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Chip,
  Drawer,
  useMediaQuery,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  Switch,
  FormControlLabel,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  CardActions,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Fab,
  Badge,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Add as AddIcon,
  MoreVert,
  Edit,
  Delete,
  Visibility,
  Close,
  Home,
  People,
  AttachMoney,
  Star,
  PhotoCamera,
  CloudUpload,
  Settings,
  CalendarMonth,
  CheckCircle,
  Warning,
  Block,
} from '@mui/icons-material';
import DashboardLayout from '../components/Layout/DashboardLayout';
import StatusChip from '../components/Common/StatusChip';
import EmptyState from '../components/Common/EmptyState';

// Datos de ejemplo
const cabinsData = [
  {
    id: 1,
    nombre: 'Cabaña Bosque',
    descripcion: 'Hermosa cabaña ubicada en el corazón del bosque, perfecta para parejas que buscan tranquilidad.',
    capacidad: 4,
    habitaciones: 2,
    baños: 1,
    precio: 1500,
    estado: 'disponible',
    calificacion: 4.8,
    servicios: ['WiFi', 'Cocina', 'Parrilla', 'Calefacción', 'Aire Acondicionado'],
    imagenes: [
      '/api/placeholder/400/300',
      '/api/placeholder/400/300',
      '/api/placeholder/400/300',
    ],
    reservasProximas: 5,
    ocupacionMes: 85,
    ingresosMes: 25500,
  },
  {
    id: 2,
    nombre: 'Cabaña Lago',
    descripcion: 'Cabaña con vista al lago, ideal para familias. Cuenta con todas las comodidades modernas.',
    capacidad: 6,
    habitaciones: 3,
    baños: 2,
    precio: 4500,
    estado: 'ocupada',
    calificacion: 4.9,
    servicios: ['WiFi', 'Cocina', 'Parrilla', 'Deck', 'Vista al Lago'],
    imagenes: [
      '/api/placeholder/400/300',
      '/api/placeholder/400/300',
    ],
    reservasProximas: 8,
    ocupacionMes: 92,
    ingresosMes: 58500,
  },
  {
    id: 3,
    nombre: 'Cabaña Vista',
    descripcion: 'Cabaña moderna con vista panorámica. Perfecta para grupos grandes.',
    capacidad: 8,
    habitaciones: 4,
    baños: 3,
    precio: 6000,
    estado: 'mantenimiento',
    calificacion: 4.7,
    servicios: ['WiFi', 'Cocina', 'Parrilla', 'Jacuzzi', 'Vista Panorámica'],
    imagenes: [
      '/api/placeholder/400/300',
    ],
    reservasProximas: 3,
    ocupacionMes: 65,
    ingresosMes: 39000,
  },
];

const CabinsPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [cabins, setCabins] = useState(cabinsData);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [selectedCabin, setSelectedCabin] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [selectedActionCabin, setSelectedActionCabin] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // grid, list
  
  // Filtros
  const [filters, setFilters] = useState({
    estado: '',
    capacidad: '',
    precio: '',
  });

  // Form data para edición/creación
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    capacidad: 2,
    habitaciones: 1,
    baños: 1,
    precio: 0,
    estado: 'disponible',
    servicios: [],
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-HN', {
      style: 'currency',
      currency: 'HNL',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const serviciosDisponibles = [
    'WiFi', 'Cocina', 'Parrilla', 'Calefacción', 'Aire Acondicionado',
    'Deck', 'Vista al Lago', 'Jacuzzi', 'Vista Panorámica', 'TV Cable',
    'Netflix', 'Estacionamiento', 'Lavadora', 'Secadora'
  ];

  const handleActionMenuOpen = (event, cabin) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedActionCabin(cabin);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedActionCabin(null);
  };

  const handleViewDetail = (cabin) => {
    setSelectedCabin(cabin);
    setDetailDialogOpen(true);
    handleActionMenuClose();
  };

  const handleEditCabin = (cabin) => {
    setSelectedCabin(cabin);
    setFormData({
      nombre: cabin.nombre,
      descripcion: cabin.descripcion,
      capacidad: cabin.capacidad,
      habitaciones: cabin.habitaciones,
      baños: cabin.baños,
      precio: cabin.precio,
      estado: cabin.estado,
      servicios: cabin.servicios,
    });
    setEditDialogOpen(true);
    handleActionMenuClose();
  };

  const handleDeleteCabin = (cabin) => {
    console.log('Eliminar cabaña:', cabin);
    handleActionMenuClose();
  };

  const handleSaveCabin = () => {
    if (selectedCabin) {
      setCabins(prev => prev.map(cabin => 
        cabin.id === selectedCabin.id 
          ? { ...cabin, ...formData }
          : cabin
      ));
    } else {
      const newCabin = {
        id: Date.now(),
        ...formData,
        calificacion: 0,
        imagenes: [],
        reservasProximas: 0,
        ocupacionMes: 0,
        ingresosMes: 0,
      };
      setCabins(prev => [...prev, newCabin]);
    }
    
    setEditDialogOpen(false);
    setSelectedCabin(null);
    resetFormData();
  };

  const resetFormData = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      capacidad: 2,
      habitaciones: 1,
      baños: 1,
      precio: 0,
      estado: 'disponible',
      servicios: [],
    });
  };

  const applyFilters = () => {
    let filtered = cabinsData;

    if (searchTerm) {
      filtered = filtered.filter(cabin => 
        cabin.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cabin.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.estado) {
      filtered = filtered.filter(cabin => cabin.estado === filters.estado);
    }

    if (filters.capacidad) {
      filtered = filtered.filter(cabin => cabin.capacidad >= parseInt(filters.capacidad));
    }

    if (filters.precio) {
      filtered = filtered.filter(cabin => {
        const precio = cabin.precio;
        if (filters.precio === 'low') {
          return precio <= 2000;
        } else if (filters.precio === 'medium') {
          return precio > 2000 && precio <= 4500;
        } else if (filters.precio === 'high') {
          return precio > 4500;
        }
        return true;
      });
    }

    setCabins(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [searchTerm, filters]);

  const CabinCard = ({ cabin }) => (
    <Card sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      transition: 'all 0.2s ease-in-out',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: theme.shadows[8],
      },
      borderRadius: 2,
      border: '1px solid',
      borderColor: 'divider'
    }}>
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="200"
          image={cabin.imagenes[0] || '/api/placeholder/400/300'}
          alt={cabin.nombre}
          sx={{ objectFit: 'cover' }}
        />
        <Box sx={{ position: 'absolute', top: 8, left: 8 }}>
          <StatusChip status={cabin.estado} size="small" />
        </Box>
        <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
          <IconButton
            size="small"
            sx={{ bgcolor: 'rgba(255,255,255,0.8)', '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' } }}
            onClick={(e) => handleActionMenuOpen(e, cabin)}
          >
            <MoreVert />
          </IconButton>
        </Box>
        {cabin.calificacion > 0 && (
          <Box sx={{ 
            position: 'absolute', 
            bottom: 8, 
            right: 8,
            bgcolor: 'rgba(0,0,0,0.7)',
            borderRadius: 1,
            px: 1,
            py: 0.5,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5
          }}>
            <Star sx={{ fontSize: 16, color: '#ffc107' }} />
            <Typography variant="caption" sx={{ color: 'white', fontWeight: 600 }}>
              {cabin.calificacion}
            </Typography>
          </Box>
        )}
      </Box>
      
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          {cabin.nombre}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.4 }}>
          {cabin.descripcion}
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          <Chip icon={<People />} label={`${cabin.capacidad} huéspedes`} size="small" variant="outlined" />
          <Chip icon={<Home />} label={`${cabin.habitaciones} hab`} size="small" variant="outlined" />
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
          {cabin.servicios.slice(0, 3).map((servicio) => (
            <Chip 
              key={servicio} 
              label={servicio} 
              size="small" 
              sx={{ fontSize: '0.7rem', height: 20 }}
            />
          ))}
          {cabin.servicios.length > 3 && (
            <Chip 
              label={`+${cabin.servicios.length - 3}`} 
              size="small" 
              color="primary"
              sx={{ fontSize: '0.7rem', height: 20 }}
            />
          )}
        </Box>

        <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
          {formatCurrency(cabin.precio)}
          <Typography component="span" variant="body2" color="text.secondary">
            /noche
          </Typography>
        </Typography>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button 
          size="small" 
          variant="outlined" 
          onClick={() => handleViewDetail(cabin)}
          sx={{ mr: 1 }}
        >
          Ver Detalles
        </Button>
        <Button 
          size="small" 
          variant="contained" 
          onClick={() => handleEditCabin(cabin)}
        >
          Editar
        </Button>
      </CardActions>
    </Card>
  );

  const FilterDrawerContent = () => (
    <Box sx={{ width: 300, p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Filtros
        </Typography>
        <IconButton onClick={() => setFilterDrawerOpen(false)}>
          <Close />
        </IconButton>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <FormControl fullWidth>
          <InputLabel>Estado</InputLabel>
          <Select
            value={filters.estado}
            label="Estado"
            onChange={(e) => setFilters(prev => ({ ...prev, estado: e.target.value }))}
          >
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="disponible">Disponible</MenuItem>
            <MenuItem value="ocupada">Ocupada</MenuItem>
            <MenuItem value="mantenimiento">Mantenimiento</MenuItem>
            <MenuItem value="limpieza">Limpieza</MenuItem>
          </Select>
        </FormControl>

        <TextField
          type="number"
          label="Capacidad mínima"
          value={filters.capacidad}
          onChange={(e) => setFilters(prev => ({ ...prev, capacidad: e.target.value }))}
          fullWidth
        />

        <FormControl fullWidth>
          <InputLabel>Rango de precio</InputLabel>
          <Select
            value={filters.precio}
            label="Rango de precio"
            onChange={(e) => setFilters(prev => ({ ...prev, precio: e.target.value }))}
          >
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="low">Hasta L 2,000</MenuItem>
            <MenuItem value="medium">L 2,000 - L 4,500</MenuItem>
            <MenuItem value="high">Más de L 4,500</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => {
              setFilters({
                estado: '',
                capacidad: '',
                precio: '',
              });
            }}
          >
            Limpiar
          </Button>
          <Button
            variant="contained"
            fullWidth
            onClick={() => setFilterDrawerOpen(false)}
          >
            Aplicar
          </Button>
        </Box>
      </Box>
    </Box>
  );

  const CabinDetailDialog = () => (
    <Dialog
      open={detailDialogOpen}
      onClose={() => setDetailDialogOpen(false)}
      maxWidth="lg"
      fullWidth
      fullScreen={isMobile}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {selectedCabin?.nombre}
          </Typography>
          <IconButton onClick={() => setDetailDialogOpen(false)}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      {selectedCabin && (
        <DialogContent>
          <Grid container spacing={3}>
            {/* Galería de imágenes */}
            <Grid item xs={12} md={6}>
              <ImageList cols={2} rowHeight={200} gap={8}>
                {selectedCabin.imagenes.map((imagen, index) => (
                  <ImageListItem key={index}>
                    <img
                      src={imagen}
                      alt={`${selectedCabin.nombre} ${index + 1}`}
                      loading="lazy"
                      style={{ borderRadius: 8 }}
                    />
                  </ImageListItem>
                ))}
              </ImageList>
              <Button
                variant="outlined"
                startIcon={<PhotoCamera />}
                fullWidth
                sx={{ mt: 2 }}
                onClick={() => setImageDialogOpen(true)}
              >
                Gestionar Imágenes
              </Button>
            </Grid>

            {/* Información */}
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 3 }}>
                <StatusChip status={selectedCabin.estado} sx={{ mb: 2 }} />
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  {selectedCabin.descripcion}
                </Typography>
              </Box>

              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={4}>
                  <Card sx={{ p: 2, textAlign: 'center', bgcolor: 'grey.50' }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                      {selectedCabin.capacidad}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Huéspedes
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={4}>
                  <Card sx={{ p: 2, textAlign: 'center', bgcolor: 'grey.50' }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'info.main' }}>
                      {selectedCabin.habitaciones}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Habitaciones
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={4}>
                  <Card sx={{ p: 2, textAlign: 'center', bgcolor: 'grey.50' }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                      {selectedCabin.baños}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Baños
                    </Typography>
                  </Card>
                </Grid>
              </Grid>

              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Servicios Incluidos
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {selectedCabin.servicios.map((servicio) => (
                    <Chip 
                      key={servicio} 
                      label={servicio} 
                      variant="outlined"
                      size="small"
                    />
                  ))}
                </Box>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Métricas del Mes
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: 'warning.main' }}>
                        {selectedCabin.reservasProximas}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Reservas
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: 'info.main' }}>
                        {selectedCabin.ocupacionMes}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Ocupación
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: 'success.main' }}>
                        {formatCurrency(selectedCabin.ingresosMes)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Ingresos
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              <Card sx={{ p: 2, bgcolor: 'primary.light', borderRadius: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', textAlign: 'center' }}>
                  {formatCurrency(selectedCabin.precio)}
                  <Typography component="span" variant="body1" color="text.secondary">
                    /noche
                  </Typography>
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </DialogContent>
      )}

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={() => setDetailDialogOpen(false)}>
          Cerrar
        </Button>
        <Button variant="outlined" startIcon={<CalendarMonth />}>
          Ver Calendario
        </Button>
        <Button variant="contained" startIcon={<Edit />} onClick={() => handleEditCabin(selectedCabin)}>
          Editar Cabaña
        </Button>
      </DialogActions>
    </Dialog>
  );

  const CabinFormDialog = () => (
    <Dialog
      open={editDialogOpen}
      onClose={() => setEditDialogOpen(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        {selectedCabin ? 'Editar Cabaña' : 'Nueva Cabaña'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              label="Nombre de la cabaña"
              value={formData.nombre}
              onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Descripción"
              value={formData.descripcion}
              onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
              fullWidth
              multiline
              rows={3}
              required
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <TextField
              label="Capacidad"
              type="number"
              value={formData.capacidad}
              onChange={(e) => setFormData(prev => ({ ...prev, capacidad: parseInt(e.target.value) }))}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <TextField
              label="Habitaciones"
              type="number"
              value={formData.habitaciones}
              onChange={(e) => setFormData(prev => ({ ...prev, habitaciones: parseInt(e.target.value) }))}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <TextField
              label="Baños"
              type="number"
              value={formData.baños}
              onChange={(e) => setFormData(prev => ({ ...prev, baños: parseInt(e.target.value) }))}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <TextField
              label="Precio por noche"
              type="number"
              value={formData.precio}
              onChange={(e) => setFormData(prev => ({ ...prev, precio: parseInt(e.target.value) }))}
              fullWidth
              required
              InputProps={{
                startAdornment: <InputAdornment position="start">L</InputAdornment>,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Estado</InputLabel>
              <Select
                value={formData.estado}
                label="Estado"
                onChange={(e) => setFormData(prev => ({ ...prev, estado: e.target.value }))}
              >
                <MenuItem value="disponible">Disponible</MenuItem>
                <MenuItem value="ocupada">Ocupada</MenuItem>
                <MenuItem value="mantenimiento">Mantenimiento</MenuItem>
                <MenuItem value="limpieza">Limpieza</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" sx={{ mb: 2 }}>
              Servicios
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {serviciosDisponibles.map((servicio) => (
                <Chip
                  key={servicio}
                  label={servicio}
                  clickable
                  color={formData.servicios.includes(servicio) ? 'primary' : 'default'}
                  variant={formData.servicios.includes(servicio) ? 'filled' : 'outlined'}
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      servicios: prev.servicios.includes(servicio)
                        ? prev.servicios.filter(s => s !== servicio)
                        : [...prev.servicios, servicio]
                    }));
                  }}
                />
              ))}
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={() => setEditDialogOpen(false)}>
          Cancelar
        </Button>
        <Button variant="contained" onClick={handleSaveCabin}>
          {selectedCabin ? 'Guardar Cambios' : 'Crear Cabaña'}
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <DashboardLayout title="Gestión de Cabañas">
      <Box>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Cabañas
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setSelectedCabin(null);
              resetFormData();
              setEditDialogOpen(true);
            }}
            sx={{ borderRadius: 2, textTransform: 'none' }}
          >
            Nueva Cabaña
          </Button>
        </Box>

        {/* Filtros y búsqueda */}
        <Card sx={{ mb: 3, borderRadius: 2 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <TextField
                placeholder="Buscar cabañas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ flexGrow: 1 }}
              />
              <Button
                variant="outlined"
                startIcon={<FilterIcon />}
                onClick={() => setFilterDrawerOpen(true)}
                sx={{ borderRadius: 2, textTransform: 'none' }}
              >
                Filtros
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Grid de cabañas */}
        {cabins.length === 0 ? (
          <Card sx={{ borderRadius: 2 }}>
            <EmptyState
              title="No hay cabañas"
              description="No se encontraron cabañas con los filtros aplicados"
              actionLabel="Nueva Cabaña"
              onAction={() => setEditDialogOpen(true)}
              size="large"
            />
          </Card>
        ) : (
          <Grid container spacing={3}>
            {cabins.map((cabin) => (
              <Grid item xs={12} sm={6} lg={4} key={cabin.id}>
                <CabinCard cabin={cabin} />
              </Grid>
            ))}
          </Grid>
        )}

        {/* Drawer de filtros */}
        <Drawer
          anchor="right"
          open={filterDrawerOpen}
          onClose={() => setFilterDrawerOpen(false)}
        >
          <FilterDrawerContent />
        </Drawer>

        {/* Menú de acciones */}
        <Menu
          anchorEl={actionMenuAnchor}
          open={Boolean(actionMenuAnchor)}
          onClose={handleActionMenuClose}
        >
          <MenuItem onClick={() => handleViewDetail(selectedActionCabin)}>
            <Visibility sx={{ mr: 1 }} />
            Ver detalles
          </MenuItem>
          <MenuItem onClick={() => handleEditCabin(selectedActionCabin)}>
            <Edit sx={{ mr: 1 }} />
            Editar
          </MenuItem>
          <MenuItem>
            <CalendarMonth sx={{ mr: 1 }} />
            Ver calendario
          </MenuItem>
          <MenuItem 
            onClick={() => handleDeleteCabin(selectedActionCabin)}
            sx={{ color: 'error.main' }}
          >
            <Delete sx={{ mr: 1 }} />
            Eliminar
          </MenuItem>
        </Menu>

        {/* Dialogs */}
        <CabinDetailDialog />
        <CabinFormDialog />
      </Box>
    </DashboardLayout>
  );
};

export default CabinsPage;
