'use client';

import React, { useState, useEffect } from 'react';
import { Grid, Box, Divider } from '@mui/material';
import ContactForm from '@/components/form/contactForm/ContactForm';
import Carousel from '@/components/carousel/Carousel';
import Image from 'next/image';
import Cookies from 'js-cookie';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';

const getLoggedInUserId = () => Cookies.get('usuario_id');

export default function ServicesPage() {
    const loggedInUserId = getLoggedInUserId();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const fetchUserData = async () => {
            if (!loggedInUserId) {
                setLoading(false);
                return;
            }
            try {
                const response = await axios.get(`/api/users/${loggedInUserId}`);
                setUserData(response.data);
            } catch (error) {
                console.error('Erro ao buscar dados do usuário:', error);
            } finally {
                setLoading(false); 
            }
        };

        fetchUserData();
    }, [loggedInUserId]);

    return (
        <Box 
            sx={{
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column', 
                alignItems: 'center',
                minHeight: '85vh',
                p: 2
            }}
        >
            <Grid container spacing={{ xs: 0, md: 5}} p={4} alignItems="center" justifyContent="center">
                <Grid item size={6}>
                <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                    <Image src="/images/img-gestao.webp" alt="Imagem de lupa analisando tabelas" width={436} height={366} layout="responsive" objectFit="contain" />
                </Box>
                </Grid>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <CircularProgress /> 
                    </Box>
                ) : (
                    <Grid item size={{ xs: 12, md: 6 }}>
                        <ContactForm
                            initialData={userData}
                            title='Solicite um Orçamento'
                            subtitle='Envie uma mensagem para nossa equipe e receba um orçamento personalizado.'
                            showSecondTextField={true}
                            showSecondButton={{ enabled: true, link: "https://wa.me/5551999947374", target: "_blank" }}
                            secondButtonText="Ou fale por Whatsapp"
                            buttonWidth= '100%'
                        />
                    </Grid>
                )}
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