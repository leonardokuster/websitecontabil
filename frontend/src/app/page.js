'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Box, Typography, Divider, Grid, Container } from '@mui/material';
import Carousel from '@/components/carousel/Carousel';
import ButtonComponent from '@/components/button/Button';
import ContactForm from '@/components/form/contactForm/ContactForm';

export default function Home() {

    const homeData = {
        welcoming: "Seja bem vindo(a)!",
        welcomingText: "Sua jornada contábil começa aqui, onde a excelência é mais que um serviço, é uma promessa.",
        solutionsText: "Confira nossas soluções para impulsionar seu negócio",
        solutionsButton: "Conheça todos os serviços",
        officeSectionContent: [
            "Fundado em 1986, o escritório iniciou-se em um dos cômodos da residência do contador Lauro Roque Küster. Embora houvessem muitos desafios iniciais com a captação de novos clientes, Lauro persistia na prosperação de seu próprio negócio enquanto tentava equilibrar a estabilidade financeira através de um trabalho de meio período numa metalúrgica.",
            "A qualidade de seu trabalho, somado ao 'boca a boca' positivo, começou a atrair uma clientela crescente, expandindo seu negócio para uma sala improvisada nos fundos de sua casa.",
            "O ano 2000 marcou uma nova conquista significativa, quando ele adquiriu um terreno no centro da cidade. Neste local, construiu sua atual residência com um pequeno escritório em frente, expandindo sua capacidade de atendimento. A contratação de mais dois funcionários fortaleceu a equipe, permitindo-lhe oferecer serviços mais abrangentes e eficientes.",
            "O escritório continuou a prosperar, culminando na construção de um novo espaço. Atualmente, a equipe é formada por 6 funcionários e atende a aproximadamente 300 empresas."
        ],
        aboutLink: "/about",
        contactLink: "/contact",
        budgetLink: "/budget",
    }

    return (
        <Box component="main" >
            <Grid container ml={4} mr={4} alignItems="center" justifyContent="space-between">
                <Grid item size={{ xs: 12, md: 6 }}>
                <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                    <Typography variant="h6" component="h3" color="primary" sx={{ mb: 2, mt: 3 }}>
                    {homeData.welcoming}
                    </Typography>
                    <Typography variant="h5" component="h2" sx={{ mb: 4 }}>
                    {homeData.welcomingText}
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: { xs: 'center', md: 'flex-start' }, alignItems: 'center', gap: 2 }}>
                    <Link href={homeData.aboutLink} passHref>
                        <ButtonComponent type='info' label='Sobre a empresa' />
                    </Link>
                    <Link href={homeData.contactLink} passHref>
                        <Typography variant="subtitle1" component="h3" color="text.primary">
                        Fale com um especialista
                        </Typography>
                    </Link>
                    </Box>
                </Box>
                </Grid>
                <Grid size={6} >
                    <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                        <Image src="/images/img-inicial.webp" alt="Grupo de pessoas trabalhando" width={920} height={360} layout="responsive" objectFit="contain" />
                    </Box>
                </Grid>
            </Grid>
          
            <Grid container sx={{ margin: 4 }} alignItems="center" justifyContent={{ xs: 'center', md: 'space-between' }}>
                <Grid item >
                    <Typography variant="h6" component="h2" sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                        {homeData.solutionsText}
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
          
            <Grid container spacing={8} sx={{ ml: 8, mr: 8 }} alignItems="center" justifyContent="center">
                <Grid item size={6}>
                <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                    <Image src="/images/img-gestao.webp" alt="Imagem de lupa analisando tabelas" width={436} height={366} layout="responsive" objectFit="contain" />
                </Box>
                </Grid>
                <Grid item size={{ xs: 12, md: 6 }}>
                <Box sx={{ textAlign: { xs: 'center', md: 'left' }, mt: { xs: '0px', md: '50px' } }}>
                    <Typography variant="h5" component="h1" gutterBottom>
                    
                    </Typography>
                    <Typography >
                    </Typography>
                    <ContactForm
                        title="Otimize sua gestão empresarial"
                        subtitle="Nossa equipe está pronta para impulsionar sua contabilidade para o sucesso!" 
                        showSecondTextField={false}
                        showSecondButton={false}
                        secondButtonText=''
                        buttonWidth= '100%'
                    />
                </Box>
                </Grid>
            </Grid>
          
            <Divider sx={{ mt: 8, mb: 4 }} />

            <Grid container spacing={4} sx={{ ml: 4, mr: 4 }} alignItems="center" justifyContent="center">
                <Grid item size={12}>
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h3" component="h1" gutterBottom>
                    O ESCRITÓRIO
                    </Typography>
                </Box>
                </Grid>
                {homeData.officeSectionContent.map((paragraph, index) => (
                <Grid item key={index}>
                    <Typography variant="h6" sx={{ textAlign: 'left' }}>
                    {paragraph}
                    </Typography>
                </Grid>
                ))}
                <Grid item mt={4} mb={6} sx={{ textAlign: 'center' }}>
                <Link href={homeData.budgetLink} passHref>
                    <ButtonComponent type='info' label='Solicite um orçamento' />
                </Link>
                </Grid>
            </Grid>
        </Box>
    );
}
