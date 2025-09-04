'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { useTheme, useMediaQuery, Container, Box, CircularProgress, Alert, Typography, Button, Grid, Paper, TextField } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';import { useFormik } from 'formik';
import * as yup from 'yup';
import Cookies from 'js-cookie';

import PhoneMask from '@/components/form/masks/phone/PhoneMask';
import CnpjMask from '@/components/form/masks/cnpj/CnpjMask';
import CurrencyMask from '@/components/form/masks/currency/CurrencyMask';

const getLoggedInUserId = () => Cookies.get('usuario_id');

const validationSchema = yup.object({
    cnpj: yup.string().required('CNPJ é obrigatório'),
    nomeFantasia: yup.string().required('Nome fantasia é obrigatório'),
    razaoSocial: yup.string().required('Razão social é obrigatória'),
    atividadesExercidas: yup.string().required('Informe as atividades exercidas'),
    capitalSocial: yup.string().required('Capital social é obrigatório'),
    cep: yup.string().required('CEP é obrigatório'),
    endereco: yup.string().required('Endereço é obrigatório'),
    numeroEmpresa: yup.string().required('Número é obrigatório'),
    complementoEmpresa: yup.string(),
    emailEmpresa: yup.string().email('Email inválido').required('Email da empresa é obrigatório'),
    telefoneEmpresa: yup.string().required('Telefone da empresa é obrigatório'),
    socios: yup.string(),
});

export default function CompanyRegisterPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const userIdFromUrl = searchParams.get('userId');
    const loggedInUserId = getLoggedInUserId();

    const userId = userIdFromUrl || loggedInUserId;

    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    
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
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            setIsSubmitting(true);
            try {
                if (!userId) {
                    setError('ID de usuário não fornecido na URL. Não é possível cadastrar empresa.');
                    setIsSubmitting(false);
                    return;
                }

                const valuesToSend = { ...values };

                if (valuesToSend.capitalSocial) {
                    valuesToSend.capitalSocial = Number(values.capitalSocial.replace(/\./g, '').replace(',', '.')) || 0;
                }
                
                console.log('Dados a serem enviados:', valuesToSend);

                await axios.post(`http://localhost:3001/users/${userId}/companies`, valuesToSend, { withCredentials: true });                
                const redirectPath = `/dashboard/management/company?userId=${userId}`;
                router.push(redirectPath);
            } catch (err) {
                console.error('Erro ao cadastrar empresa:', err);
                setError('Falha ao cadastrar a empresa.');
            } finally {
                setIsSubmitting(false);
            }
        },
    });

    const handleCancel = () => {
        const redirectPath = `/dashboard/management/company?userId=${userId}`;
        router.push(redirectPath);
    };

    return (
        <Container component="main" sx={{ pt: 4, pb: 4 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: '16px' }}>
                <Typography variant='h4' component='h1' gutterBottom align='center' mb={4}>
                    Cadastrar nova empresa
                </Typography>
                <Box component="form" onSubmit={formik.handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                name="cnpj"
                                label="CNPJ"
                                value={formik.values.cnpj}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.cnpj && Boolean(formik.errors.cnpj)}
                                helperText={formik.touched.cnpj && formik.errors.cnpj}
                                slotProps={{ input: {inputComponent: CnpjMask} }}
                            />
                        </Grid>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                name="nomeFantasia"
                                label="Nome fantasia"
                                value={formik.values.nomeFantasia}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.nomeFantasia && Boolean(formik.errors.nomeFantasia)}
                                helperText={formik.touched.nomeFantasia && formik.errors.nomeFantasia}
                            />
                        </Grid>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                name="razaoSocial"
                                label="Razão social"
                                value={formik.values.razaoSocial}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.razaoSocial && Boolean(formik.errors.razaoSocial)}
                                helperText={formik.touched.razaoSocial && formik.errors.razaoSocial}
                            />
                        </Grid>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                name="capitalSocial"
                                label="Capital social"
                                value={formik.values.capitalSocial}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.capitalSocial && Boolean(formik.errors.capitalSocial)}
                                helperText={formik.touched.capitalSocial && formik.errors.capitalSocial}
                                slotProps={{ input: {inputComponent: CurrencyMask} }}
                            />
                        </Grid>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                name="atividadesExercidas" 
                                label="Atividades exercidas"
                                value={formik.values.atividadesExercidas} 
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.atividadesExercidas && Boolean(formik.errors.atividadesExercidas)}
                                helperText={formik.touched.atividadesExercidas && formik.errors.atividadesExercidas} 
                            />
                        </Grid>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <TextField 
                                fullWidth 
                                name="cep" 
                                label="CEP"
                                value={formik.values.cep} 
                                onChange={(e) => {
                                    formik.handleChange(e);
                                    fetchAddress(e.target.value);
                                }}
                                onBlur={formik.handleBlur}
                                error={formik.touched.cep && Boolean(formik.errors.cep)}
                                helperText={formik.touched.cep && formik.errors.cep} 
                            />
                        </Grid>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                name="endereco"
                                label="Endereço"
                                value={formik.values.endereco}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.endereco && Boolean(formik.errors.endereco)}
                                helperText={formik.touched.endereco && formik.errors.endereco}
                            />
                        </Grid>
                        <Grid item size={{ xs: 12, md: 3 }}>
                            <TextField
                                fullWidth
                                name="numeroEmpresa"
                                label="Número"
                                value={formik.values.numeroEmpresa}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.numeroEmpresa && Boolean(formik.errors.numeroEmpresa)}
                                helperText={formik.touched.numeroEmpresa && formik.errors.numeroEmpresa}
                            />
                        </Grid>
                        <Grid item size={{ xs: 12, md: 3 }}>
                            <TextField 
                                fullWidth 
                                name="complementoEmpresa" 
                                label="Complemento"
                                value={formik.values.complementoEmpresa} 
                                onChange={formik.handleChange} 
                                onBlur={formik.handleBlur}
                            />
                        </Grid>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                name="emailEmpresa"
                                label="Email da empresa"
                                value={formik.values.emailEmpresa}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.emailEmpresa && Boolean(formik.errors.emailEmpresa)}
                                helperText={formik.touched.emailEmpresa && formik.errors.emailEmpresa}
                            />
                        </Grid>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                name="telefoneEmpresa"
                                label="Telefone da empresa"
                                value={formik.values.telefoneEmpresa}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.telefoneEmpresa && Boolean(formik.errors.telefoneEmpresa)}
                                helperText={formik.touched.telefoneEmpresa && formik.errors.telefoneEmpresa}
                                slotProps={{ input: {inputComponent: PhoneMask} }}
                            />
                        </Grid>
                        <Grid item size={12}>
                            <TextField
                                fullWidth
                                name="socios"
                                label="Nome dos sócios"
                                value={formik.values.socios}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.socios && Boolean(formik.errors.socios)}
                                helperText={formik.touched.socios && formik.errors.socios}
                            />
                        </Grid>
                    </Grid>
                    <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'space-between' }}>
                        <Button
                            variant="outlined"
                            onClick={handleCancel}
                            sx={{
                                color: 'var(--cordestaque)',
                                bgcolor: 'white',
                                border: '1px solid var(--cordestaque)',
                                width: '10px',
                                mt: '20px',
                                '&:hover': {
                                    bgcolor: 'var(--corhover)',
                                },
                                borderRadius: isSmallScreen ? '50px' : 'none',
                                minWidth: isSmallScreen ? '80px' : '150px',
                                padding: isSmallScreen ? '8px' : '6px 16px',
                            }}
                        >
                            {isSmallScreen ? <CloseIcon /> : 'Cancelar'}
                        </Button>
                        <Button
                            variant="contained"
                            type="submit"
                            disabled={isSubmitting}
                            sx={{
                                bgcolor: 'var(--cordestaque)',
                                color: 'white',
                                mt: '20px',
                                '&:hover': {
                                    bgcolor: 'var(--corhover)',
                                },
                                borderRadius: isSmallScreen ? '50px' : 'none',
                                minWidth: isSmallScreen ? '80px' : '150px',
                                padding: isSmallScreen ? '8px' : '6px 16px',
                            }}
                        >
                            {isSmallScreen ? <SaveIcon /> : 'Cadastrar empresa'}
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
}