import express from "express";
import UserController from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const userRoutes = express.Router();

userRoutes
    .post('/login', UserController.logarUsuario)
    .post('/register', UserController.cadastrarUsuario);

userRoutes
    .get("/", authMiddleware(["admin", "collaborator"]), UserController.listarUsuarios)
    .get("/:id", authMiddleware(), UserController.buscarUsuario)
    .put("/:id", authMiddleware(), UserController.editarUsuario)
    .delete("/:id", authMiddleware(["admin", "collaborator"]), UserController.removerUsuario)
    .patch("/:id/tipo", authMiddleware(["admin"]), UserController.atualizarTipoUsuario);

export default userRoutes;