'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import {
    Container, Box, CircularProgress, Alert, Typography, Button, Grid, Paper, TextField,
    FormControl, Select, MenuItem
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { format, parse } from 'date-fns';
import PhoneMask from '@/components/form/masks/phone/PhoneMask';
import CpfMask from '@/components/form/masks/cpf/CpfMask';
import DateMask from '@/components/form/masks/date/DateMask';

export default function UserEditPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const userId = searchParams.get('userId');

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const formik = useFormik({
        initialValues: {
            nome: '',
            emailPessoal: '',
            telefonePessoal: '',
            cpf: '',
            dataNascimento: '',
            tipo: '',
        },
        validationSchema: yup.object({
            nome: yup.string().required('Nome é obrigatório'),
            telefonePessoal: yup.string().required('Telefone é obrigatório'),
            emailPessoal: yup.string().email('E-mail inválido').required('Obrigatório'),
            dataNascimento: yup
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
            cpf: yup.string().required('CPF é obrigatório'),
        }),
        onSubmit: async (values) => {
            setIsSubmitting(true);
            try {
                const valuesToSend = { ...values };
                if (valuesToSend.dataNascimento) {
                    const parsedDate = parse(valuesToSend.dataNascimento, 'dd/MM/yyyy', new Date());
                    valuesToSend.dataNascimento = format(parsedDate, 'yyyy-MM-dd');
                }

                await axios.put(`/api/users/${userId}`, valuesToSend, { withCredentials: true });
                router.push('/dashboard/management'); 
            } catch (err) {
                console.error('Erro ao salvar usuário:', err);
                setError('Falha ao salvar as alterações do usuário.');
            } finally {
                setIsSubmitting(false);
            }
        },
    });

    useEffect(() => {
        if (!userId) {
            router.push('/dashboard/management/user'); 
            console.log(`UserID: ${userId}`);
            return;
        }

        const fetchUser = async () => {
            try {
                const response = await axios.get(`/api/users/${userId}`, { withCredentials: true });
                const userData = response.data;
                const formattedUserData = {
                    ...userData,
                    dataNascimento: userData.dataNascimento
                        ? format(parse(userData.dataNascimento, 'yyyy-MM-dd', new Date()), 'dd/MM/yyyy')
                        : '',
                };
                formik.setValues(formattedUserData);
            } catch (err) {
                console.error('Erro ao carregar dados do usuário:', err);
                setError('Não foi possível carregar os dados do usuário. Tente novamente mais tarde.');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [userId, router, formik]);

    const handleCancel = () => {
        router.push('/dashboard/management');
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
                    Editar Usuário
                </Typography>
                <Box component="form" onSubmit={formik.handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                label="Nome"
                                name="nome"
                                value={formik.values.nome}
                                onChange={formik.handleChange}
                                error={formik.touched.nome && Boolean(formik.errors.nome)}
                                helperText={formik.touched.nome && formik.errors.nome}
                            />
                        </Grid>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                label="E-mail Pessoal"
                                name="emailPessoal"
                                value={formik.values.emailPessoal}
                                onChange={formik.handleChange}
                                error={formik.touched.emailPessoal && Boolean(formik.errors.emailPessoal)}
                                helperText={formik.touched.emailPessoal && formik.errors.emailPessoal}
                            />
                        </Grid>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                label="Telefone Pessoal"
                                name="telefonePessoal"
                                value={formik.values.telefonePessoal}
                                onChange={formik.handleChange}
                                error={formik.touched.telefonePessoal && Boolean(formik.errors.telefonePessoal)}
                                helperText={formik.touched.telefonePessoal && formik.errors.telefonePessoal}
                                slotProps={{
                                    input: { inputComponent: PhoneMask }
                                }}
                            />
                        </Grid>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                label="CPF"
                                name="cpf"
                                value={formik.values.cpf}
                                onChange={formik.handleChange}
                                error={formik.touched.cpf && Boolean(formik.errors.cpf)}
                                helperText={formik.touched.cpf && formik.errors.cpf}
                                slotProps={{
                                    input: { inputComponent: CpfMask }
                                }}
                            />
                        </Grid>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                label="Data de Nascimento"
                                name="dataNascimento"
                                value={formik.values.dataNascimento}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.dataNascimento && Boolean(formik.errors.dataNascimento)}
                                helperText={formik.touched.dataNascimento && formik.errors.dataNascimento}
                                slotProps={{
                                    inputLabel: { shrink: true },
                                    input: { inputComponent: DateMask }
                                }}
                            />
                        </Grid>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <FormControl fullWidth>
                                <Select
                                    name="tipo"
                                    value={formik.values.tipo}
                                    onChange={formik.handleChange}
                                    error={formik.touched.tipo && Boolean(formik.errors.tipo)}
                                >
                                    <MenuItem value="admin">Admin</MenuItem>
                                    <MenuItem value="collaborator">Collaborator</MenuItem>
                                    <MenuItem value="user">User</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                        <Button
                            variant="outlined"
                            startIcon={<CancelIcon />}
                            onClick={handleCancel}
                            sx={{
                                color: 'var(--cordestaque)',
                                mt: '20px',
                                border: '1px solid var(--cordestaque)'
                            }}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="contained"
                            type="submit"
                            startIcon={<SaveIcon />}
                            disabled={isSubmitting}
                            sx={{
                                bgcolor: 'var(--cordestaque)',
                                color: 'white',
                                mt: '20px',
                                '&:hover': {
                                    bgcolor: 'var(--corhover)',
                                },
                            }}
                        >
                            Salvar Alterações
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
}