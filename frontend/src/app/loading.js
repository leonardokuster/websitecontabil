import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

export default function Loading() {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}
    >
      <CircularProgress sx={{ mb: 2 }} />
      <Typography variant="h6">Carregando...</Typography>
    </Box>
  );
}
