'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import Cookies from 'js-cookie';
import {
  Typography,
  Container,
  Paper,
  Box,
  TextField,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { motion } from 'framer-motion';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const getLoggedInUserId = () => Cookies.get('usuario_id');

// validação da troca de senha
const validationSchema = yup.object({
  senhaAtual: yup.string().required('Digite sua senha atual'),
  novaSenha: yup.string().min(6, 'Mínimo 6 caracteres').required('Digite a nova senha'),
  confirmarSenha: yup
    .string()
    .oneOf([yup.ref('novaSenha'), null], 'As senhas não coincidem')
    .required('Confirme a nova senha'),
});

export default function SettingsPage() {
    const router = useRouter();
    const [message, setMessage] = useState('');
    const [editingPassword, setEditingPassword] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [userToDeleteId, setUserToDeleteId] = useState(null);

    const formik = useFormik({
        initialValues: {
            senhaAtual: '',
            novaSenha: '',
            confirmarSenha: '',
        },
        validationSchema,
        onSubmit: async (values, { resetForm }) => {
            setMessage('');

            const userId = getLoggedInUserId();

            if (!userId) {
                setMessage('Você precisa estar logado para mudar a senha.');
                return;
            }

            try {
                await axios.put(`http://localhost:3001/users/changePassword/${userId}`, 
                { 
                    currentPassword: values.senhaAtual,
                    newPassword: values.novaSenha,
                },
                {
                    withCredentials: true
                }
                );

                setMessage('Senha alterada com sucesso!');
                resetForm();
                setEditingPassword(false);
            } catch (err) {
                console.error('Erro ao mudar senha:', err);
                setMessage(err.response?.data?.message || 'Erro ao mudar a senha. Tente novamente.');
            }
        },
    });

    const handleDeleteAccount = () => {
        const userId = getLoggedInUserId();
        if (!userId) return;
        setUserToDeleteId(userId);
        setIsDeleteDialogOpen(true);
    };


    const confirmDelete = async () => {
        if (!userToDeleteId) return;

        try {
            await axios.delete(`http://localhost:3001/users/${userToDeleteId}`, { withCredentials: true });
            setIsDeleteDialogOpen(false);
            setUserToDeleteId(null);
            Cookies.remove('usuario_id'); 
            router.push('/login'); 
        } catch (err) {
            console.error('Erro ao remover usuário:', err);
            setMessage('Falha ao remover a conta.');
        }
    };

    return (
        <Box 
            component='main'
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                p: 2,
            }}
        >
            <Paper elevation={3} sx={{ p: 4, maxWidth: 600, borderRadius: '16px'}}>
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <Typography variant="h5" gutterBottom>
                        Configurações
                    </Typography>
                    
                    {!editingPassword ? (
                        <>
                        `<Typography variant="body1" gutterBottom>
                            Deseja alterar a senha?
                        </Typography>
                            <Button
                                variant="contained"
                                onClick={() => setEditingPassword(true)}
                                sx={{ 
                                    mt: 2,
                                    bgcolor: 'var(--cordestaque)',
                                    color: 'white',
                                    '&:hover': {
                                        bgcolor: 'var(--corhover)',
                                    },
                                }}
                            >
                                Alterar senha
                            </Button>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="body1" gutterBottom sx={{ my: 2 }}> 
                                Excluir conta
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom sx={{ my: 2 }}>
                                Esta ação não pode ser desfeita. Todos os seus dados serão removidos.
                            </Typography>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={handleDeleteAccount}
                            >
                                Excluir minha conta
                            </Button>
                        </>
                    ) : (
                        <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 2 }}>
                            <Typography variant="body1" gutterBottom>
                                Alterar senha
                            </Typography>
                            {message && (
                                <Typography color={message.includes('sucesso') ? 'primary' : 'error'} sx={{ mt: 2 }}>
                                    {message}
                                </Typography>
                            )}
                            <TextField
                                fullWidth
                                margin="normal"
                                id="senhaAtual"
                                name="senhaAtual"
                                label="Senha atual"
                                type={showCurrentPassword ? 'text' : 'password'}
                                value={formik.values.senhaAtual}
                                onChange={formik.handleChange}
                                error={formik.touched.senhaAtual && Boolean(formik.errors.senhaAtual)}
                                helperText={formik.touched.senhaAtual && formik.errors.senhaAtual}
                                InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                    <IconButton onClick={() => setShowCurrentPassword((prev) => !prev)}>
                                        {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                    </InputAdornment>
                                ),
                                }}
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                id="novaSenha"
                                name="novaSenha"
                                label="Nova senha"
                                type={showNewPassword ? 'text' : 'password'}
                                value={formik.values.novaSenha}
                                onChange={formik.handleChange}
                                error={formik.touched.novaSenha && Boolean(formik.errors.novaSenha)}
                                helperText={formik.touched.novaSenha && formik.errors.novaSenha}
                                InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                    <IconButton onClick={() => setShowNewPassword((prev) => !prev)}>
                                        {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                    </InputAdornment>
                                ),
                                }}
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                id="confirmarSenha"
                                name="confirmarSenha"
                                label="Confirme a nova senha"
                                type={showConfirmNewPassword ? 'text' : 'password'}
                                value={formik.values.confirmarSenha}
                                onChange={formik.handleChange}
                                error={formik.touched.confirmarSenha && Boolean(formik.errors.confirmarSenha)}
                                helperText={formik.touched.confirmarSenha && formik.errors.confirmarSenha}
                                InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                    <IconButton onClick={() => setShowConfirmNewPassword((prev) => !prev)}>
                                        {showConfirmNewPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                    </InputAdornment>
                                ),
                                }}
                            />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                                <Button
                                    variant="outlined"
                                    onClick={() => setEditingPassword(false)}
                                    sx={{
                                        color: 'var(--cordestaque)',
                                        bgcolor: 'white',
                                        border: '1px solid var(--cordestaque)',
                                    }}
                                >
                                    Cancelar
                                </Button>
                                <Button 
                                    type="submit" 
                                    variant="contained"
                                    disabled={formik.isSubmitting}
                                    sx={{
                                        bgcolor: 'var(--cordestaque)',
                                        color: 'white',
                                        '&:hover': {
                                            bgcolor: 'var(--corhover)',
                                        },
                                    }}
                                >
                                    {formik.isSubmitting ? <CircularProgress size={24} /> : 'Mudar Senha'}
                                </Button>
                            </Box>
                        </Box>
                    )}
                </motion.div>
                <Dialog
                    open={isDeleteDialogOpen}
                    onClose={() => setIsDeleteDialogOpen(false)}
                >
                    <DialogTitle>Confirma exclusão?</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Esta ação não pode ser desfeita. Todos os seus dados serão removidos.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancelar</Button>
                        <Button color="error" onClick={confirmDelete}>Excluir</Button>
                    </DialogActions>
                </Dialog>
            </Paper>
        </Box>
    );
}