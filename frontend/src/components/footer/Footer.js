'use client';

import React from 'react';
import { Grid, Box, Typography, Link as MuiLink } from '@mui/material';
import NextLink from 'next/link';
import Image from 'next/image';

const linkStyles = {
  textDecoration: 'none',
  color: 'inherit',
  '&:hover': {
    textDecoration: 'underline',
  },
};

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#070E26', 
        color: 'white',
        p: { xs: 3, md: 5 }, 
        borderTop: '1px solid #333',
        textAlign: { xs: 'center', md: 'left' },
      }}
    >
      <Grid container justifyContent="center">

        <Grid item size={{ xs: 12, md: 6 }}>
          <Box sx={{ mb: 2 }}>
            <NextLink href="/" passHref>
              <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                <Image src="/images/Logo.png" alt="Logo do escritório" width={260} height={50} />
              </Box>
              <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                <Image src="/images/LogoMobile.png" alt="Logo do escritório" width={70} height={50} />
              </Box>
            </NextLink>
          </Box>
          <Typography variant="body2" sx={{ lineHeight: '1.75em', color: 'rgba(255, 255, 255, 0.7)', width: {xs: 'none', md: '50%'} }}>
            Conduzindo o seu caminho para o sucesso empresarial, onde a excelência se encontra com a dedicação.
          </Typography>
        </Grid>

        <Grid item size={{ xs: 12, md: 3 }}>
          <Typography variant="h6" component="h2" gutterBottom>
            Navegação
          </Typography>
          <Box component="nav">
            {[
              { href: '/', label: 'Home' },
              { href: '/about', label: 'Sobre nós' },
              { href: '/services', label: 'Soluções' },
              { href: '/contact', label: 'Contato' },
              { href: '/budget', label: 'Orçamento' },
              { href: '/login', label: 'Área do cliente' },
            ].map((link) => (
              <MuiLink component={NextLink} href={link.href} key={link.href} sx={{ ...linkStyles, display: 'block', mb: 1 }}>
                <Typography variant="body2">{link.label}</Typography>
              </MuiLink>
            ))}
          </Box>
        </Grid>

        <Grid item size={{ xs: 12, md: 3 }}>
          <Typography variant="h6" component="h2" gutterBottom>
            Encontre-nos
          </Typography>
          <Box>
            <MuiLink href="tel:+555130564216" sx={{ ...linkStyles, display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, justifyContent: {xs: 'center', md: 'flex-start'}   }}>
              <Image src="/images/phone-16.webp" alt="Ícone telefone" width={16} height={16}/>
              <Typography variant="body2">(51) 3056-4216</Typography>
            </MuiLink>
            <MuiLink href="https://wa.me/5551999947374" target="_blank" sx={{ ...linkStyles, display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, justifyContent: {xs: 'center', md: 'flex-start'}  }}>
              <Image src="/images/whatsapp-16.webp" alt="Ícone whatsapp" width={16} height={16}/>
              <Typography variant="body2">(51) 99994-7374</Typography>
            </MuiLink>
            <MuiLink href="mailto:atendimento@escritoriokuster.com.br" target="_blank" sx={{ ...linkStyles, display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, justifyContent: {xs: 'center', md: 'flex-start'}  }}>
              <Image src="/images/mail-16.webp" alt="Ícone email" width={16} height={16}/>
              <Typography variant="body2">atendimento@escritoriokuster.com.br</Typography>
            </MuiLink>
            <Box sx={{ display: 'flex', alignItems: 'top', gap: 1, justifyContent: {xs: 'center', md: 'flex-start'}  }}>
              <Image src="/images/location-16.webp" alt="Ícone localização" width={16} height={16}/>
              <Box>
                <Typography variant="body2">R. Sete de Setembro, 980 - Centro</Typography>
                <Typography variant="body2">Santa Cruz do Sul/RS</Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}