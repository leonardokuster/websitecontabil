import React from 'react';
import { Box, Typography } from '@mui/material';

export default function Footer() {
    return (
        <Box
            component="footer"
            sx={{
                width: '100%',
                py: 2, 
                px: 2, 
                mt: 'auto', 
                backgroundColor: '#070E26',
                color: 'white',
                textAlign: 'center',
            }}
        >
            <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', md: '1rem' } }}>
                &copy; 2025 Escritório Küster. Todos os direitos reservados.
            </Typography>
        </Box>
    );
}