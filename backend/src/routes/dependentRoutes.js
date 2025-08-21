import express from "express";
import DependentController from "../controllers/dependentController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const dependentRoutes = express.Router();

dependentRoutes
    .post("/", authMiddleware(), DependentController.cadastrarDependente)
    .get("/funcionario/:employeeId", authMiddleware(), DependentController.buscarDependentePorFuncionarioId)
    .put("/:id", authMiddleware(), DependentController.editarDependente)
    .delete("/:id", authMiddleware(), DependentController.removerDependente);

export default dependentRoutes;