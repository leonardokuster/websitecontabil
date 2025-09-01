import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Box, CircularProgress, Alert, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Grid, Collapse, IconButton, Tooltip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, FormControl, Select, MenuItem } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { format, parse, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import PhoneMask from '@/components/form/masks/phone/PhoneMask';
import CpfMask from '@/components/form/masks/cpf/CpfMask';
import DateMask from '@/components/form/masks/date/DateMask';
import { useFormik } from 'formik';
import * as yup from 'yup';

export default function UserList() {
    const [open, setOpen] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingUserId, setEditingUserId] = useState(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [userToDeleteId, setUserToDeleteId] = useState(null);

    const formik = useFormik({
       initialValues: {
            nome: '',
            emailPessoal: '',
            telefonePessoal: '',
            cpf: '',
            dataNascimento: '',
            tipo: '',
        },
        validationSchema: yup.object({
            nome: yup.string().required('Nome é obrigatório'),
            telefonePessoal: yup.string().required('Telefone é obrigatório'),
            emailPessoal: yup.string().email('E-mail inválido').required('Obrigatório'),
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
            cpf: yup.string().required('CPF é obrigatório'),
        }),
        onSubmit: async (values) => {
            try {
                const valuesToSend = { ...values };

                if (valuesToSend.dataNascimento) {
                    const parsedDate = parse(valuesToSend.dataNascimento, 'dd/MM/yyyy', new Date());

                    valuesToSend.dataNascimento = format(parsedDate, 'yyyy-MM-dd');
                }


                await axios.put(`http://localhost:3001/user/${editingUserId}`, valuesToSend, { withCredentials: true });
                setUsers(users.map(user => 
                    user.id === editingUserId ? { ...user, ...valuesToSend } : user
                ));
                setEditingUserId(null); 
                formik.resetForm(); 
            } catch (err) {
                console.error('Erro ao salvar usuário:', err);
                setError('Falha ao salvar as alterações do usuário.');
            }
        },
    });

    useEffect(() => {
        const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:3001/user/', { withCredentials: true });
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
            await axios.delete(`http://localhost:3001/user/${userToDeleteId}`, { withCredentials: true });
            setUsers(users.filter(user => user.id !== userToDeleteId));
            setIsDeleteDialogOpen(false);
            setUserToDeleteId(null);
        } catch (err) {
            console.error('Erro ao remover usuário:', err);
            setError('Falha ao remover o usuário.');
        }
    };

    const handleEditUser = (user) => {
        setEditingUserId(user.id);
        const formattedUser = {
            ...user,
            dataNascimento: user.dataNascimento
                ? format(parse(user.dataNascimento, 'yyyy-MM-dd', new Date()), 'dd/MM/yyyy')
                : '',
        };
        formik.setValues(formattedUser);
    };

    const handleCancelEdit = () => {
        setEditingUserId(null); 
        formik.resetForm();
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
        <Box>
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
                                        
                                    </TableRow>

                                    {/* Área colapsada */}
                                    <TableRow>
                                        <TableCell style={{ paddingBottom: 0, paddingTop: 0, backgroundColor: '#F4F4F4', borderRadius: '0px 0px 40px 40px'}} colSpan={2}>
                                            <Collapse in={open === user.id} timeout='auto' unmountOnExit>
                                                <Box sx={{ p: 2, width: '100%' }}>
                                                    <Grid container spacing={{ xs: 2, md: 6 }}>
                                                        <Grid item size={{ xs: 12, md: 2 }}>
                                                            <Typography variant='subtitle2' color='text.secondary'>E-mail</Typography>
                                                            {editingUserId === user.id ? (
                                                                <TextField
                                                                    fullWidth                                                                    
                                                                    id="emailPessoal"
                                                                    name="emailPessoal"
                                                                    size='small'
                                                                    value={formik.values.emailPessoal}
                                                                    onChange={formik.handleChange}
                                                                />
                                                            ) : (
                                                                <Typography>{user.emailPessoal}</Typography>
                                                            )}
                                                        </Grid>
                                                        <Grid item size={{ xs: 12, md: 2 }}>
                                                            <Typography variant='subtitle2' color='text.secondary'>Telefone</Typography>
                                                            {editingUserId === user.id ? (
                                                                <TextField
                                                                    fullWidth                                                                    
                                                                    id="telefonePessoal"
                                                                    name="telefonePessoal"
                                                                    size='small'
                                                                    value={formik.values.telefonePessoal}
                                                                    onChange={formik.handleChange}
                                                                    slotProps={{
                                                                        input: { inputComponent: PhoneMask }
                                                                    }}
                                                                />
                                                            ) : (
                                                                <Typography>{user.telefonePessoal}</Typography>
                                                            )}
                                                        </Grid>
                                                        <Grid item size={{ xs: 12, md: 2 }}>
                                                            <Typography variant='subtitle2' color='text.secondary'>CPF</Typography>
                                                            {editingUserId === user.id ? (
                                                                <TextField
                                                                    fullWidth                                                                    
                                                                    id="cpf"
                                                                    name="cpf"
                                                                    size='small'
                                                                    value={formik.values.cpf}
                                                                    onChange={formik.handleChange}
                                                                    slotProps={{
                                                                        input: { inputComponent: CpfMask }
                                                                    }}
                                                                />
                                                            ) : (
                                                                <Typography>{user.cpf}</Typography>
                                                            )}
                                                        </Grid>
                                                        <Grid item size={{ xs: 12, md: 2 }}>
                                                            <Typography variant='subtitle2' color='text.secondary'>Nascimento</Typography>
                                                            {editingUserId === user.id ? (
                                                                <TextField
                                                                    fullWidth                                                                    
                                                                    id="dataNascimento"
                                                                    name="dataNascimento"
                                                                    size='small'
                                                                    value={formik.values.dataNascimento}
                                                                    onChange={formik.handleChange}
                                                                    onBlur={formik.handleBlur} 
                                                                    slotProps={{
                                                                        inputLabel: { shrink: true },
                                                                        input: { inputComponent: DateMask }
                                                                    }}
                                                                />
                                                            ) : (
                                                                <Typography>
                                                                    {user.dataNascimento
                                                                        ? format(parse(user.dataNascimento, 'yyyy-MM-dd', new Date()), 'dd/MM/yyyy', { locale: ptBR })
                                                                        : '-'}
                                                                </Typography>
                                                            )}
                                                        </Grid>
                                                        <Grid item size={{ xs: 12, md: 2 }}>
                                                            <Typography variant='subtitle2' color='text.secondary'>Tipo</Typography>
                                                            {editingUserId === user.id ? ( 
                                                                <FormControl fullWidth size="small">
                                                                    <Select
                                                                        name="tipo"                                                                        
                                                                        value={formik.values.tipo}
                                                                        onChange={formik.handleChange}
                                                                        error={formik.touched.tipo && Boolean(formik.errors.tipo)}                                                                    
                                                                    >
                                                                        <MenuItem value="admin">Admin</MenuItem>
                                                                        <MenuItem value="collaborator">Collaborator</MenuItem>
                                                                        <MenuItem value="user">User</MenuItem>
                                                                    </Select>
                                                                </FormControl>
                                                            ) : (
                                                                <Typography>{user.tipo}</Typography>
                                                            )}
                                                        </Grid>
                                                        <Grid item size={{ xs: 12, md: 2 }}>
                                                            <Typography variant='subtitle2' color='text.secondary'>Ações</Typography>
                                                            {editingUserId === user.id ? (
                                                                <Box>
                                                                    <Tooltip title="Salvar">
                                                                        <IconButton onClick={formik.handleSubmit}>
                                                                            <SaveIcon color="primary" />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                    <Tooltip title="Cancelar">
                                                                        <IconButton onClick={handleCancelEdit}>
                                                                            <CancelIcon color="action" />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                </Box>
                                                            ) : (
                                                                <Box>
                                                                    <Tooltip title='Editar'>
                                                                        <IconButton
                                                                            aria-label='Editar usuário'
                                                                            size='small'
                                                                            onClick={() => handleEditUser(user)}
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
                                                                </Box>
                                                            )}
                                                        </Grid>   
                                                    </Grid>
                                                </Box>

                                                <Typography variant='body2' component='div' m={2}>{user.possuiEmpresa ? 'Deseja visualizar empresa(s) existente(s)?' : 'Deseja cadastrar uma nova empresa?'}</Typography>

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
        </Box>
    )
}