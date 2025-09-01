'use client';
import React, { useState } from 'react';
import { Typography, Paper, Button, Box, List, ListItem, ListItemText, Divider } from '@mui/material';
import RelativeForm from '@/app/dashboard/components/form/dependentForm'; // Importe o formulário de dependentes
import EmployeeForm from '@/app/dashboard/components/form/employeeForm'; // Crie este formulário

export default function EmployeeGrid({ onBack }) {
    const [employees, setEmployees] = useState([
        { id: 1, name: 'João Silva', cpf: '111.222.333-44' },
        { id: 2, name: 'Maria Souza', cpf: '555.666.777-88' },
    ]);
    const [view, setView] = useState('list'); // 'list', 'add', 'addRelative'
    const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

    const handleAddEmployee = () => {
        setView('add');
    };

    const handleAddRelative = (employeeId) => {
        setSelectedEmployeeId(employeeId);
        setView('addRelative');
    };

    const handleFormSubmit = () => {
        // Recarrega a lista ou atualiza o estado
        setView('list');
        setSelectedEmployeeId(null);
    };

    const handleFormCancel = () => {
        setView('list');
        setSelectedEmployeeId(null);
    };

    const renderContent = () => {
        if (view === 'add') {
            return <EmployeeForm onSubmit={handleFormSubmit} onCancel={handleFormCancel} />;
        }
        if (view === 'addRelative') {
            return <RelativeForm employeeId={selectedEmployeeId} onSubmit={handleFormSubmit} onCancel={handleFormCancel} />;
        }

        return (
            <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
                <Typography variant="h5" align="center" gutterBottom>
                    Funcionários Cadastrados
                </Typography>
                <Box sx={{ mt: 2 }}>
                    <Button variant="contained" onClick={handleAddEmployee}>
                        Cadastrar Novo Funcionário
                    </Button>
                </Box>
                
                <List sx={{ mt: 2 }}>
                    {employees.map(employee => (
                        <Box key={employee.id}>
                            <ListItem secondaryAction={
                                <Button variant="outlined" onClick={() => handleAddRelative(employee.id)}>
                                    Adicionar Dependente
                                </Button>
                            }>
                                <ListItemText 
                                    primary={employee.name} 
                                    secondary={`CPF: ${employee.cpf}`} 
                                />
                            </ListItem>
                            <Divider />
                        </Box>
                    ))}
                </List>
                <Button variant="outlined" onClick={onBack} sx={{ mt: 2 }}>
                    Voltar
                </Button>
            </Paper>
        );
    };

    return (
        <Box>
            {renderContent()}
        </Box>
    );
}