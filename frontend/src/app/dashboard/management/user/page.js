'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Container, Paper, Box, CircularProgress, Alert, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Grid, Collapse, IconButton, Tooltip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, FormControl, Select, MenuItem } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Link from 'next/link';

export default function UserList() {
    const [open, setOpen] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [userToDeleteId, setUserToDeleteId] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:3001/users/', { withCredentials: true });
            setUsers(response.data);
        } catch (err) {
            console.error('Erro ao carregar usuários:', err);
            setError('Não foi possível carregar a lista de usuários. Tente novamente mais tarde.');
        } finally {
            setLoading(false);
        }
        };
        fetchUsers();
    }, []);

    const handleDeleteUser = (id) => {
        setUserToDeleteId(id);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!userToDeleteId) return;

        try {
            await axios.delete(`http://localhost:3001/users/${userToDeleteId}`, { withCredentials: true });
            setUsers(users.filter(user => user.id !== userToDeleteId));
            setIsDeleteDialogOpen(false);
            setUserToDeleteId(null);
        } catch (err) {
            console.error('Erro ao remover usuário:', err);
            setError('Falha ao remover o usuário.');
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
                    Gerenciamento de usuários
                </Typography>
                {users.length === 0 ? (
                    <Typography color='text-secondary' align='center'>Nenhum usuário encontrado.</Typography>
                ) : (
                    <TableContainer sx={{ overflowX: "hidden" }}>
                        <Table aria-label='Tabela de usuários cadastrados'>
                            <TableHead>
                                <TableRow>
                                    <TableCell width={5}/>
                                    <TableCell>Nome</TableCell>
                                    <TableCell align='right'>Ações</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users.map((user) => (
                                    <React.Fragment key={user.id}>
                                        <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                                            <TableCell>
                                                <Tooltip title='Detalhes'>
                                                    <IconButton
                                                        aria-label='Exibir detalhes do usuário'
                                                        size='small'
                                                        onClick={() => setOpen(open === user.id ? null : user.id)}
                                                    >
                                                        {open === user.id ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell component="th" scope="row"><strong>{user.nome}</strong></TableCell>
                                            <TableCell align='right'>
                                                <Tooltip title='Editar'>
                                                    <IconButton
                                                        aria-label='Editar usuário'
                                                        size='small'
                                                        href={`/dashboard/management/user/edit?userId=${user.id}`}
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title='Excluir'>
                                                    <IconButton
                                                        aria-label='Excluir usuário'
                                                        size='small'
                                                        onClick={() => handleDeleteUser(user.id)}
                                                    >
                                                        <DeleteIcon color='error' />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                        {/* Área colapsada */}
                                        <TableRow>
                                            <TableCell style={{ paddingBottom: 0, paddingTop: 0, backgroundColor: '#F4F4F4', borderRadius: '0px 0px 40px 40px'}} colSpan={3}>
                                                <Collapse in={open === user.id} timeout='auto' unmountOnExit>
                                                    <Box sx={{ p: 2, width: '100%' }}>
                                                        <Grid container spacing={{ xs: 2, md: 6 }}>
                                                            <Grid item size={{ xs: 12, md: 2.5 }}>
                                                                <Typography variant='subtitle2' color='text.secondary'>E-mail</Typography>
                                                                <Typography>{user.emailPessoal}</Typography>
                                                            </Grid>
                                                            <Grid item size={{ xs: 12, md: 2.5 }}>
                                                                <Typography variant='subtitle2' color='text.secondary'>Telefone</Typography>
                                                                <Typography>{user.telefonePessoal}</Typography>
                                                            </Grid>
                                                            <Grid item size={{ xs: 12, md: 2.5 }}>
                                                                <Typography variant='subtitle2' color='text.secondary'>CPF</Typography>
                                                                <Typography>{user.cpf}</Typography>
                                                            </Grid>
                                                            <Grid item size={{ xs: 12, md: 2.5 }}>
                                                                <Typography variant='subtitle2' color='text.secondary'>Nascimento</Typography>
                                                                <Typography>{format(parse(user.dataNascimento, 'yyyy-MM-dd', new Date()), 'dd/MM/yyyy', { locale: ptBR })}</Typography>
                                                            </Grid>
                                                            <Grid item size={{ xs: 12, md: 2 }}>
                                                                <Typography variant='subtitle2' color='text.secondary'>Tipo</Typography>
                                                                <Typography>{user.tipo}</Typography>
                                                            </Grid>
                                                        </Grid>
                                                    </Box>
                                                    <Typography variant='body2' component='div' m={2}>
                                                        <>
                                                            Deseja visualizar ou cadastrar uma nova empresa?
                                                            <Link href={`/dashboard/management/company?userId=${user.id}`}> <strong>Clique aqui</strong></Link>
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
                            Tem certeza que deseja remover este usuário? Esta ação não pode ser desfeita.
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