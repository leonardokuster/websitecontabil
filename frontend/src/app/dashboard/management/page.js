'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { Container, CircularProgress } from '@mui/material';

export default function ManagementPage() {
    const router = useRouter();

    useEffect(() => {
        const storedUserType = Cookies.get('tipo');

        const isAuthorized = ['admin', 'collaborator'].includes(storedUserType);

        if (isAuthorized) {
            // Redireciona para a página de gerenciamento de usuários
            router.push('/dashboard/management/user');
        } else {
            // Redireciona para a página de gerenciamento da empresa
            router.push('/dashboard/management/company');
        }
    }, [router]);

    // Exibe um spinner de carregamento enquanto o redirecionamento ocorre
    return (
        <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <CircularProgress />
        </Container>
    );
}