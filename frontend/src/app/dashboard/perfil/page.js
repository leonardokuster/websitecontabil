'use client';

import React, { useEffect, useState } from 'react';
import {
  Typography,
  Container,
  Paper,
  Box,
  CircularProgress,
  TextField,
  Button,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import Cookies from 'js-cookie';
import { format, parse } from 'date-fns';
import CpfMask from '@/components/form/masks/cpf/CpfMask';
import DateMask from '@/components/form/masks/date/DateMask';
import PhoneMask from '@/components/form/masks/phone/PhoneMask';

const getLoggedInUserId = () => Cookies.get('usuario_id');

const validationSchema = yup.object({
    nome: yup.string().required('Nome é obrigatório'),
    emailPessoal: yup.string().email('E-mail inválido').required('E-mail é obrigatório'),
    telefonePessoal: yup.string().required('Telefone é obrigatório'),
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
});

export default function ProfilePage() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [message, setMessage] = useState('');

    const userId = getLoggedInUserId();

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const formik = useFormik({
        initialValues: {
            nome: user?.nome || '',
            emailPessoal: user?.emailPessoal || '',
            telefonePessoal: user?.telefonePessoal || '',
            dataNascimento: user?.dataNascimento || '',
            cpf: user?.cpf || '',
        },
        validationSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            try {
                const valuesToSend = { ...values };

                if (valuesToSend.dataNascimento) {
                    const parsedDate = parse(valuesToSend.dataNascimento, 'dd/MM/yyyy', new Date());
                    valuesToSend.dataNascimento = format(parsedDate, 'yyyy-MM-dd');
                }

                await axios.put(`/api/users/${userId}`, valuesToSend, { withCredentials: true });
                setUser({
                    ...valuesToSend,
                    dataNascimento: valuesToSend.dataNascimento ? format(parse(valuesToSend.dataNascimento, 'yyyy-MM-dd', new Date()), 'dd/MM/yyyy'): '',
                }); 
                setEditing(false);
                setMessage('Perfil atualizado com sucesso!');
            } catch (err) {
                console.error('Erro ao atualizar perfil:', err);
                setMessage('Erro ao atualizar perfil. Tente novamente.');
            } 
        },
    });

    useEffect(() => {
        const fetchUser = async () => {
            if (!userId) {
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`/api/users/${userId}`, { 
                    withCredentials: true
                }); 

                const userData = {
                    ...response.data,
                    dataNascimento: response.data.dataNascimento ? format(parse(response.data.dataNascimento, 'yyyy-MM-dd', new Date()), 'dd/MM/yyyy'): '',
                };

                setUser(userData);
                formik.setValues(userData); 
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [userId, formik]);

    if (loading) {
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
            </Container>
        );
    }

    if (!user) return <Typography>Usuário não encontrado</Typography>;

    return (
        <Container 
            maxWidth="sm" 
            sx={{
                p: 2,
                m: 'auto',
                mt: '7%',
                mb: '7%'
            }}
        >
            <Paper elevation={3} sx={{ p: 4, m: 4 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h4">Perfil</Typography>
                    {!editing && (
                        isSmallScreen ? (
                            <IconButton onClick={() => setEditing(true)}>
                                <EditIcon />
                            </IconButton>
                        ) : (
                            <Button 
                                onClick={() => setEditing(true)}
                                sx={{
                                bgcolor: 'var(--cordestaque)',
                                color: 'white',
                                '&:hover': {
                                    bgcolor: 'var(--corhover)',
                                },
                                minWidth: '50px',
                                padding: '6px 16px',
                            }}
                            >
                                Editar
                            </Button>
                        )
                    )}
                </Box>
                {message && (
                    <Typography color={message.includes('sucesso') ? 'primary' : 'error'} sx={{ mt: 2 }}>{message}</Typography>
                )}
                <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 5, display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    {[
                        { key: 'nome', label: 'Nome', mask: null },
                        { key: 'emailPessoal', label: 'E-mail', mask: null },
                        { key: 'telefonePessoal', label: 'Telefone', mask: PhoneMask },
                        { key: 'dataNascimento', label: 'Data de Nascimento', mask: DateMask },
                        { key: 'cpf', label: 'CPF', mask: CpfMask },

                    ].map(({ key, label, mask }) => (
                        <div key={key}>
                            {editing ? (
                                <TextField
                                    fullWidth
                                    variant='standard'
                                    id={key}
                                    name={key}
                                    label={label}
                                    value={formik.values[key]}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched[key] && Boolean(formik.errors[key])}
                                    helperText={formik.touched[key] && formik.errors[key]}
                                    InputProps={{ readOnly: !editing, inputComponent: mask }}
                                    InputLabelProps={{ shrink: true }}
                                />
                            ) : (
                                <Typography><strong>{label}:</strong> {user[key]}</Typography>
                            )}
                        </div>
                    ))}
                    
                    {editing && (
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}>
                            <Button
                                variant="outlined"
                                onClick={() => { 
                                    const originalValues = {
                                        ...user,
                                        dataNascimento: user.dataNascimento ? format(parse(user.dataNascimento, 'dd/MM/yyyy', new Date()), 'yyyy-MM-dd') : '',
                                    };
                                    formik.resetForm({ values: originalValues });
                                    setEditing(false);
                                }}
                                sx={{
                                    color: 'var(--cordestaque)',
                                    bgcolor: 'white',
                                    border: '1px solid var(--cordestaque)',
                                    mt: '20px',
                                    borderRadius: '50px',
                                    '&:hover': {
                                        color: 'white',
                                        bgcolor: 'var(--corhover)',
                                    },
                                }}
                            >
                                {isSmallScreen ? <CloseIcon /> : 'Cancelar'}
                            </Button>
                            <Button
                                variant="contained"
                                type="submit"
                                disabled={formik.isSubmitting}
                                sx={{
                                    bgcolor: 'var(--cordestaque)',
                                    color: 'white',
                                    mt: '20px',
                                    borderRadius: '50px',
                                    '&:hover': {
                                        bgcolor: 'var(--corhover)',
                                    },
                                }}
                            >
                                {formik.isSubmitting ? 'Salvando...' : (isSmallScreen ? <SaveIcon /> : 'Salvar alterações')}
                            </Button>
                        </Box>
                    )}
                </Box>
            </Paper>
        </Container>
    );
};
