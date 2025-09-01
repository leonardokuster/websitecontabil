'use client';

import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Grid, Box } from '@mui/material';
import Cookies from 'js-cookie';

export default function Home() {
    const [fullName, setFullName] = useState('');

    React.useEffect(() => {
        const storedFullName = Cookies.get('nome');
        if (storedFullName) {
            setFullName(storedFullName);
        }
    }, []);

    const firstName = fullName.split(' ')[0];

    return (
        <Container component="main" sx={{ pt: 4, height: '100vh' }}>
            <Grid
                container
                justifyContent="center"
                alignItems="center"
                sx={{ height: '100%' }}
            >
                <Grid item xs={12} sm={10} md={6}>
                    <Paper
                        elevation={3}
                        sx={{
                            p: 4,
                            textAlign: 'center',
                            borderRadius: '16px',
                        }}
                    >
                        <Typography variant="h4" gutterBottom>
                            Bem-vindo(a), {firstName}!
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            Selecione a opção desejada no menu acima.
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}