'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { Container, Box, CircularProgress, Alert, Typography, Button, Grid, Paper, TextField } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Cookies from 'js-cookie';

import PhoneMask from '@/components/form/masks/phone/PhoneMask';
import CnpjMask from '@/components/form/masks/cnpj/CnpjMask';
import CurrencyMask from '@/components/form/masks/currency/CurrencyMask';

const getLoggedInUserId = () => {
    return Cookies.get('usuario_id');
};

const getLoggedInUserType = () => {
    return Cookies.get('tipo');
};


export default function CompanyEditPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const userIdFromUrl = searchParams.get('userId');
    const companyId = searchParams.get('companyId');
    const [originalCapital, setOriginalCapital] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const loggedInUserId = getLoggedInUserId();
    const loggedInUserType = getLoggedInUserType();

    const redirectUserId = userIdFromUrl || loggedInUserId;

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
            token: '',
            userId: '',
        },
        validationSchema: yup.object({
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
        }),
        onSubmit: async (values) => {
            setIsSubmitting(true);
            console.log('Dados a serem enviados:', values);
            try {
                const formattedValues = {
                    ...values,
                    capitalSocial: values.capitalSocial === new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2 }).format(originalCapital)
                        ? originalCapital 
                        : Number(values.capitalSocial.replace(/\./g, '').replace(',', '.')) || 0
                };

                await axios.put(`http://localhost:3001/company/${companyId}`, formattedValues, { withCredentials: true });
                const redirectPath = userIdFromUrl ? `/dashboard/management/company?userId=${userIdFromUrl}` : '/dashboard/management/company';
                router.push(redirectPath);
            } catch (err) {
                console.error('Erro ao salvar empresa:', err);
                setError('Falha ao salvar as alterações da empresa.');
            } finally {
                setIsSubmitting(false);
            }
        },
    });

    useEffect(() => {
        if (!companyId) {
            router.push('/dashboard/management/company'); 
            console.log(`CompanyID: ${companyId}`);
            return;
        }
        const fetchCompany = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/company/${companyId}`, { withCredentials: true });
                const companyData = response.data;
                setOriginalCapital(companyData.capitalSocial);

                formik.setValues({
                    ...companyData,
                    capitalSocial: companyData.capitalSocial
                    ? new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2 }).format(companyData.capitalSocial)
                    : ''
                });
            } catch (err) {
                console.error('Erro ao carregar dados da empresa:', err);
                setError('Não foi possível carregar os dados da empresa. Tente novamente mais tarde.');
            } finally {
                setLoading(false);
            }
        };

        fetchCompany();
    }, [companyId]);

    if (loading) {
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
            </Container>
        );
    }

    if (error) {
        return <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>;
    }

    const handleCancel = () => {
        const path = (loggedInUserType === 'admin' && redirectUserId)
            ? `/dashboard/management/company?userId=${redirectUserId}`
            : '/dashboard/management/company';
        router.push(path);
    };

    return (
        <Container component="main" sx={{ pt: 4, pb: 4 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: '16px' }}>
                <Typography variant='h4' component='h1' gutterBottom align='center' mb={4}>
                    Editar empresa
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
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                name="atividadesExercidas" 
                                label="Atividades exercidas"
                                value={formik.values.atividadesExercidas} 
                                onChange={formik.handleChange}
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
                                error={formik.touched.endereco && Boolean(formik.errors.endereco)}
                                helperText={formik.touched.endereco && formik.errors.endereco}
                            />
                        </Grid>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                name="numeroEmpresa"
                                label="Número"
                                value={formik.values.numeroEmpresa}
                                onChange={formik.handleChange}
                                error={formik.touched.numeroEmpresa && Boolean(formik.errors.numeroEmpresa)}
                                helperText={formik.touched.numeroEmpresa && formik.errors.numeroEmpresa}
                            />
                        </Grid>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <TextField 
                                fullWidth 
                                name="complementoEmpresa" 
                                label="Complemento"
                                value={formik.values.complementoEmpresa} 
                                onChange={formik.handleChange} 
                            />
                        </Grid>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
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
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                name="socios"
                                label="Nome dos sócios"
                                value={formik.values.socios}
                                onChange={formik.handleChange}
                                error={formik.touched.socios && Boolean(formik.errors.socios)}
                                helperText={formik.touched.socios && formik.errors.socios}
                            />
                        </Grid>
                    </Grid>
                    <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                        <Button
                            variant="outlined"
                            startIcon={<CancelIcon />}
                            onClick={handleCancel}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="contained"
                            type="submit"
                            startIcon={<SaveIcon />}
                            disabled={isSubmitting}
                        >
                            Salvar Alterações
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
}