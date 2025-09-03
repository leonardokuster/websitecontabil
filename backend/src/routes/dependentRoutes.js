import express from "express";
import DependentController from "../controllers/dependentController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const dependentRoutes = express.Router();

dependentRoutes
    .post("/register", authMiddleware(), DependentController.cadastrarDependente)
    .get("/employee/:employeeId", authMiddleware(), DependentController.buscarDependentePorFuncionarioId)
    .get("/:id", authMiddleware(), DependentController.buscarDependentePorId)
    .put("/:id", authMiddleware(), DependentController.editarDependente)
    .delete("/:id", authMiddleware(), DependentController.removerDependente);

export default dependentRoutes;