'use client';

import * as React from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

export function DemoDataNotice() {
  return (
    <Box sx={{ width: '100%', mb: 2 }}>
      <Alert
        severity="warning"
        icon={<WarningAmberIcon fontSize="inherit" />}
        sx={{
          borderRadius: 2,
          border: '1px solid rgba(237, 108, 2, 0.4)',
          backgroundColor: '#FFF8E1',
          '& .MuiAlert-message': { width: '100%' },
        }}
      >
        <AlertTitle sx={{ fontWeight: 700, fontSize: '0.875rem', mb: 0.25 }}>
          LUCENA CITY PILOT &mdash; PARTICIPATORY FLOOD MONITORING & CITIZEN VALIDATION
        </AlertTitle>
        <Typography variant="body2" sx={{ fontSize: '0.8rem', color: '#5D4037', lineHeight: 1.4 }}>
          This prototype demonstrates barangay-level assessment for <strong>Lucena City (Quezon Province)</strong> along the Iyam River, Dumacaa River, and Tayabas Bay coast. Residents can act as <strong>Citizen Validators</strong> to confirm, rate, or report ground water depth in real-time. Notice: Telemetry is simulated for testing and evaluation purposes.
        </Typography>
      </Alert>
    </Box>
  );
}
