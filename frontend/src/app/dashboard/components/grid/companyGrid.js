'use client';
import React from 'react';
import { Paper, Typography, Button, Box } from '@mui/material';

export default function CompanyCard({ companyData, onEdit }) {
    if (!companyData) {
        return null;
    }

    return (
        <Paper elevation={3} sx={{ p: 4, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
                Dados da Empresa
            </Typography>
            <Typography variant="body1">
                **Nome Fantasia:** {companyData.nomeFantasia}
            </Typography>
            <Typography variant="body1">
                **Razão Social:** {companyData.razaoSocial}
            </Typography>
            <Typography variant="body1">
                **CNPJ:** {companyData.cnpj}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Button variant="outlined" onClick={onEdit}>
                    Editar Empresa
                </Button>
            </Box>
        </Paper>
    );
}