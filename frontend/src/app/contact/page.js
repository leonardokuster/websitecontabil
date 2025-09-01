'use client';

import * as React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import ContactForm from '@/components/form/contactForm/ContactForm';
import Image from 'next/image';

export default function Contact() {
    return (
        <Box component="main" sx={{ p: 4 }}>
            <Grid container spacing={{ xs: 4, md: 8 }} alignItems="center" justifyContent="center">
                <Grid item size={6}>
                    <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                        <Image src="/images/callcenter.webp" alt="Mulher atentendo telefone" width={500} height={441} layout="responsive" objectFit="contain" />
                    </Box>
                </Grid>
                
                <Grid item size={{ xs: 12, md: 6 }}>
                <Box >
                    <ContactForm 
                        title="Preencha o formulário abaixo que entraremos em contato com você!"
                        showSecondTextField={false}
                        showSecondButton={{ enabled: true, link: "/services", target: "_self" }}
                        secondButtonText="Conheça todos os serviços"
                    />
                </Box>
                </Grid>
            </Grid>   
        </Box>
    )
}