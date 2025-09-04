import express from 'express';
import userRoutes from './userRoutes.js';
import companyRoutes from './companyRoutes.js';
import employeeRoutes from './employeeRoutes.js';
import dependentRoutes from './dependentRoutes.js';
import contactRoutes from './contactRoutes.js';

const router = express.Router();

router.use('/users', userRoutes);
router.use('/users/:userId/companies', companyRoutes);
router.use('/users/:userId/companies/:companyId/employees', employeeRoutes); 
router.use('/users/:userId/companies/:companyId/employees/:employeeId/dependents', dependentRoutes);
router.use('/contact',contactRoutes);

export default router;