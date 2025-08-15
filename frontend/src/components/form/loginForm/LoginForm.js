'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; 
import { useFormik } from "formik";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import * as yup from 'yup';
import styles from '@/components/form/loginForm/loginForm.module.css';
import Link from 'next/link';
import axios from 'axios';
import { motion } from "framer-motion";
import ButtonComponent from '@/components/button/Button';

const validationSchema = yup.object({
    email: yup
        .string('E-mail')
        .email('Insira um e-mail válido')
        .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 'Insira um e-mail válido')
        .required('Campo obrigatório'),
    senha: yup
        .string('Senha')
        .required('Campo obrigatório'),
});

export default function LoginForm() {
    const [message, setMessage] = useState('');
    const router = useRouter();

    const formik = useFormik({
        initialValues: {
            email: '',
            senha: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values, { resetForm }) => {
            try {
                const response = await axios.post('http://localhost:3001/login', values, {
                    headers: { 'Content-Type': 'application/json' },
                });
                const { token, usuario } = response.data;

                localStorage.setItem('token', token);
                localStorage.setItem('nome', usuario.nome);
                localStorage.setItem('tipo', usuario.tipo);
                localStorage.setItem('usuario_id', usuario.id);
                

                console.log(`ID do usuário: ${usuario.id}`);
                console.log(`ID da empresa: ${usuario.empresa_id || 'Nenhuma empresa associada'}`);
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

    return (
        <>
            <motion.div
                className={styles['loginform']}
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className={styles['title']}>Seja bem-vindo(a) ao portal do cliente!</h2>
                <form onSubmit={formik.handleSubmit} className={styles['form']}>
                    <TextField
                        id="email"
                        name="email"
                        label="E-mail"
                        autoComplete="email"
                        variant="standard"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email}
                    />
                    <TextField
                        id="senha"
                        name="senha"
                        label="Senha"
                        variant="standard"
                        autoComplete="password"
                        type="password"
                        value={formik.values.senha}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.senha && Boolean(formik.errors.senha)}
                        helperText={formik.touched.senha && formik.errors.senha}
                    />
                    {renderErrorMessage()}
                    <ButtonComponent type="action" label="Entrar" onClick={formik.handleSubmit} />
                </form>
            </motion.div>
        </>
    );
}