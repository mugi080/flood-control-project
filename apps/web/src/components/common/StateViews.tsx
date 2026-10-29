'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Skeleton from '@mui/material/Skeleton';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import RefreshIcon from '@mui/icons-material/Refresh';

export function MapLoadingState() {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        minHeight: 520,
        position: 'relative',
        borderRadius: 2.5,
        overflow: 'hidden',
        bgcolor: '#EAEFF5',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
      }}
    >
      <Skeleton variant="rectangular" width="100%" height="100%" sx={{ position: 'absolute', inset: 0 }} />
      <Paper
        elevation={3}
        sx={{
          position: 'relative',
          zIndex: 2,
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          borderRadius: 2,
          bgcolor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(4px)',
        }}
      >
        <CircularProgress size={36} thickness={4} sx={{ color: '#0B2545' }} />
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Loading Interactive Flood Map
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Initializing Leaflet map tiles and municipal boundaries...
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}

interface EmptyStateProps {
  message?: string;
  onReset?: () => void;
}

export function EmptyFilterState({
  message = 'No flood zones or alerts match your selected severity filter.',
  onReset,
}: EmptyStateProps) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 3,
        textAlign: 'center',
        borderRadius: 2,
        bgcolor: '#FAFCFE',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1.5,
      }}
    >
      <SearchOffIcon sx={{ fontSize: 40, color: 'text.secondary' }} />
      <Typography variant="body2" color="text.secondary">
        {message}
      </Typography>
      {onReset && (
        <Button size="small" variant="outlined" onClick={onReset} startIcon={<RefreshIcon />}>
          Reset Filter
        </Button>
      )}
    </Paper>
  );
}

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorStateView({
  title = 'Failed to load flood telemetry data',
  message,
  onRetry,
}: ErrorStateProps) {
  return (
    <Alert
      severity="error"
      sx={{ borderRadius: 2 }}
      action={
        onRetry && (
          <Button color="inherit" size="small" onClick={onRetry} startIcon={<RefreshIcon />}>
            Retry
          </Button>
        )
      }
    >
      <AlertTitle sx={{ fontWeight: 600 }}>{title}</AlertTitle>
      <Typography variant="body2">{message}</Typography>
    </Alert>
  );
}
