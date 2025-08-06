import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Alert,
  AlertTitle,
  Collapse,
  IconButton,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button
} from '@mui/material';
import {
  ExpandMore,
  ExpandLess,
  Warning,
  Error as ErrorIcon,
  Info,
  CheckCircle,
  Close,
  Refresh
} from '@mui/icons-material';

const SystemAlertsPanel = ({ alerts = [], systemStatus, onRefresh, onDismissAlert }) => {
  const [expanded, setExpanded] = useState(true);
  
  // Clasificar alertas por severidad
  const criticalAlerts = alerts.filter(alert => alert.severity === 'critical');
  const warningAlerts = alerts.filter(alert => alert.severity === 'warning');
  const infoAlerts = alerts.filter(alert => alert.severity === 'info');

  // Obtener color de estado del sistema
  const getSystemStatusColor = () => {
    if (criticalAlerts.length > 0) return 'error';
    if (warningAlerts.length > 0) return 'warning';
    return 'success';
  };

  // Obtener icono de alerta
  const getAlertIcon = (severity) => {
    switch (severity) {
      case 'critical': return <ErrorIcon />;
      case 'warning': return <Warning />;
      case 'info': return <Info />;
      default: return <Info />;
    }
  };

  // Si no hay alertas y el sistema está bien
  if (alerts.length === 0 && systemStatus?.status === 'operational') {
    return (
      <Paper 
        sx={{ 
          p: 2, 
          mb: 3, 
          borderRadius: 2, 
          bgcolor: 'success.50', 
          border: '1px solid', 
          borderColor: 'success.200' 
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <CheckCircle color="success" />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              <strong>✅ Sistema Operacional</strong>
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Todos los servicios funcionando correctamente
            </Typography>
          </Box>
          <Button
            size="small"
            startIcon={<Refresh />}
            onClick={onRefresh}
            sx={{ textTransform: 'none' }}
          >
            Verificar
          </Button>
        </Box>
      </Paper>
    );
  }

  return (
    <Box sx={{ mb: 3 }}>
      {/* Estado General del Sistema */}
      <Alert 
        severity={getSystemStatusColor()} 
        sx={{ borderRadius: 2, mb: 2 }}
        action={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              label={`${alerts.length} alerta${alerts.length !== 1 ? 's' : ''}`}
              size="small"
              color={getSystemStatusColor()}
              variant="outlined"
            />
            <IconButton
              size="small"
              onClick={() => setExpanded(!expanded)}
              sx={{ color: 'inherit' }}
            >
              {expanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>
        }
      >
        <AlertTitle>
          {criticalAlerts.length > 0 ? '🚨 Sistema Crítico' : 
           warningAlerts.length > 0 ? '⚠️ Advertencias del Sistema' : 
           '📢 Información del Sistema'}
        </AlertTitle>
        {criticalAlerts.length > 0 && (
          <Typography variant="body2">
            Se detectaron {criticalAlerts.length} problema{criticalAlerts.length !== 1 ? 's' : ''} crítico{criticalAlerts.length !== 1 ? 's' : ''} que requiere{criticalAlerts.length === 1 ? '' : 'n'} atención inmediata.
          </Typography>
        )}
        {criticalAlerts.length === 0 && warningAlerts.length > 0 && (
          <Typography variant="body2">
            {warningAlerts.length} advertencia{warningAlerts.length !== 1 ? 's' : ''} detectada{warningAlerts.length !== 1 ? 's' : ''}.
          </Typography>
        )}
        {criticalAlerts.length === 0 && warningAlerts.length === 0 && infoAlerts.length > 0 && (
          <Typography variant="body2">
            {infoAlerts.length} notificación{infoAlerts.length !== 1 ? 'es' : ''} informativa{infoAlerts.length !== 1 ? 's' : ''}.
          </Typography>
        )}
      </Alert>

      {/* Lista Detallada de Alertas */}
      <Collapse in={expanded}>
        <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <List sx={{ p: 0 }}>
            {/* Alertas Críticas */}
            {criticalAlerts.map((alert, index) => (
              <ListItem
                key={`critical-${index}`}
                sx={{ 
                  bgcolor: 'error.50',
                  borderLeft: '4px solid',
                  borderLeftColor: 'error.main'
                }}
                secondaryAction={
                  onDismissAlert && (
                    <IconButton 
                      edge="end" 
                      size="small"
                      onClick={() => onDismissAlert(alert)}
                    >
                      <Close />
                    </IconButton>
                  )
                }
              >
                <ListItemIcon>
                  <ErrorIcon color="error" />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {alert.title || alert.message}
                    </Typography>
                  }
                  secondary={
                    <Box>
                      {alert.description && (
                        <Typography variant="caption" color="text.secondary">
                          {alert.description}
                        </Typography>
                      )}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <Chip 
                          label="CRÍTICO" 
                          size="small" 
                          color="error" 
                          variant="filled"
                          sx={{ fontSize: '0.65rem', height: 18 }}
                        />
                        {alert.timestamp && (
                          <Typography variant="caption" color="text.secondary">
                            {new Date(alert.timestamp).toLocaleTimeString()}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  }
                />
              </ListItem>
            ))}

            {/* Alertas de Advertencia */}
            {warningAlerts.map((alert, index) => (
              <ListItem
                key={`warning-${index}`}
                sx={{ 
                  bgcolor: 'warning.50',
                  borderLeft: '4px solid',
                  borderLeftColor: 'warning.main'
                }}
                secondaryAction={
                  onDismissAlert && (
                    <IconButton 
                      edge="end" 
                      size="small"
                      onClick={() => onDismissAlert(alert)}
                    >
                      <Close />
                    </IconButton>
                  )
                }
              >
                <ListItemIcon>
                  <Warning color="warning" />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {alert.title || alert.message}
                    </Typography>
                  }
                  secondary={
                    <Box>
                      {alert.description && (
                        <Typography variant="caption" color="text.secondary">
                          {alert.description}
                        </Typography>
                      )}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <Chip 
                          label="ADVERTENCIA" 
                          size="small" 
                          color="warning" 
                          variant="outlined"
                          sx={{ fontSize: '0.65rem', height: 18 }}
                        />
                        {alert.timestamp && (
                          <Typography variant="caption" color="text.secondary">
                            {new Date(alert.timestamp).toLocaleTimeString()}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  }
                />
              </ListItem>
            ))}

            {/* Alertas Informativas */}
            {infoAlerts.map((alert, index) => (
              <ListItem
                key={`info-${index}`}
                sx={{ 
                  bgcolor: 'info.50',
                  borderLeft: '4px solid',
                  borderLeftColor: 'info.main'
                }}
                secondaryAction={
                  onDismissAlert && (
                    <IconButton 
                      edge="end" 
                      size="small"
                      onClick={() => onDismissAlert(alert)}
                    >
                      <Close />
                    </IconButton>
                  )
                }
              >
                <ListItemIcon>
                  <Info color="info" />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body2">
                      {alert.title || alert.message}
                    </Typography>
                  }
                  secondary={
                    <Box>
                      {alert.description && (
                        <Typography variant="caption" color="text.secondary">
                          {alert.description}
                        </Typography>
                      )}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <Chip 
                          label="INFO" 
                          size="small" 
                          color="info" 
                          variant="outlined"
                          sx={{ fontSize: '0.65rem', height: 18 }}
                        />
                        {alert.timestamp && (
                          <Typography variant="caption" color="text.secondary">
                            {new Date(alert.timestamp).toLocaleTimeString()}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Collapse>
    </Box>
  );
};

export default SystemAlertsPanel;
