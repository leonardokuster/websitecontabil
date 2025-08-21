import express from "express";
import ContactController from "../controllers/contactController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const contactRoutes = express.Router();

contactRoutes
    .post("/", ContactController.criarContato)
    .get("/", authMiddleware(["admin", "collaborator"]), ContactController.listarContatos)
    .patch("/:id/status", authMiddleware(["admin", "collaborator"]), ContactController.atualizarStatus);

export default contactRoutes;