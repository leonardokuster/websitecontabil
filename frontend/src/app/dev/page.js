'use client';
import React from 'react';
import { Stack } from '@mui/material';
import ButtonComponent from '@/components/button/Button';
import FeedbackCard from '@/components/card/Card';
import Carousel from '@/components/carousel/Carousel';
import LoginForm from '@/components/form/loginForm/LoginForm';
import ContactForm from '@/components/form/contactForm/ContactForm';
import SignupForm from '@/components/form/signupForm/SignupForm';
import BackToTopButton from '@/components/backToTop/backToTopButton';
import ResponsiveTabs from '@/components/responsiveTabs/ResponsiveTabs';


export default function Page() {
    return (
        <>
            <div style={{ padding: '20px' }}>
                <h1>Development Page</h1>
                <Stack direction="row" spacing={2}>
                    <ButtonComponent type="action" label="Botão de ação" />
                    <ButtonComponent type="delete" label="Botão de exclusão" />
                    <ButtonComponent type="info" label="Botão de informação" />
                    <ButtonComponent type="save" label="Botão de salvar"  />

                    <ButtonComponent type="back" label="Voltar" />
                </Stack>
                
                <FeedbackCard 
                    photo="/images/perfil1.webp"
                    name="Rodrigo Silva - Mercado Santiago" 
                    message="lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." 
                />
            </div>
            <div>
                <Carousel />
            </div>
            <div>
                <h2>Formulários</h2>
                <div style={{ width: '50%', alignContent: 'center', margin: '0 auto' }}>
                    <h2>Login:</h2>
                    <LoginForm />
                </div>
                <div style={{ width: '50%', alignContent: 'center', margin: '0 auto' }}>
                    <h2>Contato:</h2>
                    <ContactForm
                        showSecondTextField={true}
                        showSecondButton={{ enabled: true, link: "/services", target: "_self" }}
                        secondButtonText= "Conheça todos os serviços"
                    />
                </div>
                <div style={{ width: '50%', alignContent: 'center', margin: '0 auto' }}>
                    <h2>Cadastro:</h2>
                    <SignupForm />
                </div>
            </div>
            <BackToTopButton />
            <ResponsiveTabs />
        </>
    );
}