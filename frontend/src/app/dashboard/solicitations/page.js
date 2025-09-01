'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Container,
    Typography,
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    CircularProgress,
    Alert,
    TablePagination,
    useMediaQuery,
    useTheme
} from '@mui/material';
import axios from 'axios';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function ContactsPage() {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const router = useRouter();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {

        const fetchContacts = async () => {
            try {
                const response = await axios.get('http://localhost:3001/contact/', { withCredentials: true });
                setContacts(response.data);
            } catch (err) {
                console.error('Erro ao carregar contatos:', err);
                setError('Não foi possível carregar os contatos. Verifique sua conexão ou tente novamente mais tarde.');
            } finally {
                setLoading(false);
            }
        };

        fetchContacts();
    }, []);

    const handleStatusChange = async (contactId, newStatus) => {
        try {
            await axios.patch(
                `http://localhost:3001/contact/${contactId}/status`,
                { status: newStatus },
                { withCredentials: true }
            );
            setContacts(prevContacts =>
                prevContacts.map(contact =>
                    contact.id === contactId ? { ...contact, status: newStatus } : contact
                )
            );
        } catch (err) {
            console.error('Erro ao atualizar status:', err);
            setError('Falha ao atualizar o status do contato. Tente novamente.');
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const getStatusChipProps = (status) => {
        switch (status) {
            case 'pendente':
                return { label: 'Pendente', color: 'warning' };
            case 'em_andamento':
                return { label: 'Em Andamento', color: 'info' };
            case 'atendido':
                return { label: 'Atendido', color: 'success' };
            default:
                return { label: status, color: 'default' };
        }
    };

    if (loading) {
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
            </Container>
        );
    }

    if (error) {
        return (
            <Container sx={{ pt: 4 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    const displayedContacts = contacts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Container component="main" sx={{ pt: 4, pb: 4 }}>
            <Paper elevation={3} sx={{ width: '100%', overflow: 'hidden', borderRadius: '16px' }}>
                <Typography variant="h4" component="h1" gutterBottom align="center" p={2}>
                    Gerenciamento de Contatos
                </Typography>
                
                {contacts.length === 0 ? (
                    <Box sx={{ textAlign: 'center', p: 4 }}>
                        <Typography variant="h6" color="textSecondary">
                            Nenhum contato encontrado.
                        </Typography>
                    </Box>
                ) : (
                    <TableContainer sx={{ maxHeight: 440 }}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Usuário</TableCell>
                                    <TableCell>Assunto</TableCell>
                                    {!isMobile && <TableCell>Recebido Em</TableCell>}
                                    <TableCell>Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {displayedContacts.map((contact) => (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={contact.id}>
                                        <TableCell>
                                            <Typography variant="subtitle2">{contact.fullname}</Typography>
                                            <Typography variant="caption" color="textSecondary">
                                                {contact.email}
                                            </Typography>
                                            <br/>
                                            <Typography variant="caption" color="textSecondary">
                                                {contact.phone}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="subtitle2">{contact.subject}</Typography>
                                            <Typography variant="caption" color="textSecondary">
                                                {contact.message}
                                            </Typography>
                                        </TableCell>
                                        {!isMobile && (
                                            <TableCell>
                                                {format(new Date(contact.createdAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                                            </TableCell>
                                        )}
                                        <TableCell>
                                            <FormControl variant="standard" sx={{ m: 1 }}>
                                                <InputLabel id="status-select-label">Status</InputLabel>
                                                <Select
                                                    labelId="status-select-label"
                                                    value={contact.status}
                                                    onChange={(e) => handleStatusChange(contact.id, e.target.value)}
                                                    label="Status"
                                                >
                                                    <MenuItem value="pendente">Pendente</MenuItem>
                                                    <MenuItem value="em_andamento">Em Andamento</MenuItem>
                                                    <MenuItem value="atendido">Atendido</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={contacts.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </Container>
    );
}