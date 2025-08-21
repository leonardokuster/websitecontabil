import { promisify } from "util";
import jwt from "jsonwebtoken";
import userToken from "../config/userToken.js";
import db from "../models/index.js";

export default function authMiddleware(roles = []) {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ error: "Token não encontrado" });
      }

      console.log(`AuthHeader: ${authHeader}`);

      const [, token] = authHeader.split(" ");
      if (!token) {
        return res.status(401).json({ error: "Token malformado" });
      }

      const decoded = await promisify(jwt.verify)(token, userToken.secret);

      const user = await db.User.findByPk(decoded.id);
      if (!user) {
        return res.status(401).json({ error: "Usuário não existe mais" });
      }

      // Verifica permissão pelo tipo do usuário
      if (roles.length > 0 && !roles.includes(decoded.tipo)) {
        return res.status(403).json({ error: "Permissão negada" });
      }

      req.id = decoded.id;
      req.tipo = decoded.tipo;

      return next();
    } catch (error) {
      console.error("Erro ao verificar o token:", error);
      return res.status(401).json({ error: "Token inválido ou expirado" });
    }
  };
}