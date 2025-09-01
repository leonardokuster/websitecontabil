'use client';

import React, { useState } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import Image from 'next/image';
import LoginForm from '@/components/form/loginForm/LoginForm';
import SignupForm from '@/components/form/signupForm/SignupForm';
import Link from 'next/link';

export default function Login() {
    const [showLoginForm, setShowLoginForm] = useState(true);

    const handleToggleForm = (e) => {
        e.preventDefault();
        setShowLoginForm(!showLoginForm);
    };

    return (
        <Box 
            component="main" 
            sx={{ 
                display: 'flex', 
                justifyContent: 'space-around', 
                alignItems: 'center', 
                minHeight: '80vh', 
                p: 4
            }}
        >
            <Grid container spacing={2} alignItems="center" justifyContent="center">
                <Grid item size={{ xs: 12, md: showLoginForm ? 6 : 10 }}>
                    <Box sx={{ mx: 'auto', textAlign: 'center' }}>
                        {showLoginForm ? <LoginForm /> : <SignupForm />}
                        <Typography variant="body2" sx={{ mt: 2 }}>
                            {showLoginForm ? "Ainda não tem uma conta? " : "Já possui uma conta? "}
                            <Link href="#" onClick={handleToggleForm}>
                                <strong>{showLoginForm ? "Cadastre-se" : "Faça o login"}</strong>
                            </Link>
                        </Typography>
                    </Box>
                </Grid>

                {showLoginForm && (
                    <Grid item size={6}>
                        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                            <Image src="/images/login.png" alt="Mãos mexendo no celular" width={400} height={400} layout="responsive" objectFit="contain"/>
                        </Box>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
}
