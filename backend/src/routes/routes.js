import express from 'express';
import userRoutes from './userRoutes.js';
import companyRoutes from './companyRoutes.js';
import employeeRoutes from './employeeRoutes.js';
import dependentRoutes from './dependentRoutes.js';
import contactRoutes from './contactRoutes.js';

const router = express.Router();

router.use('/user', userRoutes);
router.use('/company',companyRoutes);
router.use('/employee',employeeRoutes);
router.use('/dependent',dependentRoutes);
router.use('/contact',contactRoutes);

export default router;