'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { useTheme, useMediaQuery, Checkbox, FormHelperText, FormControlLabel, MenuItem, Select, InputLabel, FormControl, Container, Box, CircularProgress, Alert, Typography, Button, Grid, Paper, TextField } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import { useFormik } from 'formik';
import * as yup from 'yup';
import PhoneMask from '@/components/form/masks/phone/PhoneMask';
import CpfMask from '@/components/form/masks/cpf/CpfMask';
import CurrencyMask from '@/components/form/masks/currency/CurrencyMask';
import DateMask from '@/components/form/masks/date/DateMask';
import { format, parse } from 'date-fns';
import Cookies from 'js-cookie';

const getLoggedInUserId = () => Cookies.get('usuario_id');

const validationSchema = yup.object({
    nome: yup.string('Nome completo').required('Campo obrigatório'),
    email: yup.string('E-mail').email('Insira um e-mail válido').required('Campo obrigatório'),
    telefone: yup.string('Telefone').required('Campo obrigatório'),
    sexo: yup.string('Sexo').required('Campo obrigatório'),
    corEtnia: yup.string('Cor/Etnia').required('Campo obrigatório'),
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
    localNascimento: yup.string('Local do nascimento').required('Campo obrigatório'),
    cpf: yup.string('CPF').required('Campo obrigatório'),
    rg: yup.string().notRequired(),
    orgaoExpedidor: yup.string().notRequired(),
    dataRg: yup.string().notRequired(),
    cep: yup.string('CEP').required('Campo obrigatório'),
    endereco: yup.string('Endereço').required('Campo obrigatório'),
    numeroCasa: yup.string('Número').required('Campo obrigatório'),
    complementoCasa: yup.string().notRequired(),
    bairro: yup.string('Bairro').required('Campo obrigatório'),
    cidade: yup.string('Cidade').required('Campo obrigatório'),
    estado: yup.string('Estado').required('Campo obrigatório'),
    nomeMae: yup.string('Nome da mãe').required('Campo obrigatório'),
    nomePai: yup.string().notRequired(),
    estadoCivil: yup.string('Estado civil').required('Campo obrigatório'),
    nomeConjuge: yup.string().when('estadoCivil', {
        is: (val) => ['Casado', 'União estável'].includes(val),
        then: (schema) => schema.required('Campo obrigatório para estado civil "Casado" ou "União Estável"'),
        otherwise: (schema) => schema.notRequired(),
    }),
    escolaridade: yup.string('Escolaridade').required('Campo obrigatório'),
    pis: yup.string('Número do PIS').required('Campo obrigatório'),
    numeroCt: yup.string('Número da carteira de trabalho').required('Campo obrigatório'),
    serie: yup.string('Série').required('Campo obrigatório'),
    dataCt: yup.string().required('Campo obrigatório'),
    carteiraDigital: yup.boolean().notRequired(),
    tituloEleitoral: yup.string().notRequired(),
    zona: yup.string().notRequired(),
    secao: yup.string().notRequired(),
    funcao: yup.string('Função').required('Campo obrigatório'),
    dataAdmissao: yup.string().required('Campo obrigatório'),
    salario: yup.string('Salário').required('Campo obrigatório'),
    contratoExperiencia: yup.boolean().notRequired(),
    horarios: yup.string('Horário de trabalho').required('Campo obrigatório'),
    insalubridade: yup.boolean().notRequired(),
    periculosidade: yup.boolean().notRequired(),
    quebraDeCaixa: yup.boolean().notRequired(),
    valeTransporte: yup.boolean().notRequired(),
    quantidadeVales: yup.number().nullable().notRequired().when('valeTransporte', {
        is: true,
        then: (schema) => schema.required('Quantidade de vales é obrigatória').min(1, 'Quantidade deve ser no mínimo 1'),
    }),
});

export default function EmployeeAddPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const loggedUserId = getLoggedInUserId();
    const urlUserId = searchParams.get('userId');
    const userId = urlUserId || loggedUserId;
    const companyId = searchParams.get('companyId');

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
                formik.setFieldValue('bairro', res.data.bairro || '');
                formik.setFieldValue('cidade', res.data.localidade || '');
                formik.setFieldValue('estado', res.data.uf || '');
            }
        } catch (err) {
            console.error('Erro ao buscar CEP:', err);
        }
    };

    const formik = useFormik({
        initialValues: {
            nome: '', email: '', telefone: '', sexo: '', corEtnia: '',
            dataNascimento: '', localNascimento: '', cpf: '', rg: '',
            orgaoExpedidor: '', dataRg: '', cep: '', endereco: '',
            numeroCasa: '', complementoCasa: '', bairro: '', cidade: '',
            estado: '', nomeMae: '', nomePai: '', escolaridade: '',
            estadoCivil: '', nomeConjuge: '', pis: '', numeroCt: '',
            serie: '', dataCt: '', carteiraDigital: false, tituloEleitoral: '',
            zona: '', secao: '', funcao: '', dataAdmissao: '',
            salario: '', contratoExperiencia: false, horarios: '',
            insalubridade: false, periculosidade: false, quebraDeCaixa: false,
            valeTransporte: false, quantidadeVales: 0
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            setIsSubmitting(true);
            try {
                if (!userId || !companyId) {
                    setError('IDs de usuário e da empresa não fornecidos na URL. Não é possível cadastrar o funcionário.');
                    setIsSubmitting(false);
                    return;
                }

                const valuesToSend = { ...values };

                if (valuesToSend.salario) {
                    const cleanSalario = valuesToSend.salario.replace('R$', '').replace(/\./g, '').replace(',', '.').trim();
                    valuesToSend.salario = parseFloat(cleanSalario);
                }

                const dateFields = ['dataNascimento', 'dataRg', 'dataCt', 'dataAdmissao'];
                dateFields.forEach(field => {
                    if (valuesToSend[field]) {
                        const parsedDate = parse(valuesToSend[field], 'dd/MM/yyyy', new Date());
                        valuesToSend[field] = format(parsedDate, 'yyyy-MM-dd');
                    }
                });

                console.log('Dados a serem enviados:', valuesToSend);

                await axios.post(`http://localhost:3001/users/${userId}/companies/${companyId}/employees`, valuesToSend, { withCredentials: true });
                const redirectPath = `/dashboard/management/employee?companyId=${companyId}&userId=${userId}`;
                router.push(redirectPath);
            } catch (err) {
                console.error('Erro ao cadastrar funcionário:', err);
                setError('Falha ao cadastrar o funcionário.');
            } finally {
                setIsSubmitting(false);
            }
        },
    });

    const handleCancel = () => {
        const redirectPath = `/dashboard/management/employee?companyId=${companyId}&userId=${userId}`;
        router.push(redirectPath);
    };

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
                    Adicionar funcionário
                </Typography>
                <Box component="form" onSubmit={formik.handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <TextField 
                                fullWidth 
                                name="nome" 
                                label="Nome Completo" 
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
                                name="email" 
                                label="E-mail" 
                                value={formik.values.email} 
                                onChange={formik.handleChange} 
                                onBlur={formik.handleBlur} 
                                error={formik.touched.email && Boolean(formik.errors.email)} 
                                helperText={formik.touched.email && formik.errors.email} 
                            />
                        </Grid>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <TextField 
                                fullWidth 
                                name="telefone" 
                                label="Telefone" 
                                value={formik.values.telefone} 
                                onChange={formik.handleChange} 
                                onBlur={formik.handleBlur} 
                                error={formik.touched.telefone && Boolean(formik.errors.telefone)} 
                                helperText={formik.touched.telefone && formik.errors.telefone} 
                                slotProps={{ input: {inputComponent: PhoneMask} }}
                            />
                        </Grid>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <FormControl 
                                fullWidth 
                                error={formik.touched.sexo && Boolean(formik.errors.sexo)}
                            >
                                <InputLabel>Sexo</InputLabel>
                                <Select name="sexo" value={formik.values.sexo} label="Sexo" onChange={formik.handleChange} onBlur={formik.handleBlur}>
                                    <MenuItem value=""><em>Selecione</em></MenuItem>
                                    <MenuItem value="Masculino">Masculino</MenuItem>
                                    <MenuItem value="Feminino">Feminino</MenuItem>
                                    <MenuItem value="Prefiro não informar">Prefiro não informar</MenuItem>
                                </Select>
                                <FormHelperText>{formik.touched.sexo && formik.errors.sexo}</FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <FormControl 
                                fullWidth 
                                error={formik.touched.corEtnia && Boolean(formik.errors.corEtnia)}
                            >
                                <InputLabel>Cor/Etnia</InputLabel>
                                <Select name="corEtnia" value={formik.values.corEtnia} label="Cor/Etnia" onChange={formik.handleChange} onBlur={formik.handleBlur}>
                                    <MenuItem value=""><em>Selecione</em></MenuItem>
                                    <MenuItem value="Branco">Branco</MenuItem>
                                    <MenuItem value="Pardo">Pardo</MenuItem>
                                    <MenuItem value="Negro">Negro</MenuItem>
                                    <MenuItem value="Amarelo">Amarelo</MenuItem>
                                    <MenuItem value="Indígena">Indígena</MenuItem>
                                </Select>
                                <FormHelperText>{formik.touched.corEtnia && formik.errors.corEtnia}</FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                name="dataNascimento"
                                label="Data nascimento"
                                value={formik.values.dataNascimento}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.dataNascimento && Boolean(formik.errors.dataNascimento)}
                                helperText={formik.touched.dataNascimento && formik.errors.dataNascimento}
                                slotProps={{ 
                                    shrink: true,
                                    input: {inputComponent: DateMask} 
                                }}
                            />
                        </Grid>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <TextField 
                                fullWidth 
                                name="localNascimento" 
                                label="Local de Nascimento" 
                                value={formik.values.localNascimento} 
                                onChange={formik.handleChange} 
                                onBlur={formik.handleBlur} 
                                error={formik.touched.localNascimento && Boolean(formik.errors.localNascimento)} 
                                helperText={formik.touched.localNascimento && formik.errors.localNascimento} 
                            />
                        </Grid>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <TextField 
                                fullWidth 
                                name="cpf" 
                                label="CPF" 
                                value={formik.values.cpf} 
                                onChange={formik.handleChange} 
                                onBlur={formik.handleBlur} 
                                error={formik.touched.cpf && Boolean(formik.errors.cpf)} 
                                helperText={formik.touched.cpf && formik.errors.cpf} 
                                slotProps={{ input: {inputComponent: CpfMask} }}
                            />
                        </Grid>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth 
                                name="rg" 
                                label="RG" 
                                value={formik.values.rg} 
                                onChange={formik.handleChange} 
                                onBlur={formik.handleBlur} 
                                error={formik.touched.rg && Boolean(formik.errors.rg)} 
                                helperText={formik.touched.rg && formik.errors.rg} 
                            />
                        </Grid>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <FormControl 
                                fullWidth 
                                error={formik.touched.orgaoExpedidor && Boolean(formik.errors.orgaoExpedidor)}
                            >
                                <InputLabel>Órgão expedidor</InputLabel>
                                <Select name="orgaoExpedidor" value={formik.values.orgaoExpedidor} label="Órgão expedidor" onChange={formik.handleChange} onBlur={formik.handleBlur}>
                                    <MenuItem value=""><em>Selecione</em></MenuItem>
                                    <MenuItem value="SSP">Secretaria de Segurança Pública (SSP)</MenuItem>
                                    <MenuItem value="DETRAN">Departamento Estadual de Trânsito (DETRAN)</MenuItem>
                                    <MenuItem value="IFP">Instituto de Identificação Félix Pacheco (IFP)</MenuItem>
                                    <MenuItem value="IGP">Instituto Geral de Perícias (IGP)</MenuItem>
                                    <MenuItem value="PC">Polícia Civil (PC)</MenuItem>
                                    <MenuItem value="PM">Polícia Militar (PM)</MenuItem>
                                    <MenuItem value="MTE">Ministério do Trabalho e Emprego (MTE)</MenuItem>
                                    <MenuItem value="DIC">Diretoria de Identificação Civil (DIC)</MenuItem>
                                    <MenuItem value="MAE">Ministério da Aeronáutica (MAE)</MenuItem>
                                    <MenuItem value="MEX">Ministério do Exército (MEX)</MenuItem>
                                    <MenuItem value="MMA">Ministério da Marinha (MMA)</MenuItem>
                                </Select>
                                <FormHelperText>{formik.touched.orgaoExpedidor && formik.errors.orgaoExpedidor}</FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                label="Emissão RG"
                                name="dataRg"
                                value={formik.values.dataRg}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.dataRg && Boolean(formik.errors.dataRg)}
                                helperText={formik.touched.dataRg && formik.errors.dataRg}
                                slotProps={{ 
                                    shrink: true,
                                    input: {inputComponent: DateMask} 
                                }}
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
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <TextField 
                                fullWidth 
                                name="numeroCasa" 
                                label="Número" 
                                value={formik.values.numeroCasa} 
                                onChange={formik.handleChange} 
                                onBlur={formik.handleBlur} 
                                error={formik.touched.numeroCasa && Boolean(formik.errors.numeroCasa)} 
                                helperText={formik.touched.numeroCasa && formik.errors.numeroCasa} 
                            />
                        </Grid>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <TextField 
                                fullWidth 
                                name="complementoCasa" 
                                label="Complemento" 
                                value={formik.values.complementoCasa} 
                                onChange={formik.handleChange} 
                                onBlur={formik.handleBlur} 
                                error={formik.touched.complementoCasa && Boolean(formik.errors.complementoCasa)} 
                                helperText={formik.touched.complementoCasa && formik.errors.complementoCasa} 
                            />
                        </Grid>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <TextField 
                                fullWidth 
                                name="bairro" 
                                label="Bairro" 
                                value={formik.values.bairro} 
                                onChange={formik.handleChange} 
                                onBlur={formik.handleBlur} 
                                error={formik.touched.bairro && Boolean(formik.errors.bairro)} 
                                helperText={formik.touched.bairro && formik.errors.bairro} 
                            />
                        </Grid>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <TextField 
                                fullWidth 
                                name="cidade" 
                                label="Cidade" 
                                value={formik.values.cidade} 
                                onChange={formik.handleChange} 
                                onBlur={formik.handleBlur} 
                                error={formik.touched.cidade && Boolean(formik.errors.cidade)} 
                                helperText={formik.touched.cidade && formik.errors.cidade} 
                            />
                        </Grid>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <TextField 
                                fullWidth 
                                name="estado" 
                                label="Estado" 
                                value={formik.values.estado} 
                                onChange={formik.handleChange} 
                                onBlur={formik.handleBlur} 
                                error={formik.touched.estado && Boolean(formik.errors.estado)} 
                                helperText={formik.touched.estado && formik.errors.estado} 
                            />
                        </Grid>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <TextField 
                                fullWidth 
                                name="nomeMae" 
                                label="Nome da Mãe" 
                                value={formik.values.nomeMae} 
                                onChange={formik.handleChange} 
                                onBlur={formik.handleBlur} 
                                error={formik.touched.nomeMae && Boolean(formik.errors.nomeMae)} 
                                helperText={formik.touched.nomeMae && formik.errors.nomeMae} 
                            />
                        </Grid>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <TextField 
                                fullWidth 
                                name="nomePai" 
                                label="Nome do Pai" 
                                value={formik.values.nomePai} 
                                onChange={formik.handleChange} 
                                onBlur={formik.handleBlur} 
                                error={formik.touched.nomePai && Boolean(formik.errors.nomePai)} 
                                helperText={formik.touched.nomePai && formik.errors.nomePai} 
                            />
                        </Grid>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <FormControl 
                                fullWidth 
                                error={formik.touched.escolaridade && Boolean(formik.errors.escolaridade)}
                            >
                                <InputLabel>Escolaridade</InputLabel>
                                <Select name="escolaridade" value={formik.values.escolaridade} label="Escolaridade" onChange={formik.handleChange} onBlur={formik.handleBlur}>
                                    <MenuItem value=""><em>Selecione</em></MenuItem>
                                    <MenuItem value="Ensino Fundamental Incompleto">Ensino Fundamental Incompleto</MenuItem>
                                    <MenuItem value="Ensino Fundamental Completo">Ensino Fundamental Completo</MenuItem>
                                    <MenuItem value="Ensino Médio Incompleto">Ensino Médio Incompleto</MenuItem>
                                    <MenuItem value="Ensino Médio Completo">Ensino Médio Completo</MenuItem>
                                    <MenuItem value="Ensino Técnico">Ensino Técnico</MenuItem>
                                    <MenuItem value="Superior Incompleto">Superior Incompleto</MenuItem>
                                    <MenuItem value="Superior Completo">Superior Completo</MenuItem>
                                    <MenuItem value="Pós-Graduação">Pós-Graduação</MenuItem>
                                    <MenuItem value="Mestrado">Mestrado</MenuItem>
                                    <MenuItem value="Doutorado">Doutorado</MenuItem>
                                    <MenuItem value="Pós-Doutorado">Pós-Doutorado</MenuItem>
                                    <MenuItem value="Nenhuma Escolaridade">Nenhuma Escolaridade</MenuItem>
                                </Select>
                                <FormHelperText>{formik.touched.escolaridade && formik.errors.escolaridade}</FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <FormControl 
                                fullWidth 
                                error={formik.touched.estadoCivil && Boolean(formik.errors.estadoCivil)}
                            >
                                <InputLabel>Estado civil</InputLabel>
                                <Select name="estadoCivil" value={formik.values.estadoCivil} label="Estado civil" onChange={formik.handleChange} onBlur={formik.handleBlur}>
                                    <MenuItem value=""><em>Selecione</em></MenuItem>
                                    <MenuItem value="Solteiro">Solteiro(a)</MenuItem>
                                    <MenuItem value="Casado">Casado(a)</MenuItem>
                                    <MenuItem value="Separado">Separado(a) judicialmente</MenuItem>
                                    <MenuItem value="Divorciado">Divorciado(a)</MenuItem>
                                    <MenuItem value="Viuvo">Viúvo(a)</MenuItem>
                                    <MenuItem value="União estável">União estável</MenuItem>
                                </Select>
                                <FormHelperText>{formik.touched.estadoCivil && formik.errors.estadoCivil}</FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <TextField 
                                fullWidth 
                                name="nomeConjuge" 
                                label="Nome do Cônjuge" 
                                value={formik.values.nomeConjuge} 
                                onChange={formik.handleChange} 
                                onBlur={formik.handleBlur} 
                                error={formik.touched.nomeConjuge && Boolean(formik.errors.nomeConjuge)} 
                                helperText={formik.touched.nomeConjuge && formik.errors.nomeConjuge} 
                            />
                        </Grid>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <TextField 
                                fullWidth 
                                name="pis" 
                                label="PIS" 
                                value={formik.values.pis} 
                                onChange={formik.handleChange} 
                                onBlur={formik.handleBlur} 
                                error={formik.touched.pis && Boolean(formik.errors.pis)} 
                                helperText={formik.touched.pis && formik.errors.pis} 
                            />
                        </Grid>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <TextField 
                                fullWidth 
                                name="numeroCt" 
                                label="Número da CTPS" 
                                value={formik.values.numeroCt} 
                                onChange={formik.handleChange} 
                                onBlur={formik.handleBlur} 
                                error={formik.touched.numeroCt && Boolean(formik.errors.numeroCt)} 
                                helperText={formik.touched.numeroCt && formik.errors.numeroCt} 
                            />
                        </Grid>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <TextField 
                                fullWidth 
                                name="serie" 
                                label="Série da CTPS" 
                                value={formik.values.serie} 
                                onChange={formik.handleChange} 
                                onBlur={formik.handleBlur} 
                                error={formik.touched.serie && Boolean(formik.errors.serie)} 
                                helperText={formik.touched.serie && formik.errors.serie} 
                            />
                        </Grid>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                name="dataCt"
                                label="Emissão CTPS"
                                value={formik.values.dataCt}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.dataCt && Boolean(formik.errors.dataCt)}
                                helperText={formik.touched.dataCt && formik.errors.dataCt}
                                slotProps={{ 
                                    shrink: true,
                                    input: {inputComponent: DateMask} 
                                }}
                            />
                        </Grid>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <FormControlLabel control={<Checkbox name="carteiraDigital" checked={formik.values.carteiraDigital} onChange={formik.handleChange} onBlur={formik.handleBlur} />} label="Carteira Digital" />
                            <FormHelperText>{formik.touched.carteiraDigital && formik.errors.carteiraDigital}</FormHelperText>
                        </Grid>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <TextField 
                                fullWidth 
                                name="tituloEleitoral" 
                                label="Título Eleitoral" 
                                value={formik.values.tituloEleitoral} 
                                onChange={formik.handleChange} 
                                onBlur={formik.handleBlur} 
                                error={formik.touched.tituloEleitoral && Boolean(formik.errors.tituloEleitoral)} 
                                helperText={formik.touched.tituloEleitoral && formik.errors.tituloEleitoral} 
                            />
                        </Grid>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <TextField 
                                fullWidth 
                                name="zona" 
                                label="Zona Eleitoral" 
                                value={formik.values.zona} 
                                onChange={formik.handleChange} 
                                onBlur={formik.handleBlur} 
                                error={formik.touched.zona && Boolean(formik.errors.zona)} 
                                helperText={formik.touched.zona && formik.errors.zona} 
                            />
                        </Grid>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <TextField 
                                fullWidth 
                                name="secao" 
                                label="Seção Eleitoral" 
                                value={formik.values.secao} 
                                onChange={formik.handleChange} 
                                onBlur={formik.handleBlur} 
                                error={formik.touched.secao && Boolean(formik.errors.secao)} 
                                helperText={formik.touched.secao && formik.errors.secao} 
                            />
                        </Grid>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <TextField 
                                fullWidth 
                                name="funcao" 
                                label="Função" 
                                value={formik.values.funcao} 
                                onChange={formik.handleChange} 
                                onBlur={formik.handleBlur} 
                                error={formik.touched.funcao && Boolean(formik.errors.funcao)} 
                                helperText={formik.touched.funcao && formik.errors.funcao} 
                            />
                        </Grid>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                name="dataAdmissao"
                                label="Data admissão"
                                value={formik.values.dataAdmissao}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.dataAdmissao && Boolean(formik.errors.dataAdmissao)}
                                helperText={formik.touched.dataAdmissao && formik.errors.dataAdmissao}
                                slotProps={{ 
                                    shrink: true,
                                    input: {inputComponent: DateMask} 
                                }}
                            />
                        </Grid>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <TextField 
                                fullWidth 
                                name="salario" 
                                label="Salário" 
                                value={formik.values.salario} 
                                onChange={formik.handleChange} 
                                onBlur={formik.handleBlur} 
                                error={formik.touched.salario && Boolean(formik.errors.salario)} 
                                helperText={formik.touched.salario && formik.errors.salario} 
                                slotProps={{ input: {inputComponent: CurrencyMask} }}
                            />
                        </Grid>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <FormControlLabel control={<Checkbox name="contratoExperiencia" checked={formik.values.contratoExperiencia} onChange={formik.handleChange} onBlur={formik.handleBlur} />} label="Contrato de experiência" />
                            <FormHelperText>{formik.touched.contratoExperiencia && formik.errors.contratoExperiencia}</FormHelperText>
                        </Grid>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <TextField 
                                fullWidth 
                                name="horarios" 
                                label="Horário de Trabalho" 
                                value={formik.values.horarios} 
                                onChange={formik.handleChange} 
                                onBlur={formik.handleBlur} 
                                error={formik.touched.horarios && Boolean(formik.errors.horarios)} 
                                helperText={formik.touched.horarios && formik.errors.horarios} 
                            />
                        </Grid>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <FormControlLabel control={<Checkbox name="insalubridade" checked={formik.values.insalubridade} onChange={formik.handleChange} onBlur={formik.handleBlur} />} label="Insalubridade" />
                            <FormHelperText>{formik.touched.insalubridade && formik.errors.insalubridade}</FormHelperText>
                        </Grid>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <FormControlLabel control={<Checkbox name="periculosidade" checked={formik.values.periculosidade} onChange={formik.handleChange} onBlur={formik.handleBlur} />} label="Periculosidade" />
                            <FormHelperText>{formik.touched.periculosidade && formik.errors.periculosidade}</FormHelperText>
                        </Grid>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <FormControlLabel control={<Checkbox name="quebraDeCaixa" checked={formik.values.quebraDeCaixa} onChange={formik.handleChange} onBlur={formik.handleBlur} />} label="Quebra de caixa" />
                            <FormHelperText>{formik.touched.quebraDeCaixa && formik.errors.quebraDeCaixa}</FormHelperText>
                        </Grid>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <FormControlLabel control={<Checkbox name="valeTransporte" checked={formik.values.valeTransporte} onChange={formik.handleChange} onBlur={formik.handleBlur} />} label="Vale transporte" />
                            <FormHelperText>{formik.touched.valeTransporte && formik.errors.valeTransporte}</FormHelperText>
                        </Grid>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            {formik.values.valeTransporte && (
                                <TextField 
                                    fullWidth 
                                    name="quantidadeVales" 
                                    label="Quantidade de Vales Transporte" 
                                    value={formik.values.quantidadeVales} 
                                    onChange={formik.handleChange} 
                                    onBlur={formik.handleBlur} 
                                    error={formik.touched.quantidadeVales && Boolean(formik.errors.quantidadeVales)} 
                                    helperText={formik.touched.quantidadeVales && formik.errors.quantidadeVales} 
                                />
                            )}
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
                            {isSmallScreen ? <SaveIcon /> : 'Cadastrar funcionário'}
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
}