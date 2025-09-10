'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; 
import { useFormik } from "formik";
import { TextField, Grid, Box, Typography, Button, Paper, InputAdornment, IconButton } from '@mui/material';
import * as yup from 'yup';
import axios from 'axios';
import { motion } from "framer-motion";
import Cookies from 'js-cookie';
import Link from 'next/link';
import Image from 'next/image';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const validationSchema = yup.object({
    emailPessoal: yup
        .string('E-mail')
        .email('Insira um e-mail válido')
        .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 'Insira um e-mail válido')
        .required('Campo obrigatório'),
    senha: yup
        .string('Senha')
        .required('Campo obrigatório'),
});

export default function Login() {
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const router = useRouter();

    const formik = useFormik({
        initialValues: {
            emailPessoal: '',
            senha: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values, { resetForm }) => {
            try {
                const response = await axios.post('/api/users/login', values, { 
                    withCredentials: true,
                    headers: { 'Content-Type': 'application/json' },
                });
                const { usuario, token } = response.data;

                Cookies.set('nome', usuario.nome, { secure: true, sameSite: 'strict' });
                Cookies.set('tipo', usuario.tipo, { secure: true, sameSite: 'strict' });
                Cookies.set('usuario_id', usuario.id, { secure: true, sameSite: 'strict' });  

                console.log(`ID do usuário: ${usuario.id}`);
                console.log(`ID da empresa: ${usuario.empresa_id || 'Nenhuma empresa associada'}`);
                console.log(`Token do usuário: ${token}`);
                resetForm();
                
                router.push('/dashboard');              
            } catch (err) {
                console.log('Erro:', err);
                if (err.response) {
                    if (err.response.status === 401) {
                        setMessage('Credenciais inválidas');
                    } else {
                        setMessage('Erro ao tentar fazer login');
                    }
                } else {
                    setMessage('Erro ao tentar fazer login');
                }
            }
        },   
    });

    const renderErrorMessage = () => {
        return <h3 style={{ fontSize: '0.84em', color: '#202949', textAlign: 'left' }}>{message}</h3>;
    };

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    return (
        <Box
            component="main" 
            sx={{ 
                display: 'flex', 
                justifyContent: 'space-around', 
                alignItems: 'center', 
                minHeight: '80vh', 
                p: 4
            }}
        >
            <Grid container spacing={2} alignItems="stretch" justifyContent="center">
                <Grid item size={{ xs: 12, md: 6 }}>
                    <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
                        <motion.div
                            initial={{ opacity: 0, x: -100 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Typography variant="h5" component="h2" align="center">
                                Seja bem-vindo(a) ao portal do cliente!
                            </Typography>
                            <Box component="form" onSubmit={formik.handleSubmit} >
                                <Grid container spacing={2}>
                                    <Grid item size={12}>
                                        <TextField
                                            fullWidth
                                            id="emailPessoal"
                                            name="emailPessoal"
                                            label="E-mail"
                                            autoComplete="email"
                                            variant="standard"
                                            value={formik.values.emailPessoal}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.emailPessoal && Boolean(formik.errors.emailPessoal)}
                                            helperText={formik.touched.emailPessoal && formik.errors.emailPessoal}
                                        />
                                    </Grid>
                                    <Grid item size={12}>
                                        <TextField
                                            fullWidth
                                            id="senha"
                                            name="senha"
                                            type={showPassword ? 'text' : 'password'}
                                            label="Senha"
                                            variant="standard"
                                            autoComplete="current-password"
                                            value={formik.values.senha}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.senha && Boolean(formik.errors.senha)}
                                            helperText={formik.touched.senha && formik.errors.senha}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label={showPassword ? 'esconder senha' : 'mostrar senha'}
                                                            onClick={handleClickShowPassword}
                                                            onMouseDown={handleMouseDownPassword}
                                                            edge="end"
                                                        >
                                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>
                                    <Grid item size={12}>
                                        {renderErrorMessage()}
                                    </Grid>
                                    <Grid item size={12}>
                                        <Button
                                            variant="contained"
                                            fullWidth
                                            type="submit"
                                            sx={{
                                                bgcolor: 'var(--cordestaque)',
                                                '&:hover': {
                                                    bgcolor: 'var(--corhover)',
                                                },
                                            }}
                                        >
                                            Entrar
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Box>
                        </motion.div>
                    </Paper>
                    <Typography variant="body2" sx={{ mt: 2 }} align='left'>
                        Ainda não tem uma conta?
                        <Link href="/signup">
                            <strong> Cadastre-se</strong>
                        </Link>
                    </Typography>
                </Grid>
                <Grid item size={6}>
                    <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                        <Image src="/images/login.png" alt="Mãos mexendo no celular" width={400} height={400} layout="responsive" objectFit="contain"/>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}
