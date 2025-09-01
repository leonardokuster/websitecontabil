'use client';
import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import { TextField, Button, Box, Paper, Typography, Alert, Grid, Divider } from '@mui/material';
import PhoneMask from '@/components/form/masks/phone/PhoneMask';
import CnpjMask from '@/components/form/masks/cnpj/CnpjMask';
import CurrencyMask from '@/components/form/masks/currency/CurrencyMask';
import Cookies from 'js-cookie';

const companySchema = yup.object({
    cnpj: yup.string().required('CNPJ é obrigatório'),
    nomeFantasia: yup.string().required('Nome fantasia é obrigatório'),
    razaoSocial: yup.string().required('Razão social é obrigatória'),
    atividadesExercidas: yup.string().required('Informe as atividades exercidas'),
    capitalSocial: yup.string().required('Capital social é obrigatório'),
    cep: yup.string().required('CEP é obrigatório'),
    endereco: yup.string().required('Endereço é obrigatório'),
    numeroEmpresa: yup.string().required('Número é obrigatório'),
    emailEmpresa: yup.string().email('Email inválido').required('Email da empresa é obrigatório'),
    telefoneEmpresa: yup.string().required('Telefone da empresa é obrigatório'),
    nomeSocios: yup.string(),
});

export default function CompanyForm({ onCancel }) {
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const fetchAddress = async (cep) => {
        const cleanCep = cep.replace(/\D/g, '');
        if (cleanCep.length !== 8) return;
        try {
        const res = await axios.get(`https://viacep.com.br/ws/${cleanCep}/json/`);
        if (!res.data.erro) {
            formik.setFieldValue('endereco', res.data.logradouro || '');
        }
        } catch (err) {
        console.error('Erro ao buscar CEP:', err);
        }
    };

    const formik = useFormik({
        initialValues: {
            cnpj: '',
            nomeFantasia: '',
            razaoSocial: '',
            atividadesExercidas: '',
            capitalSocial: '',
            cep: '',
            endereco: '',
            numeroEmpresa: '',
            complementoEmpresa: '',
            emailEmpresa: '',
            telefoneEmpresa: '',
            socios: '',
        },
        validationSchema: companySchema,
        validateOnChange: false,
        validateOnBlur: false,
        onSubmit: async (values, { resetForm }) => {
            const token = Cookies.get('token');
            const userId = Cookies.get('userId');

            if (!userId) {
                setMessage('ID do usuário não encontrada');
            }

            try {
                const response = await axios.post(
                    'http://localhost:3001/company/register', 
                    { ...values, userId: values.userId }, 
                    { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } }
                );
                setMessage('Empresa cadastrada com sucesso!');
                setIsSuccess(true);
                resetForm();
            } catch (error) {
                setMessage(error.response?.data?.message || 'Erro ao cadastrar empresa.');
                setIsSuccess(false);
            }
        },
    });

    return (
        <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
            <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            margin="normal"
                            id="cnpj"
                            name="cnpj"
                            label="CNPJ"
                            value={formik.values.cnpj}
                            onChange={formik.handleChange}
                            error={formik.touched.cnpj && Boolean(formik.errors.cnpj)}
                            helperText={formik.touched.cnpj && formik.errors.cnpj}
                            slotProps={{
                                input: { inputComponent: CnpjMask }
                            }}
                        />
                    </Grid>
                    <Grid item size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            margin="normal"
                            id="nomeFantasia"
                            name="nomeFantasia"
                            label="Nome fantasia"
                            value={formik.values.nomeFantasia}
                            onChange={formik.handleChange}
                            error={formik.touched.nomeFantasia && Boolean(formik.errors.nomeFantasia)}
                            helperText={formik.touched.nomeFantasia && formik.errors.nomeFantasia}
                        />
                    </Grid>
                    <Grid item size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            margin="normal"
                            id="razaoSocial"
                            name="razaoSocial"
                            label="Razão social"
                            value={formik.values.razaoSocial}
                            onChange={formik.handleChange}
                            error={formik.touched.razaoSocial && Boolean(formik.errors.razaoSocial)}
                            helperText={formik.touched.razaoSocial && formik.errors.razaoSocial}
                        />
                    </Grid>
                    <Grid item size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            margin="normal"
                            id="capitalSocial"
                            name="capitalSocial"
                            label="Capital social"
                            value={formik.values.capitalSocial}
                            onChange={formik.handleChange}
                            error={formik.touched.capitalSocial && Boolean(formik.errors.capitalSocial)}
                            helperText={formik.touched.capitalSocial && formik.errors.capitalSocial}
                            slotProps={{
                                input: { inputComponent: CurrencyMask }
                            }}
                        />
                    </Grid>
                    <Grid item size={12}>
                        <TextField 
                            fullWidth 
                            margin="normal" 
                            id="atividadesExercidas" 
                            name="atividadesExercidas" 
                            label="Atividades exercidas"
                            value={formik.values.atividadesExercidas} 
                            onChange={formik.handleChange}
                            error={formik.touched.atividadesExercidas && Boolean(formik.errors.atividadesExercidas)}
                            helperText={formik.touched.atividadesExercidas && formik.errors.atividadesExercidas} 
                        />
                    </Grid>
                    <Grid item size={12}>
                        <TextField 
                            fullWidth 
                            margin="normal" 
                            id="cep" 
                            name="cep" 
                            label="CEP"
                            value={formik.values.cep} 
                            onChange={(e) => {
                                formik.handleChange(e);
                                fetchAddress(e.target.value);
                            }}
                            error={formik.touched.cep && Boolean(formik.errors.cep)}
                            helperText={formik.touched.cep && formik.errors.cep} 
                        />
                    </Grid>
                    <Grid item size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            margin="normal"
                            id="endereco"
                            name="endereco"
                            label="Endereço"
                            value={formik.values.endereco}
                            onChange={formik.handleChange}
                            error={formik.touched.endereco && Boolean(formik.errors.endereco)}
                            helperText={formik.touched.endereco && formik.errors.endereco}
                        />
                    </Grid>
                    <Grid item size={{ xs: 12, md: 3 }}>
                        <TextField
                            fullWidth
                            margin="normal"
                            id="numeroEmpresa"
                            name="numeroEmpresa"
                            label="Número"
                            value={formik.values.numeroEmpresa}
                            onChange={formik.handleChange}
                            error={formik.touched.numeroEmpresa && Boolean(formik.errors.numeroEmpresa)}
                            helperText={formik.touched.numeroEmpresa && formik.errors.numeroEmpresa}
                        />
                    </Grid>
                    <Grid item size={{ xs: 12, md: 3 }}>
                        <TextField 
                            fullWidth 
                            margin="normal" 
                            id="complementoEmpresa" 
                            name="complementoEmpresa" 
                            label="Complemento"
                            value={formik.values.complementoEmpresa} 
                            onChange={formik.handleChange} 
                        />
                    </Grid>
                    <Grid item size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            margin="normal"
                            id="emailEmpresa"
                            name="emailEmpresa"
                            label="Email da empresa"
                            value={formik.values.emailEmpresa}
                            onChange={formik.handleChange}
                            error={formik.touched.emailEmpresa && Boolean(formik.errors.emailEmpresa)}
                            helperText={formik.touched.emailEmpresa && formik.errors.emailEmpresa}
                        />
                    </Grid>
                    <Grid item size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            margin="normal"
                            id="telefoneEmpresa"
                            name="telefoneEmpresa"
                            label="Telefone da empresa"
                            value={formik.values.telefoneEmpresa}
                            onChange={formik.handleChange}
                            error={formik.touched.telefoneEmpresa && Boolean(formik.errors.telefoneEmpresa)}
                            helperText={formik.touched.telefoneEmpresa && formik.errors.telefoneEmpresa}
                            slotProps={{
                                input: { inputComponent: PhoneMask }
                            }}
                        />
                    </Grid>
                </Grid>
                <Divider style={{ margin: '10px' }} />
                <Grid item size={12}>
                    <Typography variant="h7" align="left" gutterBottom>
                        Caso possua, informe o nome dos sócios.
                    </Typography>
                    <TextField
                        fullWidth
                        margin="normal"
                        id="socios"
                        name="socios"
                        label="Nome dos sócios"
                        value={formik.values.socios}
                        onChange={formik.handleChange}
                        error={formik.touched.socios && Boolean(formik.errors.socios)}
                        helperText={formik.touched.socios && formik.errors.socios}
                    />
                </Grid>
                
                {message && (
                    <Box sx={{ mt: 2 }}>
                        <Alert severity={isSuccess ? 'success' : 'error'}>{message}</Alert>
                    </Box>
                )}
                
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', gap: { xs: 2, md: 10 } }}>
                    <Button 
                        variant='contained' 
                        onClick={onCancel} 
                        sx={{
                            color: 'var(--cordestaque)',
                            bgcolor: 'white',
                            width: '100%',
                            border: '1px solid var(--cordestaque)',
                        }}
                    >
                        Voltar
                    </Button>
                    <Button 
                        fullWidth
                        variant="contained" 
                        type="submit" 
                        disabled={formik.isSubmitting} 
                        sx={{
                            bgcolor: 'var(--cordestaque)',
                            '&:hover': {
                                bgcolor: 'var(--corhover)',
                            },
                        }}
                    >
                        {formik.isSubmitting ? 'Enviando...' : 'Cadastrar'}
                    </Button>
                </Box>
            </form>
        </Paper>
    );
}