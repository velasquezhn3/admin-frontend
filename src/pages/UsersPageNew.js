import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
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
  Avatar,
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
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
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
  Person,
  Email,
  Phone,
  CalendarMonth,
  Block,
  CheckCircle,
  AdminPanelSettings,
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import DashboardLayout from '../components/Layout/DashboardLayout';
import StatusChip from '../components/Common/StatusChip';
import EmptyState from '../components/Common/EmptyState';

// Datos de ejemplo
const usersData = [
  {
    id: 1,
    nombre: 'Juan Pérez',
    email: 'juan@email.com',
    telefono: '+54 9 11 1234-5678',
    rol: 'cliente',
    estado: 'activo',
    fechaRegistro: '2025-01-15',
    ultimaActividad: '2025-07-30',
    totalReservas: 5,
    gastoTotal: 250000,
    avatar: null,
  },
  {
    id: 2,
    nombre: 'María García',
    email: 'maria@email.com',
    telefono: '+54 9 11 2345-6789',
    rol: 'cliente',
    estado: 'activo',
    fechaRegistro: '2025-02-20',
    ultimaActividad: '2025-07-28',
    totalReservas: 3,
    gastoTotal: 180000,
    avatar: null,
  },
  {
    id: 3,
    nombre: 'Carlos López',
    email: 'carlos@email.com',
    telefono: '+54 9 11 3456-7890',
    rol: 'admin',
    estado: 'activo',
    fechaRegistro: '2024-12-01',
    ultimaActividad: '2025-08-01',
    totalReservas: 0,
    gastoTotal: 0,
    avatar: null,
  },
  {
    id: 4,
    nombre: 'Ana Ruiz',
    email: 'ana@email.com',
    telefono: '+54 9 11 4567-8901',
    rol: 'cliente',
    estado: 'inactivo',
    fechaRegistro: '2024-11-10',
    ultimaActividad: '2025-06-15',
    totalReservas: 1,
    gastoTotal: 45000,
    avatar: null,
  },
];

const reservasHistorial = [
  { id: 1, fecha: '2025-07-15', cabana: 'Cabaña Bosque', total: 120000, estado: 'completada' },
  { id: 2, fecha: '2025-06-10', cabana: 'Cabaña Lago', total: 80000, estado: 'completada' },
  { id: 3, fecha: '2025-05-20', cabana: 'Cabaña Vista', total: 95000, estado: 'completada' },
];

const UsersPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [users, setUsers] = useState(usersData);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [selectedActionUser, setSelectedActionUser] = useState(null);
  
  // Filtros
  const [filters, setFilters] = useState({
    rol: '',
    estado: '',
    actividad: '', // reciente, antigua, nunca
  });

  // Form data para edición/creación
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    rol: 'cliente',
    estado: 'activo',
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-HN', {
      style: 'currency',
      currency: 'HNL',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-HN');
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleActionMenuOpen = (event, user) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedActionUser(user);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedActionUser(null);
  };

  const handleViewDetail = (user) => {
    setSelectedUser(user);
    setDetailDialogOpen(true);
    handleActionMenuClose();
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setFormData({
      nombre: user.nombre,
      email: user.email,
      telefono: user.telefono,
      rol: user.rol,
      estado: user.estado,
    });
    setEditDialogOpen(true);
    handleActionMenuClose();
  };

  const handleDeleteUser = (user) => {
    // Implementar eliminación
    console.log('Eliminar usuario:', user);
    handleActionMenuClose();
  };

  const handleSaveUser = () => {
    if (selectedUser) {
      // Actualizar usuario existente
      setUsers(prev => prev.map(user => 
        user.id === selectedUser.id 
          ? { ...user, ...formData }
          : user
      ));
    } else {
      // Crear nuevo usuario
      const newUser = {
        id: Date.now(),
        ...formData,
        fechaRegistro: new Date().toISOString().split('T')[0],
        ultimaActividad: new Date().toISOString().split('T')[0],
        totalReservas: 0,
        gastoTotal: 0,
        avatar: null,
      };
      setUsers(prev => [...prev, newUser]);
    }
    
    setEditDialogOpen(false);
    setSelectedUser(null);
    setFormData({
      nombre: '',
      email: '',
      telefono: '',
      rol: 'cliente',
      estado: 'activo',
    });
  };

  const applyFilters = () => {
    let filtered = usersData;

    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.rol) {
      filtered = filtered.filter(user => user.rol === filters.rol);
    }

    if (filters.estado) {
      filtered = filtered.filter(user => user.estado === filters.estado);
    }

    setUsers(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [searchTerm, filters]);

  const columns = [
    {
      field: 'usuario',
      headerName: 'Usuario',
      width: 250,
      renderCell: (params) => (
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
            {getInitials(params.row.nombre)}
          </Avatar>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {params.row.nombre}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {params.row.email}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: 'telefono',
      headerName: 'Teléfono',
      width: 150,
    },
    {
      field: 'rol',
      headerName: 'Rol',
      width: 120,
      renderCell: (params) => (
        <StatusChip 
          status={params.value} 
          size="small"
          customColors={params.value === 'admin' ? {
            color: theme.palette.primary.main,
            bgcolor: theme.palette.primary.light + '20',
            label: 'Admin',
            icon: '👑'
          } : undefined}
        />
      ),
    },
    {
      field: 'estado',
      headerName: 'Estado',
      width: 120,
      renderCell: (params) => (
        <StatusChip status={params.value} size="small" />
      ),
    },
    {
      field: 'totalReservas',
      headerName: 'Reservas',
      width: 100,
      align: 'center',
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          size="small" 
          color="info" 
          variant="outlined"
        />
      ),
    },
    {
      field: 'gastoTotal',
      headerName: 'Gasto Total',
      width: 120,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {formatCurrency(params.value)}
        </Typography>
      ),
    },
    {
      field: 'ultimaActividad',
      headerName: 'Última Actividad',
      width: 150,
      renderCell: (params) => (
        <Typography variant="body2">
          {formatDate(params.value)}
        </Typography>
      ),
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <IconButton
          size="small"
          onClick={(e) => handleActionMenuOpen(e, params.row)}
        >
          <MoreVert />
        </IconButton>
      ),
    },
  ];

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
          <InputLabel>Rol</InputLabel>
          <Select
            value={filters.rol}
            label="Rol"
            onChange={(e) => setFilters(prev => ({ ...prev, rol: e.target.value }))}
          >
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="cliente">Cliente</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Estado</InputLabel>
          <Select
            value={filters.estado}
            label="Estado"
            onChange={(e) => setFilters(prev => ({ ...prev, estado: e.target.value }))}
          >
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="activo">Activo</MenuItem>
            <MenuItem value="inactivo">Inactivo</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Actividad</InputLabel>
          <Select
            value={filters.actividad}
            label="Actividad"
            onChange={(e) => setFilters(prev => ({ ...prev, actividad: e.target.value }))}
          >
            <MenuItem value="">Todas</MenuItem>
            <MenuItem value="reciente">Actividad reciente</MenuItem>
            <MenuItem value="antigua">Sin actividad reciente</MenuItem>
            <MenuItem value="nunca">Sin reservas</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => {
              setFilters({
                rol: '',
                estado: '',
                actividad: '',
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

  const UserDetailDialog = () => (
    <Dialog
      open={detailDialogOpen}
      onClose={() => setDetailDialogOpen(false)}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Perfil de Usuario
          </Typography>
          <IconButton onClick={() => setDetailDialogOpen(false)}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      {selectedUser && (
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 3, textAlign: 'center', bgcolor: 'grey.50' }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: 'primary.main',
                    fontSize: '1.5rem',
                    fontWeight: 600,
                    mx: 'auto',
                    mb: 2,
                  }}
                >
                  {getInitials(selectedUser.nombre)}
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                  {selectedUser.nombre}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 2 }}>
                  <StatusChip status={selectedUser.rol} size="small" />
                  <StatusChip status={selectedUser.estado} size="small" />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Miembro desde {formatDate(selectedUser.fechaRegistro)}
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} md={8}>
              <Card sx={{ p: 3, mb: 2, bgcolor: 'grey.50' }}>
                <Typography variant="subtitle2" color="primary" sx={{ mb: 2, fontWeight: 600 }}>
                  INFORMACIÓN DE CONTACTO
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Email sx={{ fontSize: 20, color: 'text.secondary' }} />
                    <Typography variant="body2">{selectedUser.email}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Phone sx={{ fontSize: 20, color: 'text.secondary' }} />
                    <Typography variant="body2">{selectedUser.telefono}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <CalendarMonth sx={{ fontSize: 20, color: 'text.secondary' }} />
                    <Typography variant="body2">
                      Última actividad: {formatDate(selectedUser.ultimaActividad)}
                    </Typography>
                  </Box>
                </Box>
              </Card>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Card sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                      {selectedUser.totalReservas}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Reservas
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={6}>
                  <Card sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                      {formatCurrency(selectedUser.gastoTotal)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Gasto Total
                    </Typography>
                  </Card>
                </Grid>
              </Grid>
            </Grid>

            {selectedUser.totalReservas > 0 && (
              <Grid item xs={12}>
                <Card sx={{ p: 3 }}>
                  <Typography variant="subtitle2" color="primary" sx={{ mb: 2, fontWeight: 600 }}>
                    HISTORIAL DE RESERVAS
                  </Typography>
                  <List>
                    {reservasHistorial.map((reserva) => (
                      <ListItem key={reserva.id} divider>
                        <ListItemText
                          primary={reserva.cabana}
                          secondary={formatDate(reserva.fecha)}
                        />
                        <ListItemSecondaryAction>
                          <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {formatCurrency(reserva.total)}
                            </Typography>
                            <StatusChip status={reserva.estado} size="small" />
                          </Box>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                </Card>
              </Grid>
            )}
          </Grid>
        </DialogContent>
      )}

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={() => setDetailDialogOpen(false)}>
          Cerrar
        </Button>
        <Button variant="outlined" startIcon={<Edit />} onClick={() => handleEditUser(selectedUser)}>
          Editar
        </Button>
        <Button variant="contained" startIcon={<Email />}>
          Enviar Email
        </Button>
      </DialogActions>
    </Dialog>
  );

  const UserFormDialog = () => (
    <Dialog
      open={editDialogOpen}
      onClose={() => setEditDialogOpen(false)}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        {selectedUser ? 'Editar Usuario' : 'Nuevo Usuario'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
          <TextField
            label="Nombre completo"
            value={formData.nombre}
            onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
            fullWidth
            required
          />
          <TextField
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            fullWidth
            required
          />
          <TextField
            label="Teléfono"
            value={formData.telefono}
            onChange={(e) => setFormData(prev => ({ ...prev, telefono: e.target.value }))}
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel>Rol</InputLabel>
            <Select
              value={formData.rol}
              label="Rol"
              onChange={(e) => setFormData(prev => ({ ...prev, rol: e.target.value }))}
            >
              <MenuItem value="cliente">Cliente</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
          <FormControlLabel
            control={
              <Switch
                checked={formData.estado === 'activo'}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  estado: e.target.checked ? 'activo' : 'inactivo' 
                }))}
              />
            }
            label="Usuario activo"
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={() => setEditDialogOpen(false)}>
          Cancelar
        </Button>
        <Button variant="contained" onClick={handleSaveUser}>
          {selectedUser ? 'Guardar Cambios' : 'Crear Usuario'}
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <DashboardLayout title="Gestión de Usuarios">
      <Box>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Usuarios
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setSelectedUser(null);
              setFormData({
                nombre: '',
                email: '',
                telefono: '',
                rol: 'cliente',
                estado: 'activo',
              });
              setEditDialogOpen(true);
            }}
            sx={{ borderRadius: 2, textTransform: 'none' }}
          >
            Nuevo Usuario
          </Button>
        </Box>

        {/* Filtros y búsqueda */}
        <Card sx={{ mb: 3, borderRadius: 2 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <TextField
                placeholder="Buscar por nombre o email..."
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

        {/* Tabla de usuarios */}
        <Card sx={{ borderRadius: 2 }}>
          <Box sx={{ height: 600 }}>
            {users.length === 0 ? (
              <EmptyState
                title="No hay usuarios"
                description="No se encontraron usuarios con los filtros aplicados"
                actionLabel="Nuevo Usuario"
                onAction={() => setEditDialogOpen(true)}
              />
            ) : (
              <DataGrid
                rows={users}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10, 25, 50]}
                loading={loading}
                disableSelectionOnClick
                sx={{
                  border: 'none',
                  '& .MuiDataGrid-columnHeaders': {
                    bgcolor: 'grey.50',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                  },
                  '& .MuiDataGrid-row:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
              />
            )}
          </Box>
        </Card>

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
          <MenuItem onClick={() => handleViewDetail(selectedActionUser)}>
            <Visibility sx={{ mr: 1 }} />
            Ver perfil
          </MenuItem>
          <MenuItem onClick={() => handleEditUser(selectedActionUser)}>
            <Edit sx={{ mr: 1 }} />
            Editar
          </MenuItem>
          <MenuItem>
            {selectedActionUser?.estado === 'activo' ? (
              <>
                <Block sx={{ mr: 1 }} />
                Desactivar
              </>
            ) : (
              <>
                <CheckCircle sx={{ mr: 1 }} />
                Activar
              </>
            )}
          </MenuItem>
          <MenuItem 
            onClick={() => handleDeleteUser(selectedActionUser)}
            sx={{ color: 'error.main' }}
          >
            <Delete sx={{ mr: 1 }} />
            Eliminar
          </MenuItem>
        </Menu>

        {/* Dialogs */}
        <UserDetailDialog />
        <UserFormDialog />
      </Box>
    </DashboardLayout>
  );
};

export default UsersPage;
