import React from 'react';
import Link from 'next/link';
import styles from '@/components/footer/footer.module.css';
import Image from 'next/image';

export default function Footer() {
  return (
    <div className={styles['footer']}>
        <div className={styles['section']} style={{ alignSelf: 'center' }}>
            <Link href="/"><Image src="/images/Logo.webp" alt="Logo do escritório" className={styles['logo']} width={136} height={50}/></Link>
            <p className={styles['paragrafo']} style={{lineHeight: '2em'}}>Conduzindo o seu caminho para o sucesso empresarial, onde a excelência se encontra com a dedicação.</p>
        </div>
        <div className={styles['section']}>
            <h2 className={styles['titulo']}>Navegação</h2>
            <Link href="/">
                <p className={styles['paragrafo']}>Home</p>
            </Link>
            <Link href="/about">
                <p className={styles['paragrafo']}>Sobre nós</p>
            </Link>
            <Link href="/services">
                <p className={styles['paragrafo']}>Soluções</p>
            </Link>
            <Link href="/contact">
                <p className={styles['paragrafo']}>Contato</p>
            </Link>
            <Link href="/budget">
                <p className={styles['paragrafo']}>Orçamento</p>
            </Link>
            <Link href="/login">
                <p className={styles['paragrafo']}>Área do cliente</p>
            </Link>
        </div>

        <div className={styles['section']}>
            <h2 className={styles['titulo']}>Encontre-nos</h2>
            <div className={styles['contact']}>
                <Link href="tel:+555130564216"><Image src="/images/phone-16.webp" alt="Ícone telefone" width={16} height={16}/></Link>
                <Link href="tel:+555130564216">
                    <p className={styles['paragrafo']}>(51) 3056-4216</p>
                </Link><br/>
            </div>
            <div className={styles['contact']}>
                <Link href="https://wa.me/5551999947374" target="_blank"><Image src="/images/whatsapp-16.webp" alt="Ícone whatsapp" width={16} height={16}/></Link>
                <Link href="https://wa.me/5551999947374" target="_blank">
                    <p className={styles['paragrafo']}>(51) 99994-7374</p>
                </Link><br/>
            </div>
            <div className={styles['contact']}>
                <Link href="mailto:atendimento@escritoriokuster.com.br" target="_blank"><Image src="/images/mail-16.webp" alt="Ícone email" width={16} height={16}/></Link>
                <Link href="mailto:atendimento@escritoriokuster.com.br" target="_blank">
                    <p className={styles['paragrafo']}>atendimento@escritoriokuster.com.br</p>
                </Link><br/>
            </div>
            <div className={styles['contact']}>
                <Image src="/images/location-16.webp" alt="Ícone localização" width={16} height={16}/>
                <p className={styles['paragrafo']}>R. Sete de Setembro, 980 - Centro </p> <br/>
            </div>
            <p className={styles['paragrafo']} id={styles['cidade']}>Santa Cruz do Sul/RS</p>
        </div>
    </div>
  );
}
