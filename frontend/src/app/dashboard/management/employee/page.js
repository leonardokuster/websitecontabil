'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Paper, Typography, Box, CircularProgress, Alert, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Grid, Collapse, IconButton, Tooltip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, FormControl, Select, MenuItem } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter, useSearchParams } from 'next/navigation'; 
import Link from 'next/link';
import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function EmployeeList() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const urlCompanyId = searchParams.get('companyId');
    const urlUserId = searchParams.get('userId');

    const [open, setOpen] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [employeeToDeleteId, setEmployeeToDeleteId] = useState(null);
    const [companyName, setCompanyName] = useState('');


    useEffect(() => {
        const fetchEmployees = async () => {
            setLoading(true);
            setError(null);

            if (!urlCompanyId) {
                setLoading(false);
                setError('ID da empresa não fornecido.');
                return;
            }
            
            try {
                const companyResponse = await axios.get(`http://localhost:3001/company/${urlCompanyId}`, { withCredentials: true });
                setCompanyName(companyResponse.data.nomeFantasia || companyResponse.data.razaoSocial);

                const employeeResponse = await axios.get(`http://localhost:3001/employee/company/${urlCompanyId}`, { withCredentials: true });
                setEmployees(employeeResponse.data);
            } catch (err) {
                console.error('Erro ao carregar dados:', err);
                if (err.response && err.response.status === 404) {
                    setEmployees([]);
                } else {
                    setError('Não foi possível carregar os dados. Tente novamente mais tarde.');
                }
            } finally {
                setLoading(false);
            }
            };
            fetchEmployees();
    }, [urlCompanyId]);

    const handleDeleteEmployee = (employeeId) => {
        setEmployeeToDeleteId(employeeId);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`http://localhost:3001/employee/${employeeToDeleteId}`, { withCredentials: true });
            setEmployees(employees.filter(c => c.id !== employeeToDeleteId));
            setIsDeleteDialogOpen(false);
            setEmployeeToDeleteId(null);
        } catch (err) {
            console.error('Erro ao remover funcionário:', err);
            setError('Falha ao remover o funcionário.');
        }
    };

    if (loading) {
        return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
        </Box>
        );
    }

    if (error) {
        return <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>;
    }
    
    return (
        <Container component="main" sx={{ pt: 4, pb: 4 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: '16px' }}>
                <Typography variant='h4' component='h1' gutterBottom align='center' mb={4}>
                    Gerenciamento de funcionários de {companyName}
                </Typography>
                {employees.length === 0 ? (
                    <>
                        <Typography color='text-secondary' align='center'>Esta empresa não possui funcionários cadastrados.</Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                            <Button variant="contained" onClick={() => router.push(`/dashboard/management/company/add?companyId=${urlCompanyId}&userId=${urlUserId}`)}>
                                Cadastrar funcionário
                            </Button>
                        </Box>
                    </>
                ) : (
                    <TableContainer sx={{ overflowX: "hidden" }}>
                        <Table aria-label='Tabela de funcionários cadastrados'>
                            <TableHead>
                                <TableRow>
                                    <TableCell width={5}/>
                                    <TableCell>Nome</TableCell>
                                    <TableCell align='right'>Ações</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {employees && Array.isArray(employees) && employees.map((employee) => (
                                    <React.Fragment key={employee.id}>
                                        <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                                            <TableCell>
                                                <Tooltip title='Detalhes'>
                                                    <IconButton
                                                        aria-label='Exibir detalhes do funcionário'
                                                        size='small'
                                                        onClick={() => setOpen(open === employee.id ? null : employee.id)}
                                                    >
                                                        {open === employee.id ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell component="th" scope="row"><strong>{employee.nome}</strong></TableCell>
                                            <TableCell align='right'>
                                                <Tooltip title='Editar'>
                                                    <IconButton
                                                        aria-label='Editar funcionário'
                                                        size='small'
                                                        href={`/dashboard/management/employee/edit?employeeId=${employee.id}&companyId=${urlCompanyId}&userId=${urlUserId}`}
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title='Excluir'>
                                                    <IconButton
                                                        aria-label='Excluir funcionário'
                                                        size='small'
                                                        onClick={() => handleDeleteEmployee(employee.id)}
                                                    >
                                                        <DeleteIcon color='error' />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                        {/* Área colapsada */}
                                        <TableRow>
                                            <TableCell style={{ paddingBottom: 0, paddingTop: 0, backgroundColor: '#F4F4F4', borderRadius: '0px 0px 40px 40px'}} colSpan={3}>
                                                <Collapse in={open === employee.id} timeout='auto' unmountOnExit>
                                                    <Box sx={{ p: 2, width: '100%' }}>
                                                        <Grid container spacing={{ xs: 2, md: 6 }}>
                                                            <Grid item size={{ xs: 12, md: 4 }}>
                                                                <Typography variant='subtitle2' color='text.secondary'>E-mail</Typography>
                                                                <Typography>{employee.email}</Typography>
                                                            </Grid>
                                                            <Grid item size={{ xs: 12, md: 4 }}>
                                                                <Typography variant='subtitle2' color='text.secondary'>Telefone</Typography>
                                                                <Typography>{employee.telefone}</Typography>
                                                            </Grid>
                                                            <Grid item size={{ xs: 12, md: 4 }}>
                                                                <Typography variant='subtitle2' color='text.secondary'>Sexo</Typography>
                                                                <Typography>{employee.sexo}</Typography>
                                                            </Grid>
                                                            <Grid item size={{ xs: 12, md: 4 }}>
                                                                <Typography variant='subtitle2' color='text.secondary'>Cor/Etnia</Typography>
                                                                <Typography>{employee.corEtnia}</Typography>
                                                            </Grid>
                                                            <Grid item size={{ xs: 12, md: 4 }}>
                                                                <Typography variant='subtitle2' color='text.secondary'>Nascimento</Typography>
                                                                <Typography>{format(parse(employee.dataNascimento, 'yyyy-MM-dd', new Date()), 'dd/MM/yyyy', { locale: ptBR })}</Typography>
                                                            </Grid>
                                                            <Grid item size={{ xs: 12, md: 4 }}>
                                                                <Typography variant='subtitle2' color='text.secondary'>Local nascimento</Typography>
                                                                <Typography>{employee.localNascimento}</Typography>
                                                            </Grid>
                                                            <Grid item size={{ xs: 12, md: 4 }}>
                                                                <Typography variant='subtitle2' color='text.secondary'>CPF</Typography>
                                                                <Typography>{employee.cpf}</Typography>
                                                            </Grid>
                                                            <Grid item size={{ xs: 12, md: 4 }}>
                                                                <Typography variant='subtitle2' color='text.secondary'>RG</Typography>
                                                                <Typography>{employee.rg}</Typography>
                                                            </Grid>
                                                            <Grid item size={{ xs: 12, md: 4 }}>
                                                                <Typography variant='subtitle2' color='text.secondary'>Órgão expedidor</Typography>
                                                                <Typography>{employee.orgaoExpedidor}</Typography>
                                                            </Grid>
                                                            <Grid item size={{ xs: 12, md: 4 }}>
                                                                <Typography variant='subtitle2' color='text.secondary'>Data emissão</Typography>
                                                                <Typography>{format(parse(employee.dataRg, 'yyyy-MM-dd', new Date()), 'dd/MM/yyyy', { locale: ptBR })}</Typography>
                                                            </Grid>
                                                            <Grid item size={{ xs: 12, md: 4 }}>
                                                                <Typography variant='subtitle2' color='text.secondary'>CEP</Typography>
                                                                <Typography>{employee.cep}</Typography>
                                                            </Grid>
                                                            <Grid item size={{ xs: 12, md: 4 }}>
                                                                <Typography variant='subtitle2' color='text.secondary'>Endereço</Typography>
                                                                <Typography>{employee.endereco}</Typography>
                                                            </Grid>
                                                            <Grid item size={{ xs: 12, md: 4 }}>
                                                                <Typography variant='subtitle2' color='text.secondary'>Número</Typography>
                                                                <Typography>{employee.numeroCasa}</Typography>
                                                            </Grid>
                                                            <Grid item size={{ xs: 12, md: 4 }}>
                                                                <Typography variant='subtitle2' color='text.secondary'>Complemento</Typography>
                                                                <Typography>{employee.complementoCasa ? (<>{employee.complementoCasa}</>) : (<>Não se aplica</>)}</Typography>
                                                            </Grid>
                                                            <Grid item size={{ xs: 12, md: 4 }}>
                                                                <Typography variant='subtitle2' color='text.secondary'>Bairro</Typography>
                                                                <Typography>{employee.bairro}</Typography>
                                                            </Grid>
                                                            <Grid item size={{ xs: 12, md: 4 }}>
                                                                <Typography variant='subtitle2' color='text.secondary'>Cidade</Typography>
                                                                <Typography>{employee.cidade}</Typography>
                                                            </Grid>
                                                            <Grid item size={{ xs: 12, md: 4 }}>
                                                                <Typography variant='subtitle2' color='text.secondary'>Estado</Typography>
                                                                <Typography>{employee.estado}</Typography>
                                                            </Grid>
                                                            <Grid item size={{ xs: 12, md: 4 }}>
                                                                <Typography variant='subtitle2' color='text.secondary'>Nome mãe</Typography>
                                                                <Typography>{employee.nomeMae}</Typography>
                                                            </Grid>
                                                            <Grid item size={{ xs: 12, md: 4 }}>
                                                                <Typography variant='subtitle2' color='text.secondary'>Nome pai</Typography>
                                                                <Typography>{employee.nomePai}</Typography>
                                                            </Grid>
                                                            <Grid item size={{ xs: 12, md: 4 }}>
                                                                <Typography variant='subtitle2' color='text.secondary'>Escolaridade</Typography>
                                                                <Typography>{employee.escolaridade}</Typography>
                                                            </Grid>
                                                            <Grid item size={{ xs: 12, md: 4 }}>
                                                                <Typography variant='subtitle2' color='text.secondary'>Estado civil</Typography>
                                                                <Typography>{employee.estadoCivil}</Typography>
                                                            </Grid>
                                                            <Grid item size={{ xs: 12, md: 4 }}>
                                                                <Typography variant='subtitle2' color='text.secondary'>Nome cônjuge</Typography>
                                                                <Typography>{employee.nomeConjuge}</Typography>
                                                            </Grid>
                                                            <Grid item size={{ xs: 12, md: 4 }}>
                                                                <Typography variant='subtitle2' color='text.secondary'>PIS</Typography>
                                                                <Typography>{employee.pis}</Typography>
                                                            </Grid>
                                                            <Grid item size={{ xs: 12, md: 4 }}>
                                                                <Typography variant='subtitle2' color='text.secondary'>Número carteira de trabalho</Typography>
                                                                <Typography>{employee.numeroCt}</Typography>
                                                            </Grid>
                                                            <Grid item size={{ xs: 12, md: 4 }}>
                                                                <Typography variant='subtitle2' color='text.secondary'>Série</Typography>
                                                                <Typography>{employee.serie}</Typography>
                                                            </Grid>
                                                            <Grid item size={{ xs: 12, md: 4 }}>
                                                                <Typography variant='subtitle2' color='text.secondary'>Data</Typography>
                                                                <Typography>{format(parse(employee.dataCt, 'yyyy-MM-dd', new Date()), 'dd/MM/yyyy', { locale: ptBR })}</Typography>
                                                            </Grid>
                                                            <Grid item size={{ xs: 12, md: 4 }}>
                                                                <Typography variant='subtitle2' color='text.secondary'>Carteira digital</Typography>
                                                                <Typography>{employee.carteiraDigital ? (<>Sim</>) : (<>Não</>)}</Typography>
                                                            </Grid>
                                                            <Grid item size={{ xs: 12, md: 4 }}>
                                                                <Typography variant='subtitle2' color='text.secondary'>Título</Typography>
                                                                <Typography>{employee.tituloEleitoral}</Typography>
                                                            </Grid>
                                                            <Grid item size={{ xs: 12, md: 4 }}>
                                                                <Typography variant='subtitle2' color='text.secondary'>Zona</Typography>
                                                                <Typography>{employee.zona}</Typography>
                                                            </Grid>
                                                            <Grid item size={{ xs: 12, md: 4 }}>
                                                                <Typography variant='subtitle2' color='text.secondary'>Seção</Typography>
                                                                <Typography>{employee.secao}</Typography>
                                                            </Grid>
                                                            <Grid item size={{ xs: 12, md: 4 }}>
                                                                <Typography variant='subtitle2' color='text.secondary'>Função</Typography>
                                                                <Typography>{employee.funcao}</Typography>
                                                            </Grid>
                                                            <Grid item size={{ xs: 12, md: 4 }}>
                                                                <Typography variant='subtitle2' color='text.secondary'>Data admissão</Typography>
                                                                <Typography>{format(parse(employee.dataAdmissao, 'yyyy-MM-dd', new Date()), 'dd/MM/yyyy', { locale: ptBR })}</Typography>
                                                            </Grid>
                                                            <Grid item size={{ xs: 12, md: 4 }}>
                                                                <Typography variant='subtitle2' color='text.secondary'>Salário</Typography>
                                                                <Typography>{employee.salario}</Typography>
                                                            </Grid>
                                                            <Grid item size={{ xs: 12, md: 4 }}>
                                                                <Typography variant='subtitle2' color='text.secondary'>Contrato experiência</Typography>
                                                                <Typography>{employee.contratoExperiencia ? (<>Sim</>) : (<>Não</>)}</Typography>
                                                            </Grid>
                                                            <Grid item size={{ xs: 12, md: 4 }}>
                                                                <Typography variant='subtitle2' color='text.secondary'>Horários</Typography>
                                                                <Typography>{employee.horarios}</Typography>
                                                            </Grid>
                                                            <Grid item size={{ xs: 12, md: 4 }}>
                                                                <Typography variant='subtitle2' color='text.secondary'>Insalubridade</Typography>
                                                                <Typography>{employee.insalubridade ? (<>Sim</>) : (<>Não</>)}</Typography>
                                                            </Grid>
                                                            <Grid item size={{ xs: 12, md: 4 }}>
                                                                <Typography variant='subtitle2' color='text.secondary'>Periculosidade</Typography>
                                                                <Typography>{employee.periculosidade ? (<>Sim</>) : (<>Não</>)}</Typography>
                                                            </Grid>
                                                            <Grid item size={{ xs: 12, md: 4 }}>
                                                                <Typography variant='subtitle2' color='text.secondary'>Quebra de caixa</Typography>
                                                                <Typography>{employee.quebraDeCaixa ? (<>Sim</>) : (<>Não</>)}</Typography>
                                                            </Grid>
                                                            <Grid item size={{ xs: 12, md: 4 }}>
                                                                <Typography variant='subtitle2' color='text.secondary'>Vale transporte</Typography>
                                                                <Typography>{employee.valeTransporte ? (<>Sim</>) : (<>Não</>)}</Typography>
                                                            </Grid>
                                                            <Grid item size={{ xs: 12, md: 4 }}>
                                                                <Typography variant='subtitle2' color='text.secondary'>Quantidade de vales</Typography>
                                                                <Typography>{employee.quantidadeVales}</Typography>
                                                            </Grid>
                                                        </Grid>
                                                    </Box>
                                                    <Typography variant='body2' component='div' m={2}>
                                                        <>
                                                            Deseja visualizar ou cadastrar um novo dependente?
                                                            <Link href={`/dashboard/management/dependent?employeeId=${employee.id}`}> <strong>Clique aqui</strong></Link>
                                                        </>
                                                    </Typography>
                                                </Collapse>
                                            </TableCell>
                                        </TableRow>
                                    </React.Fragment>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
                <Dialog
                    open={isDeleteDialogOpen}
                    onClose={() => setIsDeleteDialogOpen(false)}
                >
                    <DialogTitle>{"Confirmar exclusão"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Tem certeza que deseja remover este funcionário? Esta ação não pode ser desfeita.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setIsDeleteDialogOpen(false)} color="primary">
                            Cancelar
                        </Button>
                        <Button onClick={confirmDelete} color="error" autoFocus>
                            Excluir
                        </Button>
                    </DialogActions>
                </Dialog>
                {urlUserId && urlUserId !== 'null' ? (
                    <Button 
                        href={`/dashboard/management/company?userId=${urlUserId}`}
                        sx={{
                            bgcolor: 'var(--cordestaque)',
                            color: 'white',
                            width: '10px',
                            borderRadius: '50px',
                            mt: '20px',
                            '&:hover': {
                                bgcolor: 'var(--corhover)',
                            },
                        }}
                    >
                        <ArrowBackIcon/>
                    </Button>
                ) : (
                    <Button 
                        href={`/dashboard/management/company`}
                        sx={{
                            bgcolor: 'var(--cordestaque)',
                            color: 'white',
                            width: '10px',
                            borderRadius: '50px',
                            mt: '20px',
                            '&:hover': {
                                bgcolor: 'var(--corhover)',
                            },
                        }}
                    >
                        <ArrowBackIcon/>
                    </Button>
                )}
            </Paper>
        </Container>
    )
}