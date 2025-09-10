'use client';

import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import { TextField, Button, Stepper, Step, StepLabel, Box, Alert, FormControlLabel, Checkbox, Paper, Grid, Typography, InputAdornment, IconButton } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import PhoneMask from '@/components/form/masks/phone/PhoneMask';
import CpfMask from '@/components/form/masks/cpf/CpfMask';
import CnpjMask from '@/components/form/masks/cnpj/CnpjMask';
import CurrencyMask from '@/components/form/masks/currency/CurrencyMask';
import DateMask from '@/components/form/masks/date/DateMask';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { format, parse } from 'date-fns';
import Link from 'next/link';

const steps = ['Dados pessoais', 'Dados da empresa'];

const personalSchema = yup.object({
    nome: yup
        .string()
        .required('Nome é obrigatório'),
    telefonePessoal: yup
        .string()
        .required('Telefone é obrigatório'),
    emailPessoal: yup
        .string('Isira seu e-mail')
        .email('Insira um e-mail válido')
        .required('Campo obrigatório'),
    dataNascimento: yup
        .string()
        .required('Data de nascimento é obrigatória')
        .test('data-valida', 'Data inválida', function (value) {
            if (!value) return false;
            const [day, month, year] = value.split('/').map(Number);
            const date = new Date(year, month - 1, day);
            return (
                date.getFullYear() === year &&
                date.getMonth() === month - 1 &&
                date.getDate() === day
            );
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
    cpf: yup
        .string()
        .required('CPF é obrigatório'),
    senha: yup
        .string()
        .min(6, 'Senha deve ter no mínimo 6 caracteres')
        .required('Senha é obrigatória'),
    confisenha: yup
        .string()
        .oneOf([yup.ref('senha'), null], 'As senhas devem coincidir')
        .required('Confirmação de senha é obrigatória'),
    possuiEmpresa: yup
        .boolean(),
});

const companySchema = yup.object({  
    cnpj: yup
        .string()
        .when('possuiEmpresa', { 
            is: true, 
            then: (schema) => schema.required('CNPJ é obrigatório')
        }),
    nomeFantasia: yup
        .string()
        .when('possuiEmpresa', {
            is: true,
            then: (schema) => schema.required('Nome fantasia é obrigatório')
        }),
    razaoSocial: yup
        .string()
        .when('possuiEmpresa', {
            is: true,
            then: (schema) => schema.required('Razão social é obrigatória')
        }),
    atividadesExercidas: yup
        .string()
        .when('possuiEmpresa', {
            is: true,
            then: (schema) => schema.required('Informe as atividades exercidas')
        }),
    capitalSocial: yup
        .string()
        .when('possuiEmpresa', {
            is: true,
            then: (schema) => schema.required('Capital social é obrigatório')
        }),
    cep: yup
        .string()
        .when('possuiEmpresa', {
            is: true,
            then: (schema) => schema.required('CEP é obrigatório')
        }),
    endereco: yup
        .string()
        .when('possuiEmpresa', {
            is: true,
            then: (schema) => schema.required('Endereço é obrigatório')
        }),
    numeroEmpresa: yup
        .string()
        .when('possuiEmpresa', {
            is: true,
            then: (schema) => schema.required('Número é obrigatório')
        }),
    complementoEmpresa: yup
        .string(),
    emailEmpresa: yup
        .string()
        .when('possuiEmpresa', {
            is: true,
            then: (schema) => schema.email('Email inválido').required('Email da empresa é obrigatório')
        }),
    telefoneEmpresa: yup
        .string()
        .when('possuiEmpresa', {
            is: true,
            then: (schema) => schema.required('Telefone da empresa é obrigatório')
        }),
    socios: yup
        .string(),
});

export default function Signup() {
    const [step, setStep] = useState(0);
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfPassword, setShowConfPassword] = useState(false);
    const router = useRouter();

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
            nome: '',
            telefonePessoal: '',
            emailPessoal: '',
            dataNascimento: '',
            cpf: '',
            senha: '',
            confisenha: '',
            possuiEmpresa: false,
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
        validationSchema: step === 0 ? personalSchema : companySchema,
        validateOnChange: false,
        validateOnBlur: true,
        onSubmit: async (values, { resetForm }) => {
            try {
                await (step === 0 ? personalSchema : companySchema).validate(values, { abortEarly: false });
                
                const userValues = {
                    nome: values.nome,
                    telefonePessoal: values.telefonePessoal,
                    emailPessoal: values.emailPessoal,
                    dataNascimento: values.dataNascimento ? format(parse(values.dataNascimento, 'dd/MM/yyyy', new Date()), 'yyyy-MM-dd') : null,
                    cpf: values.cpf,
                    senha: values.senha,
                    possuiEmpresa: values.possuiEmpresa,
                };

                const userResponse = await axios.post('/api/users', userValues, { 
                    withCredentials: true,
                    headers: { 'Content-Type': 'application/json' },
                });
                console.log("Resposta do backend:", userResponse.data);
                const { id: userId, token } = userResponse.data;
                console.log("Token recebido:", token);
                
                if (values.possuiEmpresa) {
                    const companyValues = {
                        cnpj: values.cnpj,
                        nomeFantasia: values.nomeFantasia,
                        razaoSocial: values.razaoSocial,
                        atividadesExercidas: values.atividadesExercidas,
                        capitalSocial: Number(values.capitalSocial.replace(/\./g, '').replace(',', '.')) || 0,
                        cep: values.cep,
                        endereco: values.endereco,
                        numeroEmpresa: values.numeroEmpresa,
                        complementoEmpresa: values.complementoEmpresa,
                        emailEmpresa: values.emailEmpresa,
                        telefoneEmpresa: values.telefoneEmpresa,
                        socios: values.socios,
                        userId, 
                    };
                    await axios.post(`/api/users/${userId}/companies`, companyValues, { 
                        withCredentials: true,
                        headers: { 'Content-Type': 'application/json' },
                    });
                }
                
                setMessage('Cadastro realizado com sucesso!');
                setIsSuccess(true);
                resetForm();
                setTimeout(() => {
                    router.push('/login'); 
                }, 2000);
            } catch (error) {
                console.error("Erro no cadastro:", error);
                setMessage(error.response?.data?.message || 'Erro no cadastro.');
                setIsSuccess(false);
                if (error.inner) {
                    const fieldErrors = {};
                    error.inner.forEach(err => {
                        fieldErrors[err.path] = err.message;
                    });
                    formik.setErrors(fieldErrors);
                }
            }
        },
    });

    const handleNext = async () => {
        try {
            await personalSchema.validate(formik.values, { abortEarly: false });
            if (formik.values.possuiEmpresa) {
                setStep(prev => prev + 1);
            } else {
                formik.handleSubmit();
            }
        } catch (validationErrors) {
            const fieldErrors = {};
            validationErrors.inner.forEach(error => {
                fieldErrors[error.path] = true;
            });
            formik.setTouched(fieldErrors);
        }
    };

    const handleBack = () => setStep((prev) => prev - 1);

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleClickShowConfPassword = () => setShowConfPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const motionVariants = {
        initial: { opacity: 0, x: 100 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -100 }
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
            <Box sx={{ mx: 'auto', textAlign: 'center', width: { xs: '100%', md: '50%' } }}>
                <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
                    <Stepper activeStep={step} alternativeLabel>
                        {steps.map((label) => (
                        <Step key={label}><StepLabel>{label}</StepLabel></Step>
                        ))}
                    </Stepper>
                    <AnimatePresence mode="wait">
                        {message && (
                            <motion.div
                                key="message"
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5 }}
                            >
                                <Box sx={{ mt: 2 }}>
                                    <Alert severity={isSuccess ? 'success' : 'error'}>{message}</Alert>
                                </Box>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <Box component="form" onSubmit={formik.handleSubmit} >
                        <AnimatePresence mode="wait">
                            {step === 0 && (
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
                                            <TextField
                                                fullWidth
                                                margin="normal"
                                                id="nome"
                                                name="nome"
                                                label="Nome completo"
                                                value={formik.values.nome}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={formik.touched.nome && Boolean(formik.errors.nome)}
                                                helperText={formik.touched.nome && formik.errors.nome}
                                            />
                                        </Grid>
                                        <Grid item size={{ xs: 12, md: 6 }}>
                                            <TextField
                                                fullWidth
                                                margin="normal"
                                                id="emailPessoal"
                                                name="emailPessoal"
                                                label="Email pessoal"
                                                value={formik.values.emailPessoal}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={formik.touched.emailPessoal && Boolean(formik.errors.emailPessoal)}
                                                helperText={formik.touched.emailPessoal && formik.errors.emailPessoal}
                                            />
                                        </Grid>
                                        <Grid item size={{ xs: 12, md: 6 }}>
                                            <TextField
                                                fullWidth
                                                margin="normal"
                                                id="telefonePessoal"
                                                name="telefonePessoal"
                                                label="Telefone pessoal"
                                                value={formik.values.telefonePessoal}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
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
                                                margin="normal"
                                                id="cpf"
                                                name="cpf"
                                                label="CPF"
                                                value={formik.values.cpf}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
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
                                                margin="normal"
                                                id="dataNascimento"
                                                name="dataNascimento"
                                                label="Data de nascimento"
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
                                            <TextField
                                                fullWidth
                                                margin="normal"
                                                id="senha"
                                                name="senha"
                                                type={showPassword ? 'text' : 'password'}
                                                label="Senha"
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
                                        <Grid item size={{ xs: 12, md: 6 }}>
                                            <TextField
                                                fullWidth
                                                margin="normal"
                                                id="confisenha"
                                                name="confisenha"
                                                type={showConfPassword ? 'text' : 'password'}
                                                label="Confirme sua senha"
                                                value={formik.values.confisenha}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={formik.touched.confisenha && Boolean(formik.errors.confisenha)}
                                                helperText={formik.touched.confisenha && formik.errors.confisenha}
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                aria-label={showPassword ? 'esconder senha' : 'mostrar senha'}
                                                                onClick={handleClickShowConfPassword}
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
                                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center'}}>
                                            <FormControlLabel
                                                control={<Checkbox name="possuiEmpresa" checked={formik.values.possuiEmpresa} onChange={formik.handleChange} />}
                                                label="Possuo empresa"
                                            />
                                            <Button
                                                variant='contained'
                                                onClick={handleNext}
                                                sx={{
                                                    bgcolor: 'var(--cordestaque)',
                                                    '&:hover': {
                                                        bgcolor: 'var(--corhover)',
                                                    },
                                                }}
                                            >
                                                {formik.values.possuiEmpresa ? 'Próximo' : 'Cadastrar'}
                                            </Button>
                                        </Box>
                                    </Grid>
                                </motion.div>
                            )}
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    variants={motionVariants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    transition={{ duration: 0.5 }}
                                >
                                    {formik.values.possuiEmpresa && (
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
                                                    onBlur={formik.handleBlur}
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
                                                    onBlur={formik.handleBlur}
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
                                                    onBlur={formik.handleBlur}
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
                                                    onBlur={formik.handleBlur}
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
                                                    onBlur={formik.handleBlur}
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
                                                    onBlur={formik.handleBlur}
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
                                                    onBlur={formik.handleBlur}
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
                                                    onBlur={formik.handleBlur}
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
                                                    onBlur={formik.handleBlur}
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
                                                    onBlur={formik.handleBlur}
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
                                                    onBlur={formik.handleBlur}
                                                    error={formik.touched.telefoneEmpresa && Boolean(formik.errors.telefoneEmpresa)}
                                                    helperText={formik.touched.telefoneEmpresa && formik.errors.telefoneEmpresa}
                                                    slotProps={{
                                                        input: { inputComponent: PhoneMask }
                                                    }}
                                                />
                                            </Grid>
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
                                                    onBlur={formik.handleBlur}
                                                    error={formik.touched.socios && Boolean(formik.errors.socios)}
                                                    helperText={formik.touched.socios && formik.errors.socios}
                                                />
                                            </Grid>
                                            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', width: '100%', gap: { xs: 2, md: 10 }}}>
                                                <Button
                                                    fullWidth
                                                    variant='contained'
                                                    onClick={handleBack}
                                                    sx={{
                                                        color: 'var(--cordestaque)',
                                                        bgcolor: 'white',
                                                        border: '1px solid var(--cordestaque)',
                                                        width: '100%',
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
                                        </Grid>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Box>
                </Paper>
                <Typography variant="body2" sx={{ mt: 2 }} align='left'>
                    Já possui uma conta?
                    <Link href="/login">
                        <strong> Faça o login</strong>
                    </Link>
                </Typography>
            </Box>
        </Box>
    );
}