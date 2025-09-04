import express from "express";
import EmployeeController from "../controllers/employeeController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const employeeRoutes = express.Router({ mergeParams: true });

employeeRoutes
    .post("/", authMiddleware(), EmployeeController.cadastrarFuncionario) // POST /users/:userId/companies/:companyId/employees/
    .get("/", authMiddleware(), EmployeeController.buscarFuncionariosPorEmpresaId) // GET /users/:userId/companies/:companyId/employees/
    .get("/:employeeId", authMiddleware(), EmployeeController.buscarFuncionarioPorId) // GET /users/:userId/companies/:companyId/employees/:employeeId
    .put("/:employeeId", authMiddleware(), EmployeeController.editarFuncionario) // PUT /users/:userId/companies/:companyId/employees/:employeeId
    .delete("/:employeeId", authMiddleware(), EmployeeController.removerFuncionario); // DELETE /users/:userId/companies/:companyId/employees/:employeeId

export default employeeRoutes;
