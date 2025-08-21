'use client';

import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import { TextField, Button, Stepper, Step, StepLabel, Box, Alert, FormControlLabel, Checkbox, Divider } from '@mui/material';
import styles from '@/components/form/signupForm/signupForm.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import PhoneMask from '@/components/form/masks/phone/PhoneMask';
import CpfMask from '@/components/form/masks/cpf/CpfMask';
import CnpjMask from '@/components/form/masks/cnpj/CnpjMask';
import CurrencyMask from '@/components/form/masks/currency/CurrencyMask';
import DateMask from '@/components/form/masks/date/DateMask';

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
        .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, 'Insira um e-mail válido')
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
});

const companySchema = yup.object({
    possuiEmpresa: yup
        .boolean(),
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
    nomeSocios: yup
        .string(),
});

export default function SignupForm() {
    const [step, setStep] = useState(0);
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
            token: '',
            userId: '',
        },
        validationSchema: step === 0 ? personalSchema : companySchema,
        validateOnChange: false,
        validateOnBlur: true,
            onSubmit: async (values, { resetForm }) => {
            try {
                const companyData = {
                    ...values,
                    userId: values.userId,
                }

                if (companyData.capitalSocial) {
                    companyData.capitalSocial = companyData.capitalSocial.replace(/\./g, '').replace(',', '.');
                }

                const companyResponse = await axios.post('http://localhost:3001/company/register', companyData, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${values.token}`
                    },
                });
                console.log('Empresa cadastrada com sucesso:', companyResponse.data);

                setMessage('Cadastro realizado com sucesso!');
                setIsSuccess(true);
                formik.resetForm();
                setStep(0);
            } catch (error) {
                setMessage(error.response?.data?.message || 'Erro no cadastro.');
                setIsSuccess(false);
            }
            }
    });

    const handleNext = async () => {
        // 1. Validar o formulário do passo atual ANTES do try/catch
        try {
            await (step === 0 ? personalSchema : companySchema).validate(formik.values, { abortEarly: false });
        } catch (validationErrors) {
            // Se a validação falhar, define os campos tocados e retorna
            const fieldErrors = {};
            if (validationErrors.inner) { // Adicione esta verificação de segurança
                validationErrors.inner.forEach(error => {
                    fieldErrors[error.path] = true;
                });
            }
            formik.setTouched(fieldErrors);
            return; // Retorna para interromper a função
        }

        if (step === 0) {
            // Se o usuário não tiver empresa, chame uma função de cadastro separada
            if (!formik.values.possuiEmpresa) {
                await handleCadastroUsuarioSemEmpresa(formik.values);
                return;
            }

            // Se o usuário tiver empresa, faça o cadastro e avance
            try {
                const formattedValues = { ...formik.values };
                if (formattedValues.dataNascimento) {
                    const [day, month, year] = formattedValues.dataNascimento.split('/');
                    formattedValues.dataNascimento = `${year}-${month}-${day}`;
                }
                formattedValues.cpf = formattedValues.cpf.replace(/\D/g, '');
                formattedValues.telefonePessoal = formattedValues.telefonePessoal.replace(/\D/g, '');
                
                const userResponse = await axios.post('http://localhost:3001/user/register', formattedValues, {
                    headers: { 'Content-Type': 'application/json' },
                });

                const { token, id } = userResponse.data;
                formik.setFieldValue('userId', id);
                formik.setFieldValue('token', token);

                setStep(prev => prev + 1);
            } catch (error) {
                setMessage(error.response?.data?.message || 'Erro ao cadastrar usuário.');
                setIsSuccess(false);
            }
        }
    };

    const handleCadastroUsuarioSemEmpresa = async (values) => {
        try {
            const formattedValues = { ...values };
            if (formattedValues.dataNascimento) {
                const [day, month, year] = formattedValues.dataNascimento.split('/');
                formattedValues.dataNascimento = `${year}-${month}-${day}`;
            }

            const userResponse = await axios.post('http://localhost:3001/user/register', formattedValues, {
                headers: { 'Content-Type': 'application/json' },
            });

            setMessage('Cadastro de usuário realizado com sucesso!');
            setIsSuccess(true);
            formik.resetForm();
            setStep(0);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Erro no cadastro.');
            setIsSuccess(false);
        }
    };

    const handleBack = () => setStep((prev) => prev - 1);

    const motionVariants = {
        initial: { opacity: 0, x: 100 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -100 }
    };

    return (
        <Box className={styles.container}>
        <Stepper activeStep={step} alternativeLabel>
            {steps.map((label) => (
            <Step key={label}><StepLabel>{label}</StepLabel></Step>
            ))}
        </Stepper>

        {message && (
            <Box sx={{ mt: 2 }}>
            <Alert severity={isSuccess ? 'success' : 'error'}>{message}</Alert>
            </Box>
        )}

        <form onSubmit={formik.handleSubmit}>
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
                    <TextField 
                        fullWidth 
                        margin="normal" 
                        id="nome" 
                        name="nome" 
                        label="Nome completo"
                        value={formik.values.nome} 
                        onChange={formik.handleChange}
                        error={formik.touched.nome && Boolean(formik.errors.nome)}
                        helperText={formik.touched.nome && formik.errors.nome} 
                    />

                    <div className={styles.formfield}>
                        <TextField
                            fullWidth
                            margin="normal"
                            id="emailPessoal"
                            name="emailPessoal"
                            label="Email pessoal"
                            value={formik.values.emailPessoal}
                            onChange={formik.handleChange}
                            error={formik.touched.emailPessoal && Boolean(formik.errors.emailPessoal)}
                            helperText={formik.touched.emailPessoal && formik.errors.emailPessoal}
                        />

                        <TextField
                            fullWidth
                            margin="normal"
                            id="telefonePessoal"
                            name="telefonePessoal"
                            label="Telefone pessoal"
                            value={formik.values.telefonePessoal}
                            onChange={formik.handleChange}
                            error={formik.touched.telefonePessoal && Boolean(formik.errors.telefonePessoal)}
                            helperText={formik.touched.telefonePessoal && formik.errors.telefonePessoal}
                            slotProps={{
                                input: { inputComponent: PhoneMask }
                            }}
                        />
                    </div>

                    <div className={styles.formfield}>
                        <TextField
                            fullWidth
                            margin="normal"
                            id="cpf"
                            name="cpf"
                            label="CPF"
                            value={formik.values.cpf}
                            onChange={formik.handleChange}
                            error={formik.touched.cpf && Boolean(formik.errors.cpf)}
                            helperText={formik.touched.cpf && formik.errors.cpf}
                            slotProps={{
                                input: { inputComponent: CpfMask }
                            }}
                        />

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
                    </div>

                    <div className={styles.formfield}>
                        <TextField
                            fullWidth
                            margin="normal"
                            id="senha"
                            name="senha"
                            type="password"
                            label="Senha"
                            value={formik.values.senha}
                            onChange={formik.handleChange}
                            error={formik.touched.senha && Boolean(formik.errors.senha)}
                            helperText={formik.touched.senha && formik.errors.senha} />

                        <TextField
                            fullWidth
                            margin="normal"
                            id="confisenha"
                            name="confisenha"
                            type="password"
                            label="Confirme sua senha"
                            value={formik.values.confisenha}
                            onChange={formik.handleChange}
                            error={formik.touched.confisenha && Boolean(formik.errors.confisenha)}
                            helperText={formik.touched.confisenha && formik.errors.confisenha}
                        />
                    </div>
                
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                        <FormControlLabel
                        control={<Checkbox name="possuiEmpresa" checked={formik.values.possuiEmpresa} onChange={formik.handleChange} />}
                        label="Possuo empresa"
                        />
                        <Button variant='contained' onClick={handleNext} className={styles.nextButton}>
                        {formik.values.possuiEmpresa ? 'Próximo' : 'Cadastrar'}
                        </Button>
                    </Box>
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
                        <>
                        <div className={styles.formfield}>
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
                        </div>

                        <div className={styles.formfield}>
                            <TextField
                                fullWidth
                                margin="normal"
                                id="razaoSocial"
                                name="razaoSocial"
                                label="Razão social"
                                value={formik.values.razaoSocial}
                                onChange={formik.handleChange}
                                error={formik.touched.razaoSocial && Boolean(formik.errors.razaoSocial)}
                                helperText={formik.touched.razaoSocial && formik.errors.razoSocial}
                            />
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
                        </div>

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
                            helperText={formik.touched.cep && formik.errors.cep} />

                        <div className={styles.formfield}>
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
                            <TextField
                                margin="normal"
                                id="numeroEmpresa"
                                name="numeroEmpresa"
                                label="Número"
                                value={formik.values.numeroEmpresa}
                                onChange={formik.handleChange}
                                error={formik.touched.numeroEmpresa && Boolean(formik.errors.numeroEmpresa)}
                                helperText={formik.touched.numeroEmpresa && formik.errors.numeroEmpresa}
                            />

                            <TextField 
                                fullWidth 
                                margin="normal" 
                                id="complementoEmpresa" 
                                name="complementoEmpresa" 
                                label="Complemento"
                                value={formik.values.complementoEmpresa} 
                                onChange={formik.handleChange} 
                            />
                        </div>

                        <div className={styles.formfield}>
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
                        </div>

                        <Divider style={{ margin: '10px' }}/>
                        <p>Caso possua, informe o nome dos sócios.</p>
                        <TextField
                            fullWidth
                            margin="normal"
                            id="socios"
                            name="socios"
                            label="Nome dos sócios"
                            value={formik.values.nomeSocios}
                            onChange={formik.handleChange}
                            error={formik.touched.nomeSocios && Boolean(formik.errors.nomeSocios)}
                            helperText={formik.touched.nomeSocios && formik.errors.nomeSocios}
                        />
                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                            <Button variant='contained' onClick={handleBack} className={styles.backButton}>
                            Voltar
                            </Button>
                            <Button variant="contained" type="submit" disabled={formik.isSubmitting} className={styles.sendButton}>
                            {formik.isSubmitting ? 'Enviando...' : 'Cadastrar'}
                            </Button>
                        </Box>
                    </>
                )}
                </motion.div>
            )}
            </AnimatePresence>
        </form>
        </Box>
    );
}
