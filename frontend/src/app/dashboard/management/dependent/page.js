'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme, useMediaQuery, Container, Paper, Typography, Box, CircularProgress, Alert, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Grid, Collapse, IconButton, Tooltip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, FormControl, Select, MenuItem } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter, useSearchParams } from 'next/navigation'; 
import Link from 'next/link';
import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Cookies from 'js-cookie';

const getLoggedInUserId = () => Cookies.get('usuario_id');

export default function DependentList() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const loggedUserId = getLoggedInUserId();
    const urlUserId = searchParams.get('userId');
    const userId = urlUserId || loggedUserId;

    const urlCompanyId = searchParams.get('companyId');
    const urlEmployeeId = searchParams.get('employeeId');

    const [open, setOpen] = useState(null);
    const [dependents, setDependents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [dependentToDeleteId, setDependentToDeleteId] = useState(null);
    const [employeeName, setEmployeeName] = useState('');

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        const fetchDependents = async () => {
            setLoading(true);
            setError(null);

            if (!userId || !urlCompanyId || !urlEmployeeId) {
                setLoading(false);
                setError('IDs de usuário, empresa ou funcionário não fornecidos.');
                return;
            }
            
            try {
                const employeeResponse = await axios.get(`http://localhost:3001/users/${userId}/companies/${urlCompanyId}/employees/${urlEmployeeId}`, { withCredentials: true });
                setEmployeeName(employeeResponse.data.nome);

                const dependentResponse = await axios.get(`http://localhost:3001/users/${userId}/companies/${urlCompanyId}/employees/${urlEmployeeId}/dependents`, { withCredentials: true });
                setDependents(dependentResponse.data);
            } catch (err) {
                console.error('Erro ao carregar dados:', err);
                if (err.response && err.response.status === 404) {
                    setDependents([]);
                } else {
                    setError('Não foi possível carregar os dados. Tente novamente mais tarde.');
                }
            } finally {
                setLoading(false);
            }
            };
            fetchDependents();
    }, [userId, urlCompanyId, urlEmployeeId]);

    const handleAddDependent = () => {
        router.push(`/dashboard/management/dependent/add?employeeId=${urlEmployeeId}&companyId=${urlCompanyId}&userId=${userId}`);
    }

    const handleBack = () => {
        const backPath = `/dashboard/management/employee?companyId=${urlCompanyId}&userId=${userId}`;
        router.push(backPath);

    };

    const handleDeleteDependent = (dependentId) => {
        setDependentToDeleteId(dependentId);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`http://localhost:3001/users/${userId}/companies/${urlCompanyId}/employees/${urlEmployeeId}/dependents/${dependentToDeleteId}`, { withCredentials: true });
            setDependents(dependents.filter(c => c.id !== dependentToDeleteId));
            setIsDeleteDialogOpen(false);
            setDependentToDeleteId(null);
        } catch (err) {
            console.error('Erro ao remover dependente:', err);
            setError('Falha ao remover o dependente.');
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
                    Gerenciamento de dependentes de {employeeName}
                </Typography>
                {dependents.length === 0 ? (
                    <Typography color='text-secondary' align='center'>Este funcionário não possui dependentes cadastrados.</Typography>
                ) : (
                    <TableContainer sx={{ overflowX: "hidden" }}>
                        <Table aria-label='Tabela de dependentes cadastrados'>
                            <TableHead>
                                <TableRow>
                                    <TableCell width={5}/>
                                    <TableCell>Nome</TableCell>
                                    <TableCell align='right'>Ações</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {dependents && Array.isArray(dependents) && dependents.map((dependent) => (
                                    <React.Fragment key={dependent.id}>
                                        <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                                            <TableCell>
                                                <Tooltip title='Detalhes'>
                                                    <IconButton
                                                        aria-label='Exibir detalhes do dependente'
                                                        size='small'
                                                        onClick={() => setOpen(open === dependent.id ? null : dependent.id)}
                                                    >
                                                        {open === dependent.id ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell component="th" scope="row"><strong>{dependent.nomeDependente}</strong></TableCell>
                                            <TableCell align='right'>
                                                <Tooltip title='Editar'>
                                                    <IconButton
                                                        aria-label='Editar dependente'
                                                        size='small'
                                                        href={`/dashboard/management/dependent/edit?dependentId=${dependent.id}&employeeId=${urlEmployeeId}&companyId=${urlCompanyId}&userId=${userId}`}
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title='Excluir'>
                                                    <IconButton
                                                        aria-label='Excluir dependente'
                                                        size='small'
                                                        onClick={() => handleDeleteDependent(dependent.id)}
                                                    >
                                                        <DeleteIcon color='error' />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                        {/* Área colapsada */}
                                        <TableRow>
                                            <TableCell style={{ paddingBottom: 0, paddingTop: 0, backgroundColor: '#F4F4F4', borderRadius: '0px 0px 40px 40px'}} colSpan={3}>
                                                <Collapse in={open === dependent.id} timeout='auto' unmountOnExit>
                                                    <Box sx={{ p: 2, width: '100%' }}>
                                                        <Grid container spacing={{ xs: 2, md: 6 }}>
                                                            <Grid item size={{ xs: 12, md: 4 }}>
                                                                <Typography variant='subtitle2' color='text.secondary'>Nascimento</Typography>
                                                                <Typography>{format(parse(dependent.dataNascimentoDependente, 'yyyy-MM-dd', new Date()), 'dd/MM/yyyy', { locale: ptBR })}</Typography>
                                                            </Grid>
                                                            <Grid item size={{ xs: 12, md: 4 }}>
                                                                <Typography variant='subtitle2' color='text.secondary'>Local nascimento</Typography>
                                                                <Typography>{dependent.localNascimentoDependente}</Typography>
                                                            </Grid>
                                                            <Grid item size={{ xs: 12, md: 4 }}>
                                                                <Typography variant='subtitle2' color='text.secondary'>CPF</Typography>
                                                                <Typography>{dependent.cpfDependente}</Typography>
                                                            </Grid>
                                                        </Grid>
                                                    </Box>
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
                            Tem certeza que deseja remover este dependente? Esta ação não pode ser desfeita.
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
                                bgcolor: 'var(--corhover)',
                            },
                            borderRadius: isSmallScreen ? '50px' : 'none',
                            minWidth: isSmallScreen ? '80px' : '150px',
                            padding: isSmallScreen ? '8px' : '6px 16px',
                        }}
                    >
                        {isSmallScreen ? <ArrowBackIcon /> : 'Voltar'}
                    </Button>
                    <Button
                        onClick={handleAddDependent}
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
                        {isSmallScreen ? <AddIcon /> : 'Adicionar dependente'}
                    </Button>
                </Box>
            </Paper>
        </Container>
    )
}