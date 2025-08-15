'use client';

import React from 'react';
import Link from 'next/link';
import ButtonComponent from '@/components/button/Button';
import { Box, Typography, Grid, Container } from '@mui/material';
import Image from 'next/image';

export default function About() {

    const aboutData = {
        textContent: [
            "Iniciando sua carreira profissional como servente de pedreiro, o contador Lauro Roque Küster aprendeu os valores fundamentais do trabalho árduo e persistência.",
            "Após essa fase inicial, ele ingressou na recepção de uma indústria de balas, onde dedicou seis anos de sua vida ao desenvolvimento de habilidades interpessoais e ao entendimento prático das operações de uma empresa.",
            "A guinada decisiva ocorreu quando ele se juntou ao departamento pessoal na empresa Hoeltz & Cia Ltda, uma indústria metalúrgica renomada na época. Durante 19 anos, ele desempenhou um papel crucial e acumulou conhecimentos valiosos do ambiente corporativo.",
            "Em 1982, buscando ampliar seus conhecimentos, o profissional iniciou um curso técnico em contabilidade no Colégio Marista São Luiz, marcando o início de uma nova fase em sua carreira.",
            "Após a conclusão do curso técnico, Lauro deu um passo corajoso e estabeleceu um pequeno escritório contábil em um dos cômodos de sua residência. Essa iniciativa, embora com desafios iniciais, foi a semente para o crescimento futuro. Intercalando suas responsabilidades na empresa Hoeltz, buscava equilibrar a estabilidade financeira com a construção de seu próprio negócio.",
            "Confrontando a dificuldade incial de atrair clientes, Lauro persistiu. Oferecia seus serviços, muitas vezes sem obter respostas imediatas. Contudo, o primeiro cliente foi o ponto de virada. A qualidade de seu trabalho, somado ao 'boca a boca' positivo, começou a atrair uma clientela crescente, expandindo seu negócio para uma sala improvisada nos fundos de sua casa.",
            "O ano 2000 marcou uma nova conquista significativa, quando ele adquiriu um terreno no centro da cidade. Neste local, construiu sua atual residência com um pequeno escritório em frente, expandindo sua capacidade de atendimento. A contratação de mais dois funcionários fortaleceu a equipe, permitindo-lhe oferecer serviços mais abrangentes e eficientes.",
            "Paralelamente ao gerenciamento do escritório contábil, Lauro decidiu buscar ainda mais conhecimento acadêmico. Matriculou-se no curso de Ciências Contábeis na Universidade de Santa Cruz do Sul (UNISC), estudando nos finais de semana.",
            "O escritório continuou a prosperar, culminando na construção de um novo espaço. Atualmente, a equipe é formada por 6 funcionários e atende a aproximadamente 300 empresas."
        ],
        servicesLink: "/services",
        budgetLink: "/budget",
    }

    const firstHalf = aboutData.textContent.slice(0, 2);
    const secondHalf = aboutData.textContent.slice(2);

    return (
        <Box component="main" sx={{ p: 4 }}>
            <Container maxWidth="lg">
                <Typography variant="h3" component="h1" gutterBottom sx={{ textAlign: 'center' }}>
                    SOBRE NÓS
                </Typography>

                <Grid container >
                    <Grid item size={12}>
                        {firstHalf.map((paragraph, index) => (
                            <Typography key={index} variant="body1" sx={{ mb: 2, textAlign: 'left' }}>
                                {paragraph}
                            </Typography>
                        ))}
                    </Grid>

                    <Grid container item spacing={2}>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            {secondHalf.map((paragraph, index) => (
                                <Typography key={index} variant="body1" sx={{ mb: 2, textAlign: 'left' }}>
                                    {paragraph}
                                </Typography>
                            ))}
                        </Grid>
                        <Grid item size={6}>
                            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                                <Image src="/images/img-escritorio.webp" alt="Representação de um escritório de três andares" width={1176} height={950} layout="responsive" objectFit="contain" />
                                <Box sx={{ display: 'flex', gap: 2, flexDirection: 'row', alignItems: 'center', mt: 4 }}>
                                    <Link href="/services" passHref>
                                        <ButtonComponent type='info' label='Conheça nossos serviços' />
                                    </Link>
                                    <Link href="/budget" passHref>
                                        <ButtonComponent type='info' label='Solicite um orçamento' />
                                    </Link>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>

                    <Grid item size={12} sx={{ display: { xs: 'block', md: 'none' } }}>
                        <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column', alignItems: 'center', mt: 4 }}>
                            <Link href="/services" passHref>
                                <ButtonComponent type='info' label='Conheça nossos serviços' />
                            </Link>
                            <Link href="/budget" passHref>
                                <ButtonComponent type='info' label='Solicite um orçamento' />
                            </Link>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
