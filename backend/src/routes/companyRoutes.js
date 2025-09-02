import express from "express";
import CompanyController from "../controllers/companyController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const companyRoutes = express.Router();

companyRoutes
    .post("/register", authMiddleware(), CompanyController.criarEmpresa)
    .get("/user/:userId", authMiddleware(["admin", "collaborator", "user"]), CompanyController.buscarEmpresa) 
    .get("/:id", authMiddleware(), CompanyController.buscarEmpresaPorId)
    .put("/:id", authMiddleware(), CompanyController.editarEmpresa)
    .delete("/:id", authMiddleware(), CompanyController.removerEmpresa);

export default companyRoutes;