import React from "react";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import '@/styles/globals.css';
import Wrapper from "@/app/wrapper";

export const metadata = {
  title: 'Escritório Küster - Sua jornada contábil começa aqui',
  description: 'Seja bem-vindo ao escritório Küster, onde a excelência é mais do que um serviço, é uma promessa. Oferecemos soluções contábeis para impulsionar o seu negócio. Confira nossos serviços de abertura de empresa, assessoria trabalhista, encerramento de empresa, escrituração contábil e tributária, obrigações acessórias e planejamento estratégico. Otimize sua gestão empresarial conosco.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <Header />
        <Wrapper>{children}</Wrapper>
        <Footer />
      </body>
    </html>
  );
}
