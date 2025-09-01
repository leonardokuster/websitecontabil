'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Typography,
    Box,
    CircularProgress,
    Alert,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Button,
    Grid,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function CompanyList({ userId }) {
    const [company, setCompany] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [dependents, setDependents] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedEmployeeId, setExpandedEmployeeId] = useState(null);

    useEffect(() => {
        const fetchCompanyAndEmployees = async () => {
            try {
                // Busca a empresa associada ao userId
                const companyResponse = await axios.get(`http://localhost:3001/company/user/${userId}`, { withCredentials: true });
                const companyData = companyResponse.data;
                setCompany(companyData);

                if (companyData) {
                    // Busca os funcionários da empresa
                    const employeesResponse = await axios.get(`http://localhost:3001/employee/company/${companyData.id}`, { withCredentials: true });
                    const employeesData = employeesResponse.data;
                    setEmployees(employeesData);

                    // Busca os dependentes de cada funcionário
                    const dependentsPromises = employeesData.map(async (employee) => {
                        const dependentsResponse = await axios.get(`http://localhost:3001/dependent/funcionario/${employee.id}`, { withCredentials: true });
                        return { employeeId: employee.id, data: dependentsResponse.data };
                    });
                    const dependentsData = await Promise.all(dependentsPromises);
                    const dependentsMap = dependentsData.reduce((acc, curr) => {
                        acc[curr.employeeId] = curr.data;
                        return acc;
                    }, {});
                    setDependents(dependentsMap);
                }
            } catch (err) {
                console.error('Erro ao carregar dados da empresa/funcionários:', err);
                setError('Não foi possível carregar os dados. Tente novamente mais tarde.');
            } finally {
                setLoading(false);
            }
        };

        fetchCompanyAndEmployees();
    }, [userId]);

    const handleExpandEmployee = (employeeId) => {
        setExpandedEmployeeId(expandedEmployeeId === employeeId ? null : employeeId);
    };

    const handleAddCompany = () => {
        // Redireciona para a página de cadastro de empresa
        console.log('Botão de adicionar empresa clicado. Redirecionando...');
    };

    const handleDeleteCompany = async () => {
        try {
            await axios.delete(`http://localhost:3001/company/${company.id}`, { withCredentials: true });
            setCompany(null);
            setEmployees([]);
            setDependents({});
        } catch (err) {
            console.error('Erro ao apagar empresa:', err);
            setError('Falha ao apagar a empresa.');
        }
    };

    const handleAddEmployee = () => {
        // Redireciona para a página de cadastro de funcionário
        console.log('Botão de adicionar funcionário clicado. Redirecionando...');
    };

    const handleDeleteEmployee = async (employeeId) => {
        try {
            await axios.delete(`http://localhost:3001/employee/${employeeId}`, { withCredentials: true });
            setEmployees(employees.filter(emp => emp.id !== employeeId));
            const newDependents = { ...dependents };
            delete newDependents[employeeId];
            setDependents(newDependents);
        } catch (err) {
            console.error('Erro ao apagar funcionário:', err);
            setError('Falha ao apagar o funcionário.');
        }
    };

    const handleAddDependent = () => {
        // Redireciona para a página de cadastro de dependente
        console.log('Botão de adicionar dependente clicado. Redirecionando...');
    };

    const handleDeleteDependent = async (dependentId, employeeId) => {
        try {
            await axios.delete(`http://localhost:3001/dependent/${dependentId}`, { withCredentials: true });
            setDependents(prevDependents => ({
                ...prevDependents,
                [employeeId]: prevDependents[employeeId].filter(dep => dep.id !== dependentId)
            }));
        } catch (err) {
            console.error('Erro ao apagar dependente:', err);
            setError('Falha ao apagar o dependente.');
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>;
    }

    return (
        <Box>
            <Typography variant="h5" gutterBottom>
                {company ? 'Dados da Empresa' : 'Este usuário não possui empresa cadastrada'}
            </Typography>

            {!company ? (
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button variant="contained" onClick={handleAddCompany}>Cadastrar Empresa</Button>
                </Box>
            ) : (
                <Accordion defaultExpanded sx={{ mb: 2 }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="subtitle1">{company.nomeFantasia}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography variant="body2">**CNPJ:** {company.cnpj}</Typography>
                        <Typography variant="body2">**Razão Social:** {company.razaoSocial}</Typography>
                        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                            <Button variant="contained" onClick={handleAddEmployee}>Adicionar Funcionário</Button>
                            <Button variant="outlined" color="error" onClick={handleDeleteCompany}>Apagar Empresa</Button>
                        </Box>
                        
                        <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>Funcionários</Typography>
                        
                        {employees.length === 0 ? (
                            <Typography color="textSecondary">Nenhum funcionário encontrado.</Typography>
                        ) : (
                            <Box>
                                {employees.map((employee) => (
                                    <Accordion key={employee.id} expanded={expandedEmployeeId === employee.id} onChange={() => handleExpandEmployee(employee.id)}>
                                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                            <Typography>{employee.nome}</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Typography variant="body2">**Função:** {employee.funcao}</Typography>
                                            <Typography variant="body2">**Salário:** R$ {parseFloat(employee.salario).toFixed(2)}</Typography>
                                            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                                                <Button variant="contained" onClick={handleAddDependent}>Adicionar Dependente</Button>
                                                <Button variant="outlined" color="error" onClick={() => handleDeleteEmployee(employee.id)}>Apagar Funcionário</Button>
                                            </Box>

                                            <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>Dependentes</Typography>
                                            
                                            {dependents[employee.id]?.length === 0 ? (
                                                <Typography color="textSecondary">Nenhum dependente encontrado.</Typography>
                                            ) : (
                                                <Grid container spacing={2}>
                                                    {dependents[employee.id]?.map((dependent) => (
                                                        <Grid item xs={12} sm={6} md={4} key={dependent.id}>
                                                            <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: '8px' }}>
                                                                <Typography variant="subtitle2">{dependent.nomeDependente}</Typography>
                                                                <Typography variant="caption">**CPF:** {dependent.cpfDependente}</Typography>
                                                                <Button 
                                                                    variant="outlined" 
                                                                    color="error" 
                                                                    size="small"
                                                                    sx={{ mt: 1 }}
                                                                    onClick={() => handleDeleteDependent(dependent.id, employee.id)}
                                                                >
                                                                    Apagar
                                                                </Button>
                                                            </Box>
                                                        </Grid>
                                                    ))}
                                                </Grid>
                                            )}
                                        </AccordionDetails>
                                    </Accordion>
                                ))}
                            </Box>
                        )}
                    </AccordionDetails>
                </Accordion>
            )}
        </Box>
    );
}