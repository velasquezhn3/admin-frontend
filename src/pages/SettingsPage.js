import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Tabs,
  Tab,
  Avatar,
  Chip,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Payment as PaymentIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Save as SaveIcon,
  PhotoCamera as PhotoCameraIcon,
} from '@mui/icons-material';
import DashboardLayout from '../components/Layout/DashboardLayout';

const SettingsPage = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [settings, setSettings] = useState({
    // Configuración general
    siteName: 'Villas Julie',
    siteDescription: 'Complejo de cabañas en el corazón de la naturaleza',
    timezone: 'America/Argentina/Buenos_Aires',
    currency: 'ARS',
    language: 'es',
    
    // Notificaciones
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    reservationAlerts: true,
    checkInReminders: true,
    
    // Reservas
    autoConfirmReservations: false,
    minimumStay: 1,
    maximumStay: 30,
    advanceBookingDays: 365,
    cancellationPolicy: 'flexible',
    
    // Pagos
    acceptCash: true,
    acceptTransfer: true,
    acceptCards: false,
    depositPercentage: 50,
  });

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedSetting, setSelectedSetting] = useState(null);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = () => {
    // Aquí guardarías la configuración en la API
    console.log('Guardando configuración:', settings);
  };

  const TabPanel = ({ children, value, index, ...other }) => (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );

  return (
    <DashboardLayout title="Configuración del Sistema">
      <Box>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Configuración
          </Typography>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSaveSettings}
            sx={{ borderRadius: 2, textTransform: 'none' }}
          >
            Guardar Cambios
          </Button>
        </Box>

        <Card sx={{ borderRadius: 2 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={currentTab}
              onChange={(e, newValue) => setCurrentTab(newValue)}
              aria-label="settings tabs"
            >
              <Tab icon={<SettingsIcon />} label="General" iconPosition="start" />
              <Tab icon={<NotificationsIcon />} label="Notificaciones" iconPosition="start" />
              <Tab icon={<PaymentIcon />} label="Reservas y Pagos" iconPosition="start" />
              <Tab icon={<SecurityIcon />} label="Seguridad" iconPosition="start" />
            </Tabs>
          </Box>

          {/* Panel 1: Configuración General */}
          <TabPanel value={currentTab} index={0}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 3, bgcolor: 'grey.50' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                    Información del Sitio
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <TextField
                      label="Nombre del sitio"
                      value={settings.siteName}
                      onChange={(e) => handleSettingChange('siteName', e.target.value)}
                      fullWidth
                    />
                    <TextField
                      label="Descripción"
                      value={settings.siteDescription}
                      onChange={(e) => handleSettingChange('siteDescription', e.target.value)}
                      fullWidth
                      multiline
                      rows={3}
                    />
                    <FormControl fullWidth>
                      <InputLabel>Zona horaria</InputLabel>
                      <Select
                        value={settings.timezone}
                        label="Zona horaria"
                        onChange={(e) => handleSettingChange('timezone', e.target.value)}
                      >
                        <MenuItem value="America/Argentina/Buenos_Aires">Buenos Aires (GMT-3)</MenuItem>
                        <MenuItem value="America/New_York">Nueva York (GMT-5)</MenuItem>
                        <MenuItem value="Europe/Madrid">Madrid (GMT+1)</MenuItem>
                      </Select>
                    </FormControl>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <FormControl fullWidth>
                          <InputLabel>Moneda</InputLabel>
                          <Select
                            value={settings.currency}
                            label="Moneda"
                            onChange={(e) => handleSettingChange('currency', e.target.value)}
                          >
                            <MenuItem value="ARS">Peso Argentino (ARS)</MenuItem>
                            <MenuItem value="USD">Dólar (USD)</MenuItem>
                            <MenuItem value="EUR">Euro (EUR)</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={6}>
                        <FormControl fullWidth>
                          <InputLabel>Idioma</InputLabel>
                          <Select
                            value={settings.language}
                            label="Idioma"
                            onChange={(e) => handleSettingChange('language', e.target.value)}
                          >
                            <MenuItem value="es">Español</MenuItem>
                            <MenuItem value="en">English</MenuItem>
                            <MenuItem value="pt">Português</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Box>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card sx={{ p: 3, bgcolor: 'grey.50' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                    Configuración de Usuario
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                    <Avatar
                      sx={{
                        width: 100,
                        height: 100,
                        bgcolor: 'primary.main',
                        fontSize: '2rem',
                        fontWeight: 600,
                      }}
                    >
                      VJ
                    </Avatar>
                    <Button
                      variant="outlined"
                      startIcon={<PhotoCameraIcon />}
                      sx={{ borderRadius: 2, textTransform: 'none' }}
                    >
                      Cambiar Logo
                    </Button>
                    <Box sx={{ width: '100%' }}>
                      <TextField
                        label="Email de administrador"
                        value="admin@villasjulie.com"
                        fullWidth
                        sx={{ mb: 2 }}
                      />
                      <TextField
                        label="Teléfono de contacto"
                        value="+54 9 11 1234-5678"
                        fullWidth
                      />
                    </Box>
                  </Box>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Panel 2: Notificaciones */}
          <TabPanel value={currentTab} index={1}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 3, bgcolor: 'grey.50' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                    Canales de Notificación
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemText
                        primary="Notificaciones por Email"
                        secondary="Recibir alertas importantes por correo electrónico"
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          checked={settings.emailNotifications}
                          onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Notificaciones SMS"
                        secondary="Recibir alertas urgentes por mensaje de texto"
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          checked={settings.smsNotifications}
                          onChange={(e) => handleSettingChange('smsNotifications', e.target.checked)}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Notificaciones Push"
                        secondary="Recibir notificaciones en el navegador"
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          checked={settings.pushNotifications}
                          onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                  </List>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card sx={{ p: 3, bgcolor: 'grey.50' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                    Tipos de Alertas
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemText
                        primary="Alertas de Reserva"
                        secondary="Notificar cuando hay nuevas reservas"
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          checked={settings.reservationAlerts}
                          onChange={(e) => handleSettingChange('reservationAlerts', e.target.checked)}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Recordatorios de Check-in"
                        secondary="Recordar check-ins programados para hoy"
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          checked={settings.checkInReminders}
                          onChange={(e) => handleSettingChange('checkInReminders', e.target.checked)}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                  </List>
                </Card>
              </Grid>
            </Grid>

            <Alert severity="info" sx={{ mt: 3 }}>
              Las notificaciones ayudan a mantener el control del negocio. Puedes personalizar qué tipos de eventos quieres recibir.
            </Alert>
          </TabPanel>

          {/* Panel 3: Reservas y Pagos */}
          <TabPanel value={currentTab} index={2}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 3, bgcolor: 'grey.50' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                    Configuración de Reservas
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.autoConfirmReservations}
                          onChange={(e) => handleSettingChange('autoConfirmReservations', e.target.checked)}
                        />
                      }
                      label="Confirmar reservas automáticamente"
                    />
                    
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <TextField
                          label="Estadía mínima (días)"
                          type="number"
                          value={settings.minimumStay}
                          onChange={(e) => handleSettingChange('minimumStay', parseInt(e.target.value))}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          label="Estadía máxima (días)"
                          type="number"
                          value={settings.maximumStay}
                          onChange={(e) => handleSettingChange('maximumStay', parseInt(e.target.value))}
                          fullWidth
                        />
                      </Grid>
                    </Grid>

                    <TextField
                      label="Días de anticipación máxima"
                      type="number"
                      value={settings.advanceBookingDays}
                      onChange={(e) => handleSettingChange('advanceBookingDays', parseInt(e.target.value))}
                      fullWidth
                      helperText="Máximo de días que se puede reservar con anticipación"
                    />

                    <FormControl fullWidth>
                      <InputLabel>Política de cancelación</InputLabel>
                      <Select
                        value={settings.cancellationPolicy}
                        label="Política de cancelación"
                        onChange={(e) => handleSettingChange('cancellationPolicy', e.target.value)}
                      >
                        <MenuItem value="flexible">Flexible (24h antes)</MenuItem>
                        <MenuItem value="moderate">Moderada (5 días antes)</MenuItem>
                        <MenuItem value="strict">Estricta (14 días antes)</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card sx={{ p: 3, bgcolor: 'grey.50' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                    Métodos de Pago
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemText
                        primary="Efectivo"
                        secondary="Aceptar pagos en efectivo"
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          checked={settings.acceptCash}
                          onChange={(e) => handleSettingChange('acceptCash', e.target.checked)}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Transferencia Bancaria"
                        secondary="Aceptar transferencias bancarias"
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          checked={settings.acceptTransfer}
                          onChange={(e) => handleSettingChange('acceptTransfer', e.target.checked)}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Tarjetas de Crédito"
                        secondary="Aceptar pagos con tarjeta"
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          checked={settings.acceptCards}
                          onChange={(e) => handleSettingChange('acceptCards', e.target.checked)}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                  </List>

                  <Divider sx={{ my: 2 }} />

                  <TextField
                    label="Porcentaje de seña (%)"
                    type="number"
                    value={settings.depositPercentage}
                    onChange={(e) => handleSettingChange('depositPercentage', parseInt(e.target.value))}
                    fullWidth
                    inputProps={{ min: 0, max: 100 }}
                    helperText="Porcentaje requerido como seña al reservar"
                  />
                </Card>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Panel 4: Seguridad */}
          <TabPanel value={currentTab} index={3}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 3, bgcolor: 'grey.50' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                    Seguridad de Cuenta
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Button
                      variant="outlined"
                      fullWidth
                      sx={{ borderRadius: 2, textTransform: 'none' }}
                    >
                      Cambiar Contraseña
                    </Button>
                    <Button
                      variant="outlined"
                      fullWidth
                      sx={{ borderRadius: 2, textTransform: 'none' }}
                    >
                      Configurar Autenticación de Dos Factores
                    </Button>
                    <Button
                      variant="outlined"
                      fullWidth
                      sx={{ borderRadius: 2, textTransform: 'none' }}
                    >
                      Ver Sesiones Activas
                    </Button>
                  </Box>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card sx={{ p: 3, bgcolor: 'grey.50' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                    Respaldo de Datos
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          Último respaldo
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          31 de Julio, 2025 - 3:00 AM
                        </Typography>
                      </Box>
                      <Chip label="Exitoso" color="success" size="small" />
                    </Box>
                    
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{ borderRadius: 2, textTransform: 'none' }}
                    >
                      Crear Respaldo Manual
                    </Button>
                    
                    <FormControlLabel
                      control={<Switch defaultChecked />}
                      label="Respaldos automáticos diarios"
                    />
                  </Box>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Alert severity="warning">
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Zona de Peligro
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Las siguientes acciones son permanentes y no se pueden deshacer.
                  </Typography>
                  <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                    <Button
                      variant="outlined"
                      color="error"
                      sx={{ borderRadius: 2, textTransform: 'none' }}
                    >
                      Resetear Configuración
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      sx={{ borderRadius: 2, textTransform: 'none' }}
                    >
                      Exportar Todos los Datos
                    </Button>
                  </Box>
                </Alert>
              </Grid>
            </Grid>
          </TabPanel>
        </Card>
      </Box>
    </DashboardLayout>
  );
};

export default SettingsPage;
