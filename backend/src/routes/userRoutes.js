import express from "express";
import UserController from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const userRoutes = express.Router();

userRoutes
    .post('/login', UserController.logarUsuario) // POST /users/login
    .post('/', UserController.cadastrarUsuario) // POST /users/
    .post('/logout', UserController.logout); // POST /users/logout

userRoutes
    .get("/", authMiddleware(["admin", "collaborator"]), UserController.listarUsuarios) // GET /users/
    .get("/:id", authMiddleware(), UserController.buscarUsuario) // GET /users/:userId
    .put("/:id", authMiddleware(), UserController.editarUsuario) // PUT /users/:userId
    .delete("/:id", authMiddleware(["admin", "collaborator"]), UserController.removerUsuario) // DELETE /users/:userId
    .patch("/:id/tipo", authMiddleware(["admin"]), UserController.atualizarTipoUsuario); // PATCH /users/:userId/tipo

export default userRoutes;