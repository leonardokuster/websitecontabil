'use client';

import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import Image from 'next/image';

export default function NotFound() {
    return (
        <Box sx={{ p: 10 }}>
            <Container maxWidth="xs">
                <Image src="/images/notfound.webp" alt="Erro 404 - Página não encontrada" width={400} height={300} layout="responsive" objectFit="contain" />
                <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', mt: '30px' }}>
                    Página não encontrada
                </Typography>
            </Container>
        </Box>
    );
};