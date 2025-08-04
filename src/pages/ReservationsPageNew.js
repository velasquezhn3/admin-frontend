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
  Chip,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Tabs,
  Tab,
  Fade,
  Drawer,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Add as AddIcon,
  CalendarMonth as CalendarIcon,
  TableView as TableIcon,
  MoreVert,
  Edit,
  Delete,
  Visibility,
  Close,
  Event,
  Person,
  Home,
  AttachMoney,
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import DashboardLayout from '../components/Layout/DashboardLayout';
import StatusChip from '../components/Common/StatusChip';
import EmptyState from '../components/Common/EmptyState';

// Datos de ejemplo
const reservationsData = [
  {
    id: 1,
    codigo: 'RES-001',
    cliente: 'Juan Pérez',
    email: 'juan@email.com',
    telefono: '+54 9 11 1234-5678',
    cabana: 'Cabaña Bosque',
    fechaInicio: '2025-08-05',
    fechaFin: '2025-08-08',
    huespedes: 4,
    precioTotal: 120000,
    estado: 'confirmada',
    fechaCreacion: '2025-07-28',
    notas: 'Aniversario de bodas'
  },
  {
    id: 2,
    codigo: 'RES-002',
    cliente: 'María García',
    email: 'maria@email.com',
    telefono: '+54 9 11 2345-6789',
    cabana: 'Cabaña Lago',
    fechaInicio: '2025-08-10',
    fechaFin: '2025-08-12',
    huespedes: 2,
    precioTotal: 80000,
    estado: 'pendiente',
    fechaCreacion: '2025-07-30',
    notas: ''
  },
  {
    id: 3,
    codigo: 'RES-003',
    cliente: 'Carlos López',
    email: 'carlos@email.com',
    telefono: '+54 9 11 3456-7890',
    cabana: 'Cabaña Vista',
    fechaInicio: '2025-08-01',
    fechaFin: '2025-08-01',
    huespedes: 6,
    precioTotal: 45000,
    estado: 'cancelada',
    fechaCreacion: '2025-07-25',
    notas: 'Cancelada por el cliente'
  },
];

const ReservationsPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [view, setView] = useState('table'); // table, calendar
  const [reservations, setReservations] = useState(reservationsData);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [selectedActionReservation, setSelectedActionReservation] = useState(null);
  
  // Filtros
  const [filters, setFilters] = useState({
    estado: '',
    cabana: '',
    fechaInicio: null,
    fechaFin: null,
    huespedes: '',
  });

  const estadoOptions = ['confirmada', 'pendiente', 'cancelada', 'check-in', 'check-out'];
  const cabanaOptions = ['Cabaña Bosque', 'Cabaña Lago', 'Cabaña Vista', 'Cabaña Pino'];

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

  const handleActionMenuOpen = (event, reservation) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedActionReservation(reservation);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedActionReservation(null);
  };

  const handleViewDetail = (reservation) => {
    setSelectedReservation(reservation);
    setDetailDialogOpen(true);
    handleActionMenuClose();
  };

  const handleEditReservation = (reservation) => {
    // Implementar edición
    console.log('Editar reserva:', reservation);
    handleActionMenuClose();
  };

  const handleDeleteReservation = (reservation) => {
    // Implementar eliminación
    console.log('Eliminar reserva:', reservation);
    handleActionMenuClose();
  };

  const applyFilters = () => {
    let filtered = reservationsData;

    if (searchTerm) {
      filtered = filtered.filter(res => 
        res.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.estado) {
      filtered = filtered.filter(res => res.estado === filters.estado);
    }

    if (filters.cabana) {
      filtered = filtered.filter(res => res.cabana === filters.cabana);
    }

    setReservations(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [searchTerm, filters]);

  const columns = [
    {
      field: 'codigo',
      headerName: 'Código',
      width: 120,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'cliente',
      headerName: 'Cliente',
      width: 200,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {params.value}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {params.row.email}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'cabana',
      headerName: 'Cabaña',
      width: 150,
    },
    {
      field: 'fechas',
      headerName: 'Fechas',
      width: 200,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2">
            {formatDate(params.row.fechaInicio)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            hasta {formatDate(params.row.fechaFin)}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'huespedes',
      headerName: 'Huéspedes',
      width: 100,
      align: 'center',
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          size="small" 
          color="primary" 
          variant="outlined"
        />
      ),
    },
    {
      field: 'precioTotal',
      headerName: 'Total',
      width: 120,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {formatCurrency(params.value)}
        </Typography>
      ),
    },
    {
      field: 'estado',
      headerName: 'Estado',
      width: 130,
      renderCell: (params) => (
        <StatusChip status={params.value} size="small" />
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
        <TextField
          select
          label="Estado"
          value={filters.estado}
          onChange={(e) => setFilters(prev => ({ ...prev, estado: e.target.value }))}
          fullWidth
        >
          <MenuItem value="">Todos</MenuItem>
          {estadoOptions.map((estado) => (
            <MenuItem key={estado} value={estado}>
              <StatusChip status={estado} size="small" />
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Cabaña"
          value={filters.cabana}
          onChange={(e) => setFilters(prev => ({ ...prev, cabana: e.target.value }))}
          fullWidth
        >
          <MenuItem value="">Todas</MenuItem>
          {cabanaOptions.map((cabana) => (
            <MenuItem key={cabana} value={cabana}>
              {cabana}
            </MenuItem>
          ))}
        </TextField>

        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
          <DatePicker
            label="Fecha desde"
            value={filters.fechaInicio}
            onChange={(date) => setFilters(prev => ({ ...prev, fechaInicio: date }))}
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
          
          <DatePicker
            label="Fecha hasta"
            value={filters.fechaFin}
            onChange={(date) => setFilters(prev => ({ ...prev, fechaFin: date }))}
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
        </LocalizationProvider>

        <TextField
          type="number"
          label="Número de huéspedes"
          value={filters.huespedes}
          onChange={(e) => setFilters(prev => ({ ...prev, huespedes: e.target.value }))}
          fullWidth
        />

        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => {
              setFilters({
                estado: '',
                cabana: '',
                fechaInicio: null,
                fechaFin: null,
                huespedes: '',
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

  const ReservationDetailDialog = () => (
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
            Detalle de Reserva
          </Typography>
          <IconButton onClick={() => setDetailDialogOpen(false)}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      {selectedReservation && (
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Typography variant="subtitle2" color="primary" sx={{ mb: 1, fontWeight: 600 }}>
                  INFORMACIÓN DE LA RESERVA
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Event sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2">
                      <strong>Código:</strong> {selectedReservation.codigo}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Home sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2">
                      <strong>Cabaña:</strong> {selectedReservation.cabana}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Person sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2">
                      <strong>Huéspedes:</strong> {selectedReservation.huespedes}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AttachMoney sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2">
                      <strong>Total:</strong> {formatCurrency(selectedReservation.precioTotal)}
                    </Typography>
                  </Box>
                  <Box sx={{ mt: 1 }}>
                    <StatusChip status={selectedReservation.estado} />
                  </Box>
                </Box>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Typography variant="subtitle2" color="primary" sx={{ mb: 1, fontWeight: 600 }}>
                  INFORMACIÓN DEL CLIENTE
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="body2">
                    <strong>Nombre:</strong> {selectedReservation.cliente}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Email:</strong> {selectedReservation.email}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Teléfono:</strong> {selectedReservation.telefono}
                  </Typography>
                </Box>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Typography variant="subtitle2" color="primary" sx={{ mb: 1, fontWeight: 600 }}>
                  FECHAS Y NOTAS
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="body2">
                    <strong>Check-in:</strong> {formatDate(selectedReservation.fechaInicio)}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Check-out:</strong> {formatDate(selectedReservation.fechaFin)}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Fecha de creación:</strong> {formatDate(selectedReservation.fechaCreacion)}
                  </Typography>
                  {selectedReservation.notas && (
                    <Typography variant="body2">
                      <strong>Notas:</strong> {selectedReservation.notas}
                    </Typography>
                  )}
                </Box>
              </Card>
            </Grid>
          </Grid>
        </DialogContent>
      )}

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={() => setDetailDialogOpen(false)}>
          Cerrar
        </Button>
        <Button variant="outlined" startIcon={<Edit />}>
          Editar
        </Button>
        <Button variant="contained" startIcon={<Event />}>
          Check-in/out
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <DashboardLayout title="Gestión de Reservas">
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
        <Box>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Reservas
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{ borderRadius: 2, textTransform: 'none' }}
            >
              Nueva Reserva
            </Button>
          </Box>

          {/* Filtros y búsqueda */}
          <Card sx={{ mb: 3, borderRadius: 2 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
                <TextField
                  placeholder="Buscar por cliente, código o email..."
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

              {/* Tabs para cambiar vista */}
              <Tabs
                value={view}
                onChange={(e, newValue) => setView(newValue)}
                sx={{ borderBottom: 1, borderColor: 'divider' }}
              >
                <Tab
                  icon={<TableIcon />}
                  label="Tabla"
                  value="table"
                  iconPosition="start"
                  sx={{ textTransform: 'none', minHeight: 48 }}
                />
                <Tab
                  icon={<CalendarIcon />}
                  label="Calendario"
                  value="calendar"
                  iconPosition="start"
                  sx={{ textTransform: 'none', minHeight: 48 }}
                />
              </Tabs>
            </CardContent>
          </Card>

          {/* Contenido principal */}
          <Card sx={{ borderRadius: 2 }}>
            {view === 'table' ? (
              <Box sx={{ height: 600 }}>
                {reservations.length === 0 ? (
                  <EmptyState
                    title="No hay reservas"
                    description="No se encontraron reservas con los filtros aplicados"
                    actionLabel="Nueva Reserva"
                    onAction={() => console.log('Nueva reserva')}
                  />
                ) : (
                  <DataGrid
                    rows={reservations}
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
            ) : (
              <Box sx={{ p: 3, height: 600 }}>
                <EmptyState
                  icon={CalendarIcon}
                  title="Vista calendario próximamente"
                  description="La vista de calendario estará disponible en la próxima versión"
                  size="large"
                />
              </Box>
            )}
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
            <MenuItem onClick={() => handleViewDetail(selectedActionReservation)}>
              <Visibility sx={{ mr: 1 }} />
              Ver detalles
            </MenuItem>
            <MenuItem onClick={() => handleEditReservation(selectedActionReservation)}>
              <Edit sx={{ mr: 1 }} />
              Editar
            </MenuItem>
            <MenuItem 
              onClick={() => handleDeleteReservation(selectedActionReservation)}
              sx={{ color: 'error.main' }}
            >
              <Delete sx={{ mr: 1 }} />
              Eliminar
            </MenuItem>
          </Menu>

          {/* Dialog de detalles */}
          <ReservationDetailDialog />
        </Box>
      </LocalizationProvider>
    </DashboardLayout>
  );
};

export default ReservationsPage;
