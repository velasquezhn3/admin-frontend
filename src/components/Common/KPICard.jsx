import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  LinearProgress,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Info,
  Warning,
  CheckCircle,
  Error as ErrorIcon
} from '@mui/icons-material';

const KPICard = ({ 
  title, 
  value, 
  target, 
  unit = '', 
  format = 'number',
  trend, 
  status = 'normal',
  description,
  color = 'primary',
  size = 'medium' 
}) => {
  
  // Calcular progreso hacia el objetivo
  const progress = target ? Math.min((value / target) * 100, 100) : 0;
  
  // Formatear valor
  const formatValue = (val) => {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('es-HN', {
          style: 'currency',
          currency: 'HNL',
          minimumFractionDigits: 0
        }).format(val);
      case 'percentage':
        return `${val.toFixed(1)}%`;
      case 'number':
        return val.toLocaleString();
      default:
        return val;
    }
  };

  // Obtener color del estado
  const getStatusColor = () => {
    switch (status) {
      case 'excellent': return 'success';
      case 'good': return 'info';
      case 'warning': return 'warning';
      case 'critical': return 'error';
      default: return color;
    }
  };

  // Obtener icono del estado
  const getStatusIcon = () => {
    switch (status) {
      case 'excellent': return <CheckCircle fontSize="small" />;
      case 'warning': return <Warning fontSize="small" />;
      case 'critical': return <ErrorIcon fontSize="small" />;
      default: return null;
    }
  };

  return (
    <Card 
      sx={{ 
        height: size === 'small' ? 140 : 180,
        borderRadius: 3,
        border: '1px solid',
        borderColor: `${getStatusColor()}.200`,
        background: `linear-gradient(135deg, ${getStatusColor()}.50 0%, white 100%)`,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 3
        }
      }}
    >
      <CardContent sx={{ p: 3, height: '100%' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Typography 
              variant={size === 'small' ? 'body2' : 'subtitle2'} 
              color="text.secondary"
              sx={{ fontWeight: 500 }}
            >
              {title}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {status !== 'normal' && (
                <Chip
                  icon={getStatusIcon()}
                  label={status}
                  size="small"
                  color={getStatusColor()}
                  variant="outlined"
                  sx={{ fontSize: '0.7rem', height: 20 }}
                />
              )}
              
              {description && (
                <Tooltip title={description} arrow>
                  <IconButton size="small" sx={{ color: 'text.secondary' }}>
                    <Info fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </Box>

          {/* Valor Principal */}
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <Typography 
              variant={size === 'small' ? 'h5' : 'h4'}
              sx={{ 
                fontWeight: 700,
                color: `${getStatusColor()}.700`,
                lineHeight: 1
              }}
            >
              {formatValue(value)}{unit}
            </Typography>
          </Box>

          {/* Progreso y Tendencia */}
          <Box sx={{ mt: 'auto' }}>
            {/* Barra de progreso hacia objetivo */}
            {target && (
              <Box sx={{ mb: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption" color="text.secondary">
                    Progreso
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {progress.toFixed(0)}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    bgcolor: `${getStatusColor()}.100`,
                    '& .MuiLinearProgress-bar': {
                      bgcolor: `${getStatusColor()}.500`,
                      borderRadius: 3
                    }
                  }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                  Meta: {formatValue(target)}{unit}
                </Typography>
              </Box>
            )}

            {/* Indicador de tendencia */}
            {trend !== undefined && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {trend > 0 ? (
                  <TrendingUp sx={{ fontSize: 16, color: 'success.main' }} />
                ) : trend < 0 ? (
                  <TrendingDown sx={{ fontSize: 16, color: 'error.main' }} />
                ) : null}
                
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: trend > 0 ? 'success.main' : trend < 0 ? 'error.main' : 'text.secondary',
                    fontWeight: 600,
                    fontSize: '0.75rem'
                  }}
                >
                  {trend > 0 ? '+' : ''}{trend.toFixed(1)}%
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                  vs mes anterior
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default KPICard;
