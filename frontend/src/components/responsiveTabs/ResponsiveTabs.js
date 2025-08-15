'use client';

import React from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import PropTypes from 'prop-types';
import Link from 'next/link';
import styles from '@/components/responsiveTabs/responsiveTabs.module.css';
import ButtonComponent from '@/components/button/Button';


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`responsive-tabpanel-${index}`}
      aria-labelledby={`responsive-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `responsive-tab-${index}`,
    'aria-controls': `responsive-tabpanel-${index}`,
  };
}

export default function ResponsiveTabs() {
  const [value, setValue] = React.useState(0);
  const [isMobile, setIsMobile] = React.useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  React.useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 767);
    }

    handleResize(); 
    window.addEventListener('resize', handleResize); 

    return () => {
      window.removeEventListener('resize', handleResize); 
    };
  }, []); 

  return (
    <Box
      sx={{ 
        flexGrow: 1, 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row', 
        minHeight: '100%',
        minWidth: '100%'}}
    >
      <Tabs
        orientation={isMobile ? 'horizontal' : 'vertical'}
        variant={isMobile ? 'scrollable' : 'standard'}
        value={value}
        scrollButtons={isMobile ? 'true' : 'false'}
        onChange={handleChange}
        aria-label="Responsive tabs"
        sx={{ 
          borderRight: isMobile ? 0 : 1, 
          borderColor: 'divider',  
          width: isMobile ? '100%' : '20%',
          paddingTop: isMobile ? '8px' : '50px'}}
          
      >
        <Tab label="Abertura de empresa" {...a11yProps(0)} />
        <Tab label="Assessoria trabalhista" {...a11yProps(1)} />
        <Tab label="Encerramento de empresa" {...a11yProps(2)} />
        <Tab label="Escrituração Contábil e Tributária" {...a11yProps(3)} />
        <Tab label="Obrigações acessórias" {...a11yProps(4)} />
        <Tab label="Planejamento estratégico" {...a11yProps(5)} />
      </Tabs>
      
      <Box sx={{ width: isMobile ? '100%' : '80%' }}>
        < TabPanel value={value} index={0} className={styles['conteudo']}>
          <h1 className={styles['titulo']}><span>Abertura de empresa</span></h1>
          <p className={styles['paragrafo']}>A abertura de uma empresa marca o início de uma jornada emocionante para o empresário, mas acaba sendo um processo burocrático que pode causar grandes dores de cabeça. Nesse contexto, nossa equipe atua de forma a garantir que todo o processo seja realizado de maneira eficiente e em conformidade com as leis e regulamentações vigentes. </p>
          <p className={styles['paragrafo']}>Inicialmente analisamos as características do negócio, considerando fatores como porte, natureza da atividade, estrutura de capital e projeções futuras. Com base nessa avaliação, orientamos na escolha da estrutura societária e guiamos os clientes na elaboração e apresentação da documentação necessária para o registro legal da empresa.</p>
          <p className={styles['paragrafo']} style={{marginBottom: 20 + 'px'}}>Ao contar com nosso escritório contábil durante a abertura de sua empresa, você beneficia-se não apenas do conhecimento técnico de nossa equipe, mas também da economia de tempo e do alívio das complexidades administrativas. Permitindo que os empreendedores foquem em suas visões de negócios, enquanto cuidamos dos aspectos burocráticos e contábeis.</p>
          <div style={{textAlign: 'center'}}>
            <Link href="/budget">
              <ButtonComponent type='info' label='Solicite um orçamento' />
            </Link>
          </div>
        </TabPanel>
        <TabPanel value={value} index={1} className={styles['conteudo']}>
          <h1 className={styles['titulo']}><span>Assessoria trabalhista</span></h1>
          <p className={styles['paragrafo']}>O entendimento das leis e normativas laborais é crucial para a sustentabilidade e sucesso de qualquer organização, evitando riscos e possíveis litígios trabalhistas.</p>
          <p className={styles['paragrafo']}>Algumas das principais obrigações trabalhistas oferecidas pelo escritório Küster incluem:</p>
          <ul className={styles['lista']} style={{marginBottom: 20 + 'px'}}>
            <li>Elaboração e revisão de contratos de trabalho;</li>
            <li>Cálculo e recolhimento de encargos sociais, como INSS (Instituto Nacional do Seguro Social) e FGTS (Fundo de Garantia do Tempo de Serviço);</li>
            <li> Folha de pagamento:</li>
            <ul>
              <li className={styles['sublista']}>Cálculo de salários, descontos, contribuições sociais e benefícios;</li>
              <li className={styles['sublista']}>Emissão de holerites e recibos de pagamento.</li>
            </ul>
            <li>Legislação trabalhista e atualizações;</li>
            <li>Auxílio na contratação e demissão de funcionários;</li>
            <li>Auditoria trabalhista;</li>
            <li>Calcular o pró-labore dos sócios ou recibo do único proprietário da empresa.</li>
          </ul>
          <div style={{textAlign: 'center'}}>
            <Link href="/budget">
              <ButtonComponent type='info' label='Solicite um orçamento' />
            </Link>
          </div>
        </TabPanel>
        <TabPanel value={value} index={2} className={styles['conteudo']}>
          <h1 className={styles['titulo']}><span>Encerramento de empresa</span></h1>
          <p className={styles['paragrafo']}>Encerrar as atividades de uma empresa pode ser uma tarefa complexa e desafiadora, exigindo cuidados para não resultar em implicações legais e financeiras para os sócios e proprietários.</p>
          <p className={styles['paragrafo']}>Nossa equipe atua como um intermediário entre o cliente e os órgãos reguladores, preparando e submetendo documentos necessários, evitando atrasos e potenciais penalidades,  orientando sobre impostos a serem pagos ou restituídos, identificando eventuais créditos fiscais e assegurando que todas as obrigações tributárias estejam em conformidade com as regulamentações fiscais locais.</p>
          <p className={styles['paragrafo']}>Além disso, a comunicação com os funcionários também é uma parte sensível do processo. Auxiliamos na elaboração de um plano de demissão ético e na execução de todas as formalidades legais relacionadas ao desligamento dos colaboradores, preservando a reputação e integridade financeira dos envolvidos.</p>
          <p className={styles['paragrafo']} style={{marginBottom: 20 + 'px'}}>Por fim, facilitamos o arquivamento adequado de documentos legais junto aos órgãos competentes, assegurando que a empresa seja devidamente baixada dos registros oficiais.</p>
          <div style={{textAlign: 'center'}}>
            <Link href="/budget">
              <ButtonComponent type='info' label='Solicite um orçamento' />
            </Link>
          </div>
        </TabPanel>
        <TabPanel value={value} index={3} className={styles['conteudo']}>
          <h1 className={styles['titulo']}><span>Escrituração Contábil e Tributária</span></h1>
          <p className={styles['paragrafo']}>Para o cumprimento das obrigações legais, é necessário realizar o registro de todas as operações financeiras da empresa, como receitas, despesas, compras, vendas, investimento. Algumas dessas tarefas envolvem:</p>
          <ul className={styles['lista']} style={{marginBottom: 20 + 'px'}}>
            <li>Balanço patrimonial;</li>
            <li>Demonstrativo do Resultado do Exercício (DRE);</li>
            <li>Contribuição Social sobre o Lucro Líquido (CSLL);</li>
            <li>Programa de Integração Social (PIS);</li>
            <li>Contribuição para o Financiamento da Seguridade Socal (COFINS);</li>
            <li>Imposto de Renda.</li>
          </ul>
          <div style={{textAlign: 'center'}}>
            <Link href="/budget">
              <ButtonComponent type='info' label='Solicite um orçamento' />
            </Link>
          </div>
        </TabPanel>
        <TabPanel value={value} index={4} className={styles['conteudo']}>
          <h1 className={styles['titulo']}><span>Obrigações acessórias</span></h1>
          <p className={styles['paragrafo']}>Para garantir a conformidade legal de sua empresa através do monitoramento do cumprimento das obrigações tributárias e legais por parte dos órgãos governamentais, dispomos de uma série de documentos, registros e declarações, dentre elas:</p>
          <ul className={styles['lista']} style={{marginBottom: 20 + 'px'}}>
            <li>Guia de recolhimento do FGTS (Fundo de Garantia do Tempo de Serviço) e de informações à previdência social (GFIP);</li>
            <li>Relatório de Informações Sociais (Rais);</li>
            <li>Escrituração fiscal digital das contribuições incidentes sobre a receita (PIS/Confins);</li>
            <li>Declaração do imposto de renda retido na fonte (DIRF);</li>
            <li>Simples Nacional;</li>
            <li>Declaração de Débitos Tributários Federais (DCTF) para optantes do Lucro Presumido, Lucro Real e, em alguns casos, também o Simples Nacional;</li>
            <li>Cadastro Geral de Empregados e Desempregados (CAGED);</li>
            <li>Escrituração Contábil Digital (ECD);</li>
            <li>Escrituração Fiscal Digital (EFD);</li>
            <li>Declaração de Débitos e Créditos Tributários Federais (DCTF).</li>
          </ul>
          <div style={{textAlign: 'center'}}>
            <Link href="/budget">
              <ButtonComponent type='info' label='Solicite um orçamento' />
            </Link>
          </div>
        </TabPanel>
        <TabPanel value={value} index={5} className={styles['conteudo']}>
          <h1 className={styles['titulo']}><span>Planejamento estratégico</span></h1>
          <p className={styles['paragrafo']}>Através de estratégias financeiras e contábeis, buscamos otimizar o desempenho financeiro e promover a conformidade fiscal para contribuir para o crescimento sustentável do seu negócio.</p>
          <p className={styles['paragrafo']}>Algumas dessas estratégias incluem:</p>
          <ul className={styles['lista']} style={{marginBottom: 20 + 'px'}}>
            <li>Análise financeira para identificar áreas de força e fraqueza;</li>
            <li>Planejamento tributário para verificar incentivos fiscais e benefícios aplicáveis;</li>
            <li>Revisão e otimização de estruturas de custos;</li>
            <li>Identificação de áreas de redução de despesas;</li>
            <li>Consultoria financeira;</li>
            <li>Estratégias de crescimento;</li>
            <li>Gestão de custos;</li>
            <li>Preparação e arquivamento de declarações fiscais e relatórios necessários.</li>
          </ul>
          <div style={{textAlign: 'center'}}>
            <Link href="/budget">
              <ButtonComponent type='info' label='Solicite um orçamento' />
            </Link>
          </div>
        </TabPanel>
      </Box>
    </Box>
  );
}
