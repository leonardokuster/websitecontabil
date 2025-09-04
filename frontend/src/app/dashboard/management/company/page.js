'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme, useMediaQuery, Container, Paper, Typography, Box, CircularProgress, Alert, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Grid, Collapse, IconButton, Tooltip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, FormControl, Select, MenuItem } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import { useRouter, useSearchParams } from 'next/navigation'; 
import Link from 'next/link';
import Cookies from 'js-cookie';

const getLoggedInUserId = () => Cookies.get('usuario_id');
const getLoggedInUserType = () => Cookies.get('tipo');

export default function CompanyList() {
    const router = useRouter();

    const searchParams = useSearchParams();
    const loggedInUserId = getLoggedInUserId();
    const urlUserId = searchParams.get('userId');
    const userId = urlUserId || loggedInUserId;

    const [open, setOpen] = useState(null);
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [companyToDeleteId, setCompanyToDeleteId] = useState(null);
    const [userName, setUserName] = useState('');
    const [userType, setUserType] = useState('');

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        const fetchCompanies = async () => {
            setLoading(true);
            setError(null);

            if (!userId) {
                setLoading(false);
                setError('ID do usuário não fornecido.');
                return;
            }

            const storedUserType = getLoggedInUserType();
            setUserType(storedUserType || '');
            
            try {
                const userResponse = await axios.get(`http://localhost:3001/users/${userId}`, { withCredentials: true });
                setUserName(userResponse.data.nome);

                const companiesResponse = await axios.get(`http://localhost:3001/users/${userId}/companies`, { withCredentials: true });
                const companiesData = Array.isArray(companiesResponse.data) ? companiesResponse.data : [companiesResponse.data];

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
    }, [userId]);

    const handleAddCompany = () => {
        router.push(`/dashboard/management/company/add?userId=${userId}`);
    }

    const handleDeleteCompany = (companyId) => {
        setCompanyToDeleteId(companyId);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`http://localhost:3001/users/${userId}/companies/${companyToDeleteId}`, { withCredentials: true });
            setCompanies(companies.filter(c => c.id !== companyToDeleteId));
            setIsDeleteDialogOpen(false);
            setCompanyToDeleteId(null);
        } catch (err) {
            console.error('Erro ao remover empresa:', err);
            setError('Falha ao remover o empresa.');
        }
    };

    const handleBack = () => {
        router.push('/dashboard/management/user');
    }

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
                    {userType === 'admin' && urlUserId && userName ? `Gerenciamento de empresas de ${userName}` : 'Gerenciamento de empresas'}
                </Typography>
                {companies.length === 0 ? (
                    <Typography color='text-secondary' align='center'>Este usuário não possui empresa cadastrada.</Typography>
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
                                                        href={`/dashboard/management/company/edit?companyId=${company.id}&userId=${userId}`}
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
                                                            <Link href={`/dashboard/management/employee?companyId=${company.id}&userId=${userId}`}> <strong>Clique aqui</strong></Link>
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

                <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'space-between' }}>
                    {(userType === 'admin' || userType === 'collaborator') && (
                        <Button
                            onClick={handleBack}
                            variant='contained'
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
                            {isSmallScreen ? <ArrowBackIcon /> : 'Voltar'}
                        </Button>
                    )}
                    <Button
                        onClick={handleAddCompany}
                        variant='contained'
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
                        {isSmallScreen ? <AddIcon /> : 'Adicionar empresa'}
                    </Button>
                </Box>
            </Paper>
        </Container>
    )
}