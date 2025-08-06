import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  IconButton,
  Chip,
  Skeleton,
  Tooltip,
  LinearProgress
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  TrendingFlat,
  Info,
  Refresh
} from '@mui/icons-material';

const MetricCardAdvanced = ({
  title,
  value,
  subtitle,
  icon,
  color = 'primary',
  growth,
  previousValue,
  loading = false,
  trend = 'stable',
  status = 'normal',
  onClick,
  onRefresh,
  showInfo = false,
  infoText = '',
  progress,
  target,
  unit = '',
  format = 'number',
  size = 'medium'
}) => {
  
  // Calcular crecimiento si se proporciona valor anterior
  const calculatedGrowth = growth !== undefined ? growth : 
    (previousValue && value ? ((value - previousValue) / previousValue) * 100 : 0);

  // Determinar el color del crecimiento
  const getGrowthColor = (growth) => {
    if (growth > 5) return 'success';
    if (growth > 0) return 'info';
    if (growth > -5) return 'warning';
    return 'error';
  };

  // Formatear el valor
  const formatValue = (val) => {
    if (loading || val === undefined || val === null) return '---';
    
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

  // Renderizar icono de tendencia
  const renderTrendIcon = () => {
    if (calculatedGrowth > 0) {
      return <TrendingUp sx={{ fontSize: 16, color: 'success.main' }} />;
    } else if (calculatedGrowth < 0) {
      return <TrendingDown sx={{ fontSize: 16, color: 'error.main' }} />;
    } else {
      return <TrendingFlat sx={{ fontSize: 16, color: 'text.secondary' }} />;
    }
  };

  // Calcular progreso hacia el objetivo
  const progressValue = target ? (value / target) * 100 : progress;

  return (
    <Card 
      sx={{ 
        height: size === 'small' ? 120 : size === 'large' ? 200 : 160,
        borderRadius: 3,
        border: '1px solid',
        borderColor: `${color}.100`,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s ease',
        '&:hover': onClick ? {
          transform: 'translateY(-2px)',
          boxShadow: 4,
          borderColor: `${color}.300`
        } : {},
        background: `linear-gradient(135deg, ${
          color === 'primary' ? '#f8faff' : 
          color === 'success' ? '#f8fff9' :
          color === 'warning' ? '#fffbf5' :
          color === 'error' ? '#fff8f8' :
          '#f8f9fa'
        } 0%, white 100%)`
      }}
      onClick={onClick}
    >
      <CardContent sx={{ p: size === 'small' ? 2 : 3, height: '100%' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  p: 1,
                  borderRadius: 2,
                  bgcolor: `${color}.100`,
                  color: `${color}.600`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {icon}
              </Box>
              {showInfo && (
                <Tooltip title={infoText} arrow>
                  <IconButton size="small" sx={{ color: 'text.secondary' }}>
                    <Info fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {status !== 'normal' && (
                <Chip
                  size="small"
                  label={status}
                  color={
                    status === 'excellent' ? 'success' :
                    status === 'good' ? 'info' :
                    status === 'warning' ? 'warning' : 'error'
                  }
                  sx={{ fontSize: '0.7rem', height: 20 }}
                />
              )}
              {onRefresh && (
                <IconButton 
                  size="small" 
                  onClick={(e) => {
                    e.stopPropagation();
                    onRefresh();
                  }}
                  sx={{ color: 'text.secondary' }}
                >
                  <Refresh fontSize="small" />
                </IconButton>
              )}
            </Box>
          </Box>

          {/* Title */}
          <Typography 
            variant={size === 'small' ? 'body2' : 'subtitle2'} 
            color="text.secondary"
            sx={{ fontWeight: 500, mb: 1 }}
          >
            {title}
          </Typography>

          {/* Value */}
          <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {loading ? (
              <Skeleton 
                variant="text" 
                height={size === 'small' ? 32 : size === 'large' ? 48 : 40}
                width="70%" 
              />
            ) : (
              <Typography 
                variant={size === 'small' ? 'h6' : size === 'large' ? 'h4' : 'h5'}
                sx={{ 
                  fontWeight: 700,
                  color: 'text.primary',
                  lineHeight: 1,
                  mb: 0.5
                }}
              >
                {formatValue(value)}{unit}
              </Typography>
            )}

            {/* Subtitle */}
            {subtitle && (
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{ fontSize: '0.75rem' }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>

          {/* Growth y Progress */}
          <Box sx={{ mt: 'auto' }}>
            {/* Progress bar */}
            {(progressValue !== undefined || target) && (
              <Box sx={{ mb: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(progressValue || 0, 100)}
                  sx={{
                    height: 4,
                    borderRadius: 2,
                    bgcolor: `${color}.100`,
                    '& .MuiLinearProgress-bar': {
                      bgcolor: `${color}.main`,
                      borderRadius: 2
                    }
                  }}
                />
                {target && (
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                    Meta: {formatValue(target)}{unit}
                  </Typography>
                )}
              </Box>
            )}

            {/* Growth indicator */}
            {calculatedGrowth !== 0 && !loading && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {renderTrendIcon()}
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: getGrowthColor(calculatedGrowth) + '.main',
                    fontWeight: 600,
                    fontSize: '0.75rem'
                  }}
                >
                  {calculatedGrowth > 0 ? '+' : ''}{calculatedGrowth.toFixed(1)}%
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                  vs anterior
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MetricCardAdvanced;
