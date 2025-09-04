'use client';

import React from 'react';
import { Container, Typography, Grid, Box, Divider } from '@mui/material';
import ContactForm from '@/components/form/contactForm/ContactForm';
import Carousel from '@/components/carousel/Carousel';
import Image from 'next/image';

export default function ServicesPage() {
    return (
        <Box component="main">
            <Grid container spacing={{ xs: 0, md: 5}} p={4} alignItems="center" justifyContent="center">
                <Grid item size={6}>
                <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                    <Image src="/images/img-gestao.webp" alt="Imagem de lupa analisando tabelas" width={436} height={366} layout="responsive" objectFit="contain" />
                </Box>
                </Grid>
                <Grid item size={{ xs: 12, md: 6 }}>
                    <ContactForm
                        title='Solicite um Orçamento'
                        subtitle='Envie uma mensagem para nossa equipe e receba um orçamento personalizado.'
                        showSecondTextField={true}
                        showSecondButton={{ enabled: true, link: "https://wa.me/5551999947374", target: "_blank" }}
                        secondButtonText="Ou fale por Whatsapp"
                        buttonWidth= '100%'
                    />
                </Grid>
            </Grid>
            <Divider />
            <Carousel
                showButton={false}
                backgroundColor="white"
                cardColor="#070E26"
                textColor="white"
                titleColor="white"
            />
        </Box>
    );
}