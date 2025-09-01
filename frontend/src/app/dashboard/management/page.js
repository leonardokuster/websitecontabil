'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { Container, Typography, CircularProgress, Box, Paper } from '@mui/material';
import UserList from '@/app/dashboard/components/userList'; // Componente que lista todos os usuários
import CompanySection from '@/app/dashboard/components/companyList'; // Componente que gerencia a empresa

export default function ManagementPage() {
    const [userType, setUserType] = useState(null);
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = Cookies.get('token');
        const storedUserType = Cookies.get('tipo');
        const storedUserId = Cookies.get('usuario_id');

        setUserType(storedUserType);
        setUserId(storedUserId);
        setLoading(false);

    }, []);

    if (loading) {
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
            </Container>
        );
    }

    const isAuthorized = ['admin', 'collaborator'].includes(userType);

    return (
        <Container component="main" sx={{ pt: 4, pb: 4 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: '16px' }}>
                {isAuthorized ? (
                    <UserList userId={userId} />
                ) : (
                    <CompanySection userId={userId} />
                )}
            </Paper>
        </Container>
    );
}