'use client';

import React from 'react';
import Link from 'next/link';
import { Box, Grid, Typography } from '@mui/material';
import Image from 'next/image';
import ButtonComponent from '@/components/button/Button';
import ContactForm from '@/components/form/contactForm/ContactForm';
import Card from '@/components/card/Card';
import Carousel from '@/components/carousel/Carousel';

export default function Budget() {

    const budgetData = {
        formTitle: "Solicite agora seu orçamento!",
        solutionsText: "Confira nossas soluções para impulsionar seu negócio",
    }

    return (
        <Box component="main" >
            <Grid container spacing={4} sx={{ p: 4 }} alignItems="center" justifyContent="center">
                <Grid item size={{ xs: 12, md: 6 }} >
                    <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                    <ContactForm 
                        title="Solicite agora seu orçamento!"
                        showSecondTextField={true}
                        showSecondButton={{ enabled: true, link: "https://wa.me/5551999947374", target: "_blank" }}
                        secondButtonText="Ou fale por Whatsapp"
                    />
                    </Box>
                </Grid>
                <Grid item size={6}>
                    <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                    <Image src="/images/img-orcamento.webp" alt="Homem próximo a uma calculadora e prancheta, com um símbolo de dinheiro na mão" width={670} height={420} layout="responsive" objectFit="contain"/>
                    </Box>
                </Grid>
            </Grid>
        
            <Grid container sx={{ margin: 4 }} alignItems="center" justifyContent={{ xs: 'center', md: 'space-between' }}>
                <Grid item >
                    <Typography variant="h6" component="h2" sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                        {budgetData.solutionsText}
                    </Typography>
                </Grid>
                <Grid item sx={{ textAlign: 'right' }}>
                    <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                        <Link href="/services" passHref >
                        <ButtonComponent type='info' label='Conheça todos os serviços' />
                        </Link>
                    </Box>
                </Grid>
            </Grid>

            <Carousel />
                            
            <Grid container spacing={4} sx={{ p: 4 }} justifyContent="center">
                <Box 
                    size={6} 
                    sx={{ 
                        display: { xs: 'none', md: 'flex' }, 
                        bgcolor: 'var(--cordestaque)',
                        borderTopLeftRadius: '30px',
                        borderBottomLeftRadius: '30px',
                        justifyContent: 'center', 
                        alignItems: 'center',  
                        p: 5,
                        }}>
                    <Typography variant="h6" component="h2" sx={{ color: 'white', writingMode: 'sideways-lr' }}>
                        Feedback
                    </Typography>
                </Box>
                <Grid item size={{ xs: 12, md: 10 }}>
                    <Card 
                        photo="/images/perfil1.webp"
                        name="Rodrigo Cruz - Mercado Santiago"
                        message="Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam placeat quaerat facere iure reiciendis nisi, asperiores soluta cum nesciunt eos reprehenderit totam quae hic dolore iste veritatis temporibus molestias alias!"
                    />
                    <Card 
                        photo="/images/perfil2.webp"
                        name="Jéssica Pereira - Pizzaria Calabassas"
                        message="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Corporis alias provident sequi nobis et est aperiam dolore soluta nostrum rem, vero, corrupti debitis omnis eius assumenda! Neque reiciendis rem aperiam."
                    />
                    <Card 
                        photo="/images/perfil3.webp"
                        name="Laércio Gomes - Funilaria Vitória"
                        message="Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam placeat quaerat facere iure reiciendis nisi, asperiores soluta cum nesciunt eos reprehenderit totam quae hic dolore iste veritatis temporibus molestias alias!"
                    />
                </Grid>
            </Grid>
        </Box>
    );
}
