import React from 'react';
import {
  Box,
  Chip,
  Typography,
  useTheme,
} from '@mui/material';

const StatusChip = ({
  status,
  variant = 'filled', // filled, outlined
  size = 'medium',
  customColors,
}) => {
  const theme = useTheme();

  const getStatusConfig = (status) => {
    const configs = {
      // Reservas
      'confirmada': {
        color: theme.palette.success.main,
        bgcolor: theme.palette.success.light + '20',
        label: 'Confirmada',
        icon: '✓'
      },
      'pendiente': {
        color: theme.palette.warning.main,
        bgcolor: theme.palette.warning.light + '20',
        label: 'Pendiente',
        icon: '⏳'
      },
      'cancelada': {
        color: theme.palette.error.main,
        bgcolor: theme.palette.error.light + '20',
        label: 'Cancelada',
        icon: '✕'
      },
      'check-in': {
        color: theme.palette.info.main,
        bgcolor: theme.palette.info.light + '20',
        label: 'Check-in',
        icon: '🏠'
      },
      'check-out': {
        color: theme.palette.grey[600],
        bgcolor: theme.palette.grey[100],
        label: 'Check-out',
        icon: '👋'
      },

      // Usuarios
      'activo': {
        color: theme.palette.success.main,
        bgcolor: theme.palette.success.light + '20',
        label: 'Activo',
        icon: '●'
      },
      'inactivo': {
        color: theme.palette.grey[500],
        bgcolor: theme.palette.grey[100],
        label: 'Inactivo',
        icon: '○'
      },
      'admin': {
        color: theme.palette.primary.main,
        bgcolor: theme.palette.primary.light + '20',
        label: 'Admin',
        icon: '👑'
      },
      'cliente': {
        color: theme.palette.info.main,
        bgcolor: theme.palette.info.light + '20',
        label: 'Cliente',
        icon: '👤'
      },

      // Cabañas
      'disponible': {
        color: theme.palette.success.main,
        bgcolor: theme.palette.success.light + '20',
        label: 'Disponible',
        icon: '✓'
      },
      'ocupada': {
        color: theme.palette.error.main,
        bgcolor: theme.palette.error.light + '20',
        label: 'Ocupada',
        icon: '🏠'
      },
      'mantenimiento': {
        color: theme.palette.warning.main,
        bgcolor: theme.palette.warning.light + '20',
        label: 'Mantenimiento',
        icon: '🔧'
      },
      'limpieza': {
        color: theme.palette.info.main,
        bgcolor: theme.palette.info.light + '20',
        label: 'Limpieza',
        icon: '🧹'
      },

      // Estados generales
      'alta': {
        color: theme.palette.error.main,
        bgcolor: theme.palette.error.light + '20',
        label: 'Alta',
        icon: '▲'
      },
      'media': {
        color: theme.palette.warning.main,
        bgcolor: theme.palette.warning.light + '20',
        label: 'Media',
        icon: '●'
      },
      'baja': {
        color: theme.palette.success.main,
        bgcolor: theme.palette.success.light + '20',
        label: 'Baja',
        icon: '▼'
      },
    };

    return customColors || configs[status?.toLowerCase()] || {
      color: theme.palette.grey[600],
      bgcolor: theme.palette.grey[100],
      label: status || 'Desconocido',
      icon: '?'
    };
  };

  const config = getStatusConfig(status);

  return (
    <Chip
      label={
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Typography component="span" sx={{ fontSize: '0.75rem' }}>
            {config.icon}
          </Typography>
          <Typography component="span" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
            {config.label}
          </Typography>
        </Box>
      }
      size={size}
      variant={variant}
      sx={{
        bgcolor: variant === 'filled' ? config.bgcolor : 'transparent',
        color: config.color,
        border: variant === 'outlined' ? `1px solid ${config.color}` : 'none',
        fontWeight: 500,
        '& .MuiChip-label': {
          px: 1.5,
          py: 0.5,
        },
        borderRadius: 1.5,
        height: size === 'small' ? 24 : 28,
      }}
    />
  );
};

export default StatusChip;
