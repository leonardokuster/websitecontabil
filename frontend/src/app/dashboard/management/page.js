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
            router.push('/dashboard/management/user');
        } else {
            router.push('/dashboard/management/company');
        }
    }, [router]);

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
            <CircularProgress />
        </Container>
    );
}