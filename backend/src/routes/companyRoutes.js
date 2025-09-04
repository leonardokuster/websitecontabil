import express from "express";
import CompanyController from "../controllers/companyController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const companyRoutes = express.Router({ mergeParams: true });

companyRoutes
    .post("/", authMiddleware(), CompanyController.criarEmpresa) // POST /users/:userId/companies
    .get("/", authMiddleware(["admin", "collaborator", "user"]), CompanyController.buscarEmpresasPorUsuarioId) // GET /users/:userId/companies
    .get("/:companyId", authMiddleware(), CompanyController.buscarEmpresaPorId) // GET /users/:userId/companies/:companyId
    .put("/:companyId", authMiddleware(), CompanyController.editarEmpresa) // PUT /users/:userId/companies/:companyId
    .delete("/:companyId", authMiddleware(), CompanyController.removerEmpresa); // DELETE /users/:userId/companies/:companyId

export default companyRoutes;