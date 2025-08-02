import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  useTheme,
  Skeleton,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  MoreVert,
} from '@mui/icons-material';

const MetricCard = ({
  title,
  value,
  change,
  changeType,
  icon,
  color = 'primary',
  loading = false,
  onClick,
  subtitle,
}) => {
  const theme = useTheme();

  const getChangeColor = () => {
    if (changeType === 'positive') return theme.palette.success.main;
    if (changeType === 'negative') return theme.palette.error.main;
    return theme.palette.text.secondary;
  };

  const getChangeIcon = () => {
    if (changeType === 'positive') return <TrendingUp sx={{ fontSize: 16 }} />;
    if (changeType === 'negative') return <TrendingDown sx={{ fontSize: 16 }} />;
    return null;
  };

  if (loading) {
    return (
      <Card
        sx={{
          height: '100%',
          cursor: onClick ? 'pointer' : 'default',
          transition: 'all 0.2s ease-in-out',
          '&:hover': onClick ? {
            transform: 'translateY(-2px)',
            boxShadow: theme.shadows[4],
          } : {}
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Skeleton variant="circular" width={48} height={48} />
            <Skeleton variant="circular" width={24} height={24} />
          </Box>
          <Skeleton variant="text" width="60%" height={24} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="100%" height={40} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="40%" height={20} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        height: '100%',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease-in-out',
        '&:hover': onClick ? {
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows[4],
        } : {},
        border: '1px solid',
        borderColor: 'divider',
      }}
      onClick={onClick}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              bgcolor: `${color}.main`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
            }}
          >
            {icon}
          </Box>
          <IconButton size="small" sx={{ color: 'text.secondary' }}>
            <MoreVert />
          </IconButton>
        </Box>

        {/* Title */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 1, fontWeight: 500 }}
        >
          {title}
        </Typography>

        {/* Value */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: 'text.primary',
            mb: subtitle ? 0.5 : 1,
            lineHeight: 1.2,
          }}
        >
          {value}
        </Typography>

        {/* Subtitle */}
        {subtitle && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 1 }}
          >
            {subtitle}
          </Typography>
        )}

        {/* Change indicator */}
        {change && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              color: getChangeColor(),
            }}
          >
            {getChangeIcon()}
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                fontSize: '0.875rem',
              }}
            >
              {change}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: '0.875rem' }}
            >
              vs mes anterior
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricCard;
