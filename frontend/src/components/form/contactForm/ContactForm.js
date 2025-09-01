'use client';

import React, { useState } from 'react';
import { useFormik } from "formik";
import { TextField, MenuItem, Grid, Box, Typography, Button, Paper } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import * as yup from 'yup';
import styles from '@/components/form/contactForm/contactForm.module.css';
import Link from 'next/link';
import axios from 'axios';
import PhoneMask from '@/components/form/masks/phone/PhoneMask';

const validationSchema = yup.object({
    subject: yup
        .string('Selecione um serviço'),
    fullname: yup
        .string('Insira seu nome completo')
        .required('Campo obrigatório'),
    email: yup
        .string('Isira seu e-mail')
        .email('Insira um e-mail válido')
        .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, 'Insira um e-mail válido')
        .required('Campo obrigatório'),
    phone: yup
        .string('Insira seu número de celular')
        .required('Campo obrigatório'),
    message: yup
        .string('Sua mensagem')
        .required('Insira sua mensagem'),
})

const services = [
    {value: '', label: ''},
    {value: 'Abertura de empresa', label: 'Abertura de empresa'},
    {value: 'Assessoria trabalhista', label: 'Assessoria trabalhista'},
    {value: 'Encerramento de empresa', label: 'Encerramento de empresa'},
    {value: 'Escrituração contábil e tributária', label: 'Escrituração contábil e tributária'},
    {value: 'Obrigações acessórias', label: 'Obrigações acessórias'},
    {value: 'Planejamento estratégico', label: 'Planejamento estratégico'},
    {value: 'Outras opções', label: 'Outras opções'},
];

export default function ContactForm({ showSecondTextField, showSecondButton, secondButtonText, title, subtitle }) {
    const [message, setMessage] = useState('');
    const formik = useFormik({
        initialValues: {
            subject: '',
            fullname: '',
            email: '',
            phone: '',
            message: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values, { resetForm }) => {
            try {
              const response = await axios.post('http://localhost:3001/contact/', values, {
                headers: { 'Content-Type': 'application/json' },
              });
              setMessage('Sua mensagem foi enviada com sucesso! Em breve nossa equipe entrará em contato.');
              resetForm();
            } catch (err) {
              setMessage(err.response.data.message);
            }
        },
    });

    const secondButton = showSecondButton ? (
        <Button
            fullWidth
            variant='contained'
            component={Link}
            href={showSecondButton.link}
            target={showSecondButton.target}
            sx={{
                color: 'var(--cordestaque)',
                bgcolor: 'white',
                border: 'solid 1px var(--cordestaque)',
                '&:hover': {
                    color: 'white',
                    bgcolor: 'var(--corhover)',
                },
            }}
        >
            {secondButtonText}
        </Button>
    ) : null;

    const secondTextField = showSecondTextField ? (
        <TextField
            fullWidth
            id="subject"
            name="subject"
            label="Selecione um serviço"
            select
            variant="standard"
            value= {formik.values.subject}
            onChange= {formik.handleChange}
            slotProps={{
                native: true,
            }}
        >
            {services.map((option) => (
                <MenuItem key={option.value} value={option.value} className={styles['options']}>
                    {option.label}
                </MenuItem>
            ))}
        </TextField>
    ) : null;

    const motionVariants = {
        initial: { opacity: 0, x: 100 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -100 }
    };
    
    return(
        <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
            <Typography variant="h5" component="h1" gutterBottom sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                {title}
            </Typography>
            <Typography variant="h6" component="h2" gutterBottom sx={{ textAlign: { xs: 'center', md: 'justify' } }}>
                {subtitle}
            </Typography>

            <Box component="form" onSubmit={formik.handleSubmit} >
                <AnimatePresence mode='wait'>
                    <motion.div
                        key="step0"
                        variants={motionVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ duration: 0.5 }}
                    >
                        <Grid container spacing={2}>
                            <Grid item size={12}>
                                {secondTextField}
                            </Grid>
                            <Grid item size={12}>
                                <TextField
                                    fullWidth
                                    id="fullname"
                                    name="fullname"
                                    label= "Nome completo"
                                    autoComplete="name"
                                    variant="standard"
                                    value= {formik.values.fullname}
                                    onChange= {formik.handleChange}
                                    onBlur= {formik.handleBlur}
                                    error= {formik.touched.fullname && Boolean(formik.errors.fullname)}
                                    helperText= {formik.touched.fullname && formik.errors.fullname}
                                />
                            </Grid>
                            <Grid item size={12}>
                                <TextField
                                    fullWidth
                                    id="email"
                                    name="email"
                                    label= "E-mail"
                                    autoComplete="email"
                                    variant="standard"
                                    value= {formik.values.email}
                                    onChange= {formik.handleChange}
                                    onBlur= {formik.handleBlur}
                                    error= {formik.touched.email && Boolean(formik.errors.email)}
                                    helperText= {formik.touched.email && formik.errors.email}
                                />
                            </Grid>
                            <Grid item size={12}>
                                <TextField
                                    fullWidth
                                    id="phone"
                                    name="phone"
                                    label= "Telefone"
                                    variant="standard"
                                    autoComplete="tel"
                                    value= {formik.values.phone}
                                    onChange= {formik.handleChange}
                                    onBlur= {formik.handleBlur}
                                    error= {formik.touched.phone && Boolean(formik.errors.phone)}
                                    helperText= {formik.touched.phone && formik.errors.phone}
                                    slotProps={{
                                        input: { inputComponent: PhoneMask }
                                    }}
                                />
                            </Grid>
                            <Grid item size={12}>
                                <TextField
                                    fullWidth
                                    id="message"
                                    name="message"
                                    label="Mensagem"
                                    variant="standard"
                                    autoComplete="off"
                                    multiline
                                    rows={4}
                                    value={formik.values.message}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.message && Boolean(formik.errors.message)}
                                    helperText={formik.touched.message && formik.errors.message}
                                />
                            </Grid>
                            {message ? <h3 style={{ fontSize: '0.84em', color: '#202949', textAlign: 'left'}}>{message}</h3> : ''}
                            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', width: '100%', gap: { xs: 2, md: 3 } }}>
                                {secondButton}
                                <Button 
                                    fullWidth
                                    variant="contained"
                                    type='submit' 
                                    sx={{
                                        bgcolor: 'var(--cordestaque)',
                                        '&:hover': {
                                            bgcolor: 'var(--corhover)',
                                        },
                                    }}
                                >
                                    Enviar
                                </Button>
                            </Box>
                        </Grid>
                    </motion.div>
                </AnimatePresence>
            </Box>
        </Paper>
    );
};
