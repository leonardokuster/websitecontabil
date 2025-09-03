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

export default function DependentList() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const urlUserId = searchParams.get('userId');
    const urlCompanyId = searchParams.get('companyId');
    const urlEmployeeId = searchParams.get('employeeId');

    const [open, setOpen] = useState(null);
    const [dependents, setDependents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [dependentToDeleteId, setDependentToDeleteId] = useState(null);
    const [employeeName, setEmployeeName] = useState('');


    useEffect(() => {
        const fetchDependents = async () => {
            setLoading(true);
            setError(null);

            if (!urlEmployeeId) {
                setLoading(false);
                setError('ID do funcionário não fornecido.');
                return;
            }
            
            try {
                const employeeResponse = await axios.get(`http://localhost:3001/employee/${urlEmployeeId}`, { withCredentials: true });
                setEmployeeName(employeeResponse.data.nome);

                const dependentResponse = await axios.get(`http://localhost:3001/dependent/employee/${urlEmployeeId}`, { withCredentials: true });
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
    }, [urlEmployeeId]);

    const handleDeleteDependent = (dependentId) => {
        setDependentToDeleteId(dependentId);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`http://localhost:3001/dependent/${dependentToDeleteId}`, { withCredentials: true });
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
                    <>
                        <Typography color='text-secondary' align='center'>Este funcionário não possui dependentes cadastrados.</Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                            <Button variant="contained" onClick={() => router.push(`/dashboard/management/company/add?companyId=${urlCompanyId}&userId=${urlUserId}`)}>
                                Cadastrar dependente
                            </Button>
                        </Box>
                    </>
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
                                                        href={`/dashboard/management/dependent/edit?dependentId=${dependent.id}&employeeId=${urlEmployeeId}&companyId=${urlCompanyId}&userId=${urlUserId}`}
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
                {urlCompanyId && urlCompanyId !== 'null' ? (
                    <Button 
                        href={`/dashboard/management/employee?companyId=${urlCompanyId}`}
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
                        href={`/dashboard/management/employee`}
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