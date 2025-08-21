import express from "express";
import CompanyController from "../controllers/companyController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const companyRoutes = express.Router();

companyRoutes
    .post("/register", authMiddleware(), CompanyController.criarEmpresa)
    .get("/:id", authMiddleware(), CompanyController.buscarEmpresa)
    .put("/:id", authMiddleware(), CompanyController.editarEmpresa)
    .delete("/:id", authMiddleware(), CompanyController.removerEmpresa);

export default companyRoutes;
