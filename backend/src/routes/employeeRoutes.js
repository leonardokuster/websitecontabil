import express from "express";
import EmployeeController from "../controllers/employeeController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const employeeRoutes = express.Router();

employeeRoutes
    .post("/register", authMiddleware(), EmployeeController.cadastrarFuncionario)
    .get("/company/:companyId", authMiddleware(), EmployeeController.buscarFuncionarioPorEmpresaId)
    .get("/:id", authMiddleware(), EmployeeController.buscarFuncionarioPorId)
    .put("/:id", authMiddleware(), EmployeeController.editarFuncionario)
    .delete("/:id", authMiddleware(), EmployeeController.removerFuncionario);

export default employeeRoutes;
