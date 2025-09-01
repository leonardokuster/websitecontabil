'use client';
import React from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { TextField, Button, Box, Paper, Typography, Grid } from '@mui/material';
// Importe seu componente de máscara
// import CpfMask from '@/components/form/masks/cpf/CpfMask';

const relativeSchema = yup.object({
    nomeDependente: yup.string().required('Nome é obrigatório'),
    // ... adicione as outras validações
});

export default function DependentForm({ employeeId, onSubmit, onCancel }) {
    const formik = useFormik({
        initialValues: { nomeDependente: '', /* ... */ },
        validationSchema: relativeSchema,
        onSubmit: async (values) => {
            // Lógica de envio para a API de dependentes
            console.log('Dados do dependente:', values, 'para o funcionário:', employeeId);
            onSubmit();
        },
    });

    return (
        <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
            <Typography variant="h5" align="center" gutterBottom>
                Cadastrar Dependente
            </Typography>
            <Typography variant="subtitle1" align="center" gutterBottom>
                Funcionário ID: {employeeId}
            </Typography>
            <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            id="nomeDependente"
                            name="nomeDependente"
                            label="Nome do dependente"
                            value={formik.values.nomeDependente}
                            onChange={formik.handleChange}
                        />
                    </Grid>
                </Grid>
                {/* Adicione os outros campos aqui */}
                
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    <Button variant="outlined" onClick={onCancel}>
                        Cancelar
                    </Button>
                    <Button type="submit" variant="contained">
                        Salvar
                    </Button>
                </Box>
            </form>
        </Paper>
    );
}