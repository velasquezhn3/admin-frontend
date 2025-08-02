import React from 'react';
import {
  Box,
  Typography,
  Button,
  useTheme,
} from '@mui/material';
import {
  Inbox as InboxIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';

const EmptyState = ({
  icon: CustomIcon = InboxIcon,
  title = 'No hay datos disponibles',
  description = 'Los datos aparecerán aquí una vez que estén disponibles.',
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  size = 'medium', // small, medium, large
}) => {
  const theme = useTheme();

  const getSizes = () => {
    switch (size) {
      case 'small':
        return {
          iconSize: 48,
          titleVariant: 'h6',
          spacing: 2,
          padding: 3,
        };
      case 'large':
        return {
          iconSize: 96,
          titleVariant: 'h4',
          spacing: 4,
          padding: 6,
        };
      default:
        return {
          iconSize: 72,
          titleVariant: 'h5',
          spacing: 3,
          padding: 4,
        };
    }
  };

  const sizes = getSizes();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        p: sizes.padding,
        minHeight: size === 'large' ? 400 : size === 'small' ? 200 : 300,
      }}
    >
      {/* Icon */}
      <Box
        sx={{
          width: sizes.iconSize,
          height: sizes.iconSize,
          borderRadius: '50%',
          bgcolor: 'grey.100',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: sizes.spacing,
          color: 'grey.400',
        }}
      >
        <CustomIcon sx={{ fontSize: sizes.iconSize * 0.6 }} />
      </Box>

      {/* Title */}
      <Typography
        variant={sizes.titleVariant}
        sx={{
          fontWeight: 600,
          color: 'text.primary',
          mb: 1,
          maxWidth: 400,
        }}
      >
        {title}
      </Typography>

      {/* Description */}
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{
          mb: sizes.spacing,
          maxWidth: 500,
          lineHeight: 1.6,
        }}
      >
        {description}
      </Typography>

      {/* Actions */}
      {(actionLabel || secondaryActionLabel) && (
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
          }}
        >
          {actionLabel && onAction && (
            <Button
              variant="contained"
              onClick={onAction}
              startIcon={<AddIcon />}
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1,
                fontWeight: 600,
                textTransform: 'none',
                minWidth: 140,
              }}
            >
              {actionLabel}
            </Button>
          )}
          
          {secondaryActionLabel && onSecondaryAction && (
            <Button
              variant="outlined"
              onClick={onSecondaryAction}
              startIcon={<RefreshIcon />}
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1,
                fontWeight: 600,
                textTransform: 'none',
                minWidth: 140,
              }}
            >
              {secondaryActionLabel}
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
};

export default EmptyState;
