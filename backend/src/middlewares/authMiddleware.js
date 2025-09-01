import jwt from "jsonwebtoken";
import userToken from "../config/userToken.js";
import db from "../models/index.js";

export default function authMiddleware(roles = []) {
  return async (req, res, next) => {
    try {
      // 👉 Pega o token do cookie em vez do header
      const token = req.cookies?.token;
      if (!token) {
        return res.status(401).json({ error: "Token não encontrado" });
      }

      // Decodifica o token
      const decoded = jwt.verify(token, userToken.secret);

      // Verifica se usuário ainda existe
      const user = await db.User.findByPk(decoded.id);
      if (!user) {
        return res.status(401).json({ error: "Usuário não existe mais" });
      }

      // Verifica roles, se necessário
      if (roles.length > 0 && !roles.includes(decoded.tipo)) {
        return res.status(403).json({ error: "Permissão negada" });
      }

      // Anexa info do user na req
      req.userId = decoded.id;
      req.tipo = decoded.tipo;

      return next();
    } catch (error) {
      console.error("Erro ao verificar o token:", error);
      return res.status(401).json({ error: "Token inválido ou expirado" });
    }
  };
}