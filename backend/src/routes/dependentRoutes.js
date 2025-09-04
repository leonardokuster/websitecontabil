import express from "express";
import DependentController from "../controllers/dependentController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const dependentRoutes = express.Router({ mergeParams: true });

dependentRoutes
    .post("/", authMiddleware(), DependentController.cadastrarDependente) // POST /users/:userId/companies/:companyId/employees/:employeeId/dependents
    .get("/", authMiddleware(), DependentController.buscarDependentesPorFuncionarioId) // GET /users/:userId/companies/:companyId/employees/:employeeId/dependents
    .get("/:dependentId", authMiddleware(), DependentController.buscarDependentePorId) // GET /users/:userId/companies/:companyId/employees/:employeeId/dependents/:dependentId
    .put("/:dependentId", authMiddleware(), DependentController.editarDependente) // PUT /users/:userId/companies/:companyId/employees/:employeeId/dependents/:dependentId
    .delete("/:dependentId", authMiddleware(), DependentController.removerDependente); // DELETE /users/:userId/companies/:companyId/employees/:employeeId/dependents/:dependentId

export default dependentRoutes;