import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  LinearProgress,
  Avatar
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Remove,
  People,
  AttachMoney,
  EventNote,
  Hotel
} from '@mui/icons-material';

const QuickStatsWidget = ({ data, loading = false }) => {
  
  // Calcular estadísticas rápidas
  const stats = React.useMemo(() => {
    if (!data?.metrics) return [];
    
    const { metrics } = data;
    
    return [
      {
        id: 'revenue-per-user',
        label: 'Ingreso por Usuario',
        value: metrics.totalUsers > 0 ? metrics.totalRevenue / metrics.totalUsers : 0,
        format: 'currency',
        icon: <AttachMoney />,
        color: 'primary',
        trend: 8.5
      },
      {
        id: 'avg-reservation-value',
        label: 'Valor Promedio',
        value: metrics.averageReservationValue || 0,
        format: 'currency',
        icon: <EventNote />,
        color: 'success',
        trend: 12.3
      },
      {
        id: 'capacity-utilization',
        label: 'Utilización',
        value: metrics.occupancyRate || 0,
        format: 'percentage',
        icon: <Hotel />,
        color: 'info',
        trend: -2.1,
        target: 85
      },
      {
        id: 'user-growth-rate',
        label: 'Crecimiento Usuarios',
        value: metrics.newUsersThisMonth || 0,
        format: 'number',
        icon: <People />,
        color: 'warning',
        trend: 15.7,
        suffix: ' nuevos'
      }
    ];
  }, [data]);

  const formatValue = (value, format, suffix = '') => {
    if (loading) return '---';
    
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('es-HN', {
          style: 'currency',
          currency: 'HNL',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(value);
      case 'percentage':
        return `${value.toFixed(1)}%`;
      case 'number':
        return value.toLocaleString() + suffix;
      default:
        return value + suffix;
    }
  };

  const getTrendIcon = (trend) => {
    if (trend > 0) return <TrendingUp sx={{ fontSize: 14 }} />;
    if (trend < 0) return <TrendingDown sx={{ fontSize: 14 }} />;
    return <Remove sx={{ fontSize: 14 }} />;
  };

  const getTrendColor = (trend) => {
    if (trend > 0) return 'success.main';
    if (trend < 0) return 'error.main';
    return 'text.secondary';
  };

  return (
    <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
          📈 Estadísticas Rápidas
        </Typography>
        
        <Grid container spacing={2}>
          {stats.map((stat) => (
            <Grid item xs={12} sm={6} key={stat.id}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  p: 2,
                  borderRadius: 2,
                  bgcolor: `${stat.color}.50`,
                  border: '1px solid',
                  borderColor: `${stat.color}.200`,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: `${stat.color}.100`,
                    transform: 'translateY(-1px)'
                  }
                }}
              >
                {/* Icono */}
                <Avatar
                  sx={{
                    bgcolor: `${stat.color}.100`,
                    color: `${stat.color}.600`,
                    width: 40,
                    height: 40
                  }}
                >
                  {stat.icon}
                </Avatar>

                {/* Contenido */}
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ fontSize: '0.8rem', mb: 0.5 }}
                    noWrap
                  >
                    {stat.label}
                  </Typography>
                  
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 700, 
                      color: `${stat.color}.700`,
                      lineHeight: 1,
                      mb: 0.5
                    }}
                  >
                    {formatValue(stat.value, stat.format, stat.suffix)}
                  </Typography>

                  {/* Progreso hacia objetivo si existe */}
                  {stat.target && (
                    <Box sx={{ mb: 0.5 }}>
                      <LinearProgress
                        variant="determinate"
                        value={Math.min((stat.value / stat.target) * 100, 100)}
                        sx={{
                          height: 3,
                          borderRadius: 2,
                          bgcolor: `${stat.color}.200`,
                          '& .MuiLinearProgress-bar': {
                            bgcolor: `${stat.color}.500`,
                            borderRadius: 2
                          }
                        }}
                      />
                    </Box>
                  )}

                  {/* Tendencia */}
                  {stat.trend !== undefined && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          color: getTrendColor(stat.trend)
                        }}
                      >
                        {getTrendIcon(stat.trend)}
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            fontWeight: 600,
                            fontSize: '0.7rem',
                            ml: 0.2
                          }}
                        >
                          {stat.trend > 0 ? '+' : ''}{stat.trend.toFixed(1)}%
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Resumen */}
        <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
            💡 <strong>Insight:</strong> {
              data?.metrics?.revenueGrowth > 10 
                ? 'Excelente crecimiento en ingresos este mes'
                : data?.metrics?.occupancyRate > 80 
                ? 'Alta ocupación, considera optimizar precios'
                : 'Oportunidad para mejorar la ocupación'
            }
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default QuickStatsWidget;
