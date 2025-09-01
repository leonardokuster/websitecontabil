'use client';

import React from 'react';
import AliceCarousel from 'react-alice-carousel';
import Link from 'next/link';
import 'react-alice-carousel/lib/alice-carousel.css';
import ButtonComponent from '@/components/button/Button';

export default function Carousel({ 
    showButton = true, 
    backgroundColor = 'var(--cordestaque)', 
    cardColor = 'white', 
    textColor = '#444',
    titleColor = 'var(--cordestaque)',
}) {
    const slides = [
        { title: "Abertura de empresa", message: "Cuidamos dos aspectos burocráticos e contábeis provenientes da abertura de uma empresa, gerando maior economia de tempo e alívio das complexidades administrativas." },
        { title: "Assessoria trabalhista", message: "O entendimento das leis e normativas laborais é crucial para a sustentabilidade e sucesso de qualquer organização, evitando riscos e possíveis litígios trabalhistas." },
        { title: "Encerramento de empresa", message: "Atuando como um intermediário entre o cliente e os órgãos reguladores, evitamos possíveis implicações legais e financeiras para os sócios e proprietários durante o encerramento de uma empresa." },
        { title: "Escrituração Contábil e Tributária", message: "Garantimos o cumprimento das obrigações legais de sua empresa através do registro de todas operações financeiras, como receitas, despesas, compras, vendas e investimentos." },
        { title: "Obrigações acessórias", message: "Garantimos a conformidade legal de sua empresa através do monitoramento do cumprimento das obrigações tributárias e legais por parte dos órgãos governamentais." },
        { title: "Planejamento estratégico", message: "Através de estratégias financeiras e contábeis, buscamos otimizar o desempenho financeiro e promover a conformidade fiscal para contribuir para o crescimento sustentável do seu negócio." },
    ];

    const carouselBackgroundStyle = {
        padding: '3rem 1rem',
        backgroundColor: backgroundColor,
    };
    
    const carouselWrapperStyle = {
        maxWidth: '1200px',
        margin: '0 auto',
    };

    const carouselCardStyle = {
        borderRadius: '15px',
        padding: '1.5rem',
        margin: '0 10px',
        boxShadow: `0 4px 10px rgba(0, 0, 0, 0.1)`,
        minHeight: '250px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'transform 0.2s ease',
        alignItems: 'center',
    };

    const titleStyle = {
        fontSize: '1.25rem',
        fontWeight: 'bold',
        height: '70px',
        textAlign: 'center',
        color: titleColor,
    };

    const messageStyle = {
        fontSize: '0.95rem',
        flexGrow: 1,
        marginBottom: '1rem',
        color: textColor,
    };

    const items = slides.map((slide, index) => (
        <div 
            key={index} 
            style={{ 
                ...carouselCardStyle, 
                backgroundColor: cardColor 
            }}
        >
            <h1 style={titleStyle}>{slide.title}</h1>
            <p style={messageStyle}>{slide.message}</p>
            {showButton && (
                <Link href="/services">
                    <ButtonComponent type="info" label="Saiba mais" />
                </Link>
            )}
        </div>
    ));

    const responsive = {
        0: { items: 1 },
        768: { items: 2 },
        1024: { items: 3 },
    };

    return (
        <div style={carouselBackgroundStyle}>
            <div style={carouselWrapperStyle}>
                <AliceCarousel
                    mouseTracking
                    items={items}
                    responsive={responsive}
                    controlsStrategy="alternate" 
                    disableDotsControls={false}
                    disableButtonsControls={true}
                    infinite={true}
                />
            </div>
        </div>
    );
}