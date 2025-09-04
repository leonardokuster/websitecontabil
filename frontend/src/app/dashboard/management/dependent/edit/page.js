'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { useTheme, useMediaQuery, Checkbox, FormHelperText, FormControlLabel, MenuItem, Select, InputLabel, FormControl, Container, Box, CircularProgress, Alert, Typography, Button, Grid, Paper, TextField } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import { useFormik } from 'formik';
import * as yup from 'yup';
import CpfMask from '@/components/form/masks/cpf/CpfMask';
import DateMask from '@/components/form/masks/date/DateMask';
import { format, parse } from 'date-fns';
import Cookies from 'js-cookie';

const getLoggedInUserId = () => Cookies.get('usuario_id');

const validationSchema = yup.object({
    nomeDependente: yup.string('Nome completo').required('Campo obrigatório'),
    dataNascimentoDependente: yup
        .string()
        .required('Data de nascimento é obrigatória')
        .test('data-valida', 'Data inválida', function (value) {
            if (!value) return false;
            const [day, month, year] = value.split('/').map(Number);
            const date = new Date(year, month - 1, day);
            return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
        })
        .test('data-passada', 'A data não pode ser no futuro', function (value) {
            if (!value) return false;
            const [day, month, year] = value.split('/').map(Number);
            const date = new Date(year, month - 1, day);
            const today = new Date();
            date.setHours(0, 0, 0, 0);
            today.setHours(0, 0, 0, 0);
            return date <= today;
        }),
    localNascimentoDependente: yup.string('Local do nascimento').required('Campo obrigatório'),
    cpfDependente: yup.string('CPF').required('Campo obrigatório'),
});

export default function DependentEditPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const loggedUserId = getLoggedInUserId();
    const urlUserId = searchParams.get('userId');
    const userId = urlUserId || loggedUserId;

    const companyId = searchParams.get('companyId');
    const employeeId = searchParams.get('employeeId');
    const dependentId = searchParams.get('dependentId');

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    
    const formik = useFormik({
        initialValues: {
            nomeDependente: '',
            dataNascimentoDependente: '',
            cpfDependente: '',
            localNascimentoDependente: ''
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            setIsSubmitting(true);
            try {
                const valuesToSend = { ...values };

                if (valuesToSend.dataNascimentoDependente) {
                    const parsedDate = parse(valuesToSend.dataNascimentoDependente, 'dd/MM/yyyy', new Date());
                    valuesToSend.dataNascimentoDependente = format(parsedDate, 'yyyy-MM-dd');
                }

                console.log('Dados a serem enviados:', valuesToSend);

                await axios.put(`http://localhost:3001/users/${userId}/companies/${companyId}/employees/${employeeId}/dependents/${dependentId}`, valuesToSend, { withCredentials: true });
                const redirectPath = `/dashboard/management/dependent?employeeId=${employeeId}&companyId=${companyId}&userId=${userId}`;
                router.push(redirectPath);
            } catch (err) {
                console.error('Erro ao salvar dependente:', err);
                setError('Falha ao salvar as alterações do dependente.');
            } finally {
                setIsSubmitting(false);
            }
        },
    });

    useEffect(() => {
        if (!userId || !companyId || !employeeId || !dependentId) {
            router.push(`/dashboard/management/employee?companyId=${companyId}&userId=${userId}`);
            return;
        }

        const fetchDependent = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/users/${userId}/companies/${companyId}/employees/${employeeId}/dependents/${dependentId}`, { withCredentials: true });
                const dependentData = response.data;

                formik.setValues({
                    ...dependentData,
                    dataNascimentoDependente: dependentData.dataNascimentoDependente ? format(parse(dependentData.dataNascimentoDependente, 'yyyy-MM-dd', new Date()), 'dd/MM/yyyy'): '',
                });
            } catch (err) {
                console.error('Erro ao carregar dados do dependente:', err);
                setError('Não foi possível carregar os dados do dependente. Tente novamente mais tarde.');
            } finally {
                setLoading(false);
            }
        };

        fetchDependent();
    }, [userId, companyId, employeeId, dependentId]);

    const handleCancel = () => {
        const redirectPath = `/dashboard/management/dependent?employeeId=${employeeId}&companyId=${companyId}&userId=${userId}`;
        router.push(redirectPath);
    };

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

    return (
        <Container 
            component="main" 
            sx={{
                m: 'auto',
                minHeight: '85vh',
                pt: 4,
                pb: 4,
            }}
        >
            <Paper elevation={3} sx={{ p: 4, borderRadius: '16px' }}>
                <Typography variant='h4' component='h1' gutterBottom align='center' mb={4}>
                    Editar dependente
                </Typography>
                <Box component="form" onSubmit={formik.handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <TextField 
                                fullWidth 
                                name="nomeDependente" 
                                label="Nome Completo" 
                                value={formik.values.nomeDependente} 
                                onChange={formik.handleChange} 
                                onBlur={formik.handleBlur} 
                                error={formik.touched.nomeDependente && Boolean(formik.errors.nomeDependente)} 
                                helperText={formik.touched.nomeDependente && formik.errors.nomeDependente} 
                            />
                        </Grid>
        
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                name="dataNascimentoDependente"
                                label="Data nascimento"
                                value={formik.values.dataNascimentoDependente}
                                onChange={formik.handleChange}
                                error={formik.touched.dataNascimentoDependente && Boolean(formik.errors.dataNascimentoDependente)}
                                helperText={formik.touched.dataNascimentoDependente && formik.errors.dataNascimentoDependente}
                                slotProps={{
                                    shrink: true,
                                    input: { inputComponent: DateMask }
                                }}
                            />
                        </Grid>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <TextField 
                                fullWidth 
                                name="localNascimentoDependente" 
                                label="Local de Nascimento" 
                                value={formik.values.localNascimentoDependente} 
                                onChange={formik.handleChange} 
                                onBlur={formik.handleBlur} 
                                error={formik.touched.localNascimentoDependente && Boolean(formik.errors.localNascimentoDependente)} 
                                helperText={formik.touched.localNascimentoDependente && formik.errors.localNascimentoDependente} 
                            />
                        </Grid>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <TextField 
                                fullWidth 
                                name="cpfDependente" 
                                label="CPF" 
                                value={formik.values.cpfDependente} 
                                onChange={formik.handleChange} 
                                onBlur={formik.handleBlur} 
                                error={formik.touched.cpfDependente && Boolean(formik.errors.cpfDependente)} 
                                helperText={formik.touched.cpfDependente && formik.errors.cpfDependente} 
                                slotProps={{ input: { inputComponent: CpfMask } }} 
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
                                    color: 'white',
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
                            {isSmallScreen ? <SaveIcon /> : 'Salvar alterações'}
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
}