'use client';

import * as React from 'react';
import { Box, Typography } from '@mui/material';


export default function dashboard() {
    return (
        <Box component="main" sx={{ p: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom>
                Bem-vindo ao dashboard
            </Typography>
        </Box>
    )
}