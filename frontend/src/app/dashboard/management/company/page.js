'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Paper, Typography, Box, CircularProgress, Alert, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Grid, Collapse, IconButton, Tooltip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, FormControl, Select, MenuItem } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useRouter, useSearchParams } from 'next/navigation'; 
import Link from 'next/link';
import Cookies from 'js-cookie';

const getLoggedInUserId = () => {
    return Cookies.get('usuario_id');
};

export default function CompanyList() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const urlUserId = searchParams.get('userId');
    const loggedInUserId = getLoggedInUserId();
    const currentUserId = urlUserId || loggedInUserId;

    const [open, setOpen] = useState(null);
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [companyToDeleteId, setCompanyToDeleteId] = useState(null);
    const [userName, setUserName] = useState('');
    const [userType, setUserType] = useState('');


    useEffect(() => {
        const fetchCompanies = async () => {
            setLoading(true);
            setError(null);

            if (!currentUserId) {
                setLoading(false);
                setError('ID do usuário não fornecido.');
                return;
            }

            if (urlUserId) {
                try {
                    const userResponse = await axios.get(`http://localhost:3001/user/${urlUserId}`, { withCredentials: true });
                    setUserName(userResponse.data.nome); 
                } catch (err) {
                    console.error('Erro ao carregar nome do usuário:', err);
                    setUserName('Usuário Desconhecido');
                }
            }

            const storedUserType = Cookies.get('tipo');
            if (storedUserType) {
                setUserType(storedUserType);
            }
            
            try {
                const response = await axios.get(`http://localhost:3001/company/user/${currentUserId}`, { withCredentials: true });
                const companiesData = Array.isArray(response.data) ? response.data : [response.data];

                const validCompanies = companiesData.filter(company => company !== null && company !== undefined);
                setCompanies(validCompanies);
            } catch (err) {
                console.error('Erro ao carregar empresa:', err);
                if (err.response && err.response.status === 404) {
                    setCompanies([]);
                } else {
                    setError('Não foi possível carregar os dados das empresas. Tente novamente mais tarde.');
                }
            } finally {
                setLoading(false);
            }
            };
            fetchCompanies();
    }, [currentUserId, urlUserId]);

    const handleDeleteCompany = (companyId) => {
        setCompanyToDeleteId(companyId);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`http://localhost:3001/company/${companyToDeleteId}`, { withCredentials: true });
            setCompanies(companies.filter(c => c.id !== companyToDeleteId));
            setIsDeleteDialogOpen(false);
            setCompanyToDeleteId(null);
        } catch (err) {
            console.error('Erro ao remover empresa:', err);
            setError('Falha ao remover o empresa.');
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
                    {userType === 'admin' && urlUserId && userName ? `Gerenciamento de empresas de ${userName}` : 'Gerenciamento de empresas'}
                </Typography>
                {companies.length === 0 ? (
                    <>
                        <Typography color='text-secondary' align='center'>Este usuário não possui empresa cadastrada.</Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                            <Button variant="contained" onClick={() => router.push(`/dashboard/management/company/add?userId=${userId}`)}>
                                Cadastrar Empresa
                            </Button>
                        </Box>
                    </>
                ) : (
                    <TableContainer sx={{ overflowX: "hidden" }}>
                        <Table aria-label='Tabela de empresas cadastradas'>
                            <TableHead>
                                <TableRow>
                                    <TableCell width={5}/>
                                    <TableCell>Nome</TableCell>
                                    <TableCell align='right'>Ações</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {companies && Array.isArray(companies) && companies.map((company) => (
                                    <React.Fragment key={company.id}>
                                        <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                                            <TableCell>
                                                <Tooltip title='Detalhes'>
                                                    <IconButton
                                                        aria-label='Exibir detalhes da empresa'
                                                        size='small'
                                                        onClick={() => setOpen(open === company.id ? null : company.id)}
                                                    >
                                                        {open === company.id ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell component="th" scope="row"><strong>{company.nomeFantasia}</strong></TableCell>
                                            <TableCell align='right'>
                                                <Tooltip title='Editar'>
                                                    <IconButton
                                                        aria-label='Editar empresa'
                                                        size='small'
                                                        href={`/dashboard/management/company/edit?companyId=${company.id}`}
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title='Excluir'>
                                                    <IconButton
                                                        aria-label='Excluir empresa'
                                                        size='small'
                                                        onClick={() => handleDeleteCompany(company.id)}
                                                    >
                                                        <DeleteIcon color='error' />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                        {/* Área colapsada */}
                                        <TableRow>
                                            <TableCell style={{ paddingBottom: 0, paddingTop: 0, backgroundColor: '#F4F4F4', borderRadius: '0px 0px 40px 40px'}} colSpan={3}>
                                                <Collapse in={open === company.id} timeout='auto' unmountOnExit>
                                                    <Box sx={{ p: 2, width: '100%' }}>
                                                        <Grid container spacing={{ xs: 2, md: 6 }}>
                                                            <Grid item size={{ xs: 12, md: 4 }}>
                                                                <Typography variant='subtitle2' color='text.secondary'>CNPJ</Typography>
                                                                <Typography>{company.cnpj}</Typography>
                                                            </Grid>
                                                            <Grid item size={{ xs: 12, md: 4 }}>
                                                                <Typography variant='subtitle2' color='text.secondary'>Razão social</Typography>
                                                                <Typography>{company.razaoSocial}</Typography>
                                                            </Grid>
                                                            <Grid item size={{ xs: 12, md: 4 }}>
                                                                <Typography variant='subtitle2' color='text.secondary'>Atividades exercidas</Typography>
                                                                <Typography>{company.atividadesExercidas}</Typography>
                                                            </Grid>
                                                            <Grid item size={{ xs: 12, md: 4 }}>
                                                                <Typography variant='subtitle2' color='text.secondary'>Capital social</Typography>
                                                                <Typography>{company.capitalSocial}</Typography>
                                                            </Grid>
                                                            <Grid item size={{ xs: 12, md: 4 }}>
                                                                <Typography variant='subtitle2' color='text.secondary'>CEP</Typography>
                                                                <Typography>{company.cep}</Typography>
                                                            </Grid>
                                                            <Grid item size={{ xs: 12, md: 4 }}>
                                                                <Typography variant='subtitle2' color='text.secondary'>Endereço</Typography>
                                                                <Typography>{company.endereco}</Typography>
                                                            </Grid>
                                                            <Grid item size={{ xs: 12, md: 4 }}>
                                                                <Typography variant='subtitle2' color='text.secondary'>Número</Typography>
                                                                <Typography>{company.numeroEmpresa}</Typography>
                                                            </Grid>
                                                            <Grid item size={{ xs: 12, md: 4 }}>
                                                                <Typography variant='subtitle2' color='text.secondary'>Complemento</Typography>
                                                                <Typography>
                                                                    {company.complementoEmpresa ? (
                                                                        <>{company.complementoEmpresa}</>
                                                                    ): (
                                                                        <>Não se aplica</>
                                                                    )}
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item size={{ xs: 12, md: 4 }}>
                                                                <Typography variant='subtitle2' color='text.secondary'>E-mail</Typography>
                                                                <Typography>{company.emailEmpresa}</Typography>
                                                            </Grid>
                                                            <Grid item size={{ xs: 12, md: 4 }}>
                                                                <Typography variant='subtitle2' color='text.secondary'>Telefone</Typography>
                                                                <Typography>{company.telefoneEmpresa}</Typography>
                                                            </Grid>
                                                            <Grid item size={{ xs: 12, md: 4 }}>
                                                                <Typography variant='subtitle2' color='text.secondary'>Sócios</Typography>
                                                                <Typography>
                                                                    {company.socios ? (
                                                                        <>{company.socios}</>
                                                                    ): (
                                                                        <>Não se aplica</>
                                                                    )}
                                                                </Typography>
                                                            </Grid>
                                                        </Grid>
                                                    </Box>
                                                    <Typography variant='body2' component='div' m={2}>
                                                        <>
                                                            Deseja visualizar ou cadastrar um novo funcionário?
                                                            <Link href={`/dashboard/management/employee?companyId=${company.id}`}> <strong>Clique aqui</strong></Link>
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
                            Tem certeza que deseja remover esta empresa? Esta ação não pode ser desfeita.
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
            </Paper>
        </Container>
    )
}