import jwt from 'jsonwebtoken';
import userToken from '../config/userToken.js';
import UserService from '../services/userService.js';
import database from '../config/database.js';

const userService = new UserService();

class UserController {
    static async logarUsuario(req, res) {
        try {
            const { emailPessoal, senha } = req.body;
            const { usuario, token, companyId } = await userService.logarUsuario({ emailPessoal, senha });

            res.cookie("token", token, {
                httpOnly: true,   // impede acesso via JS (XSS)
                secure: process.env.NODE_ENV === "production", // só https em prod
                sameSite: "strict",
                maxAge: 1000 * 60 * 60, // 1h
            });

            return res.status(200).json({ usuario, token, companyId });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    static async cadastrarUsuario(req, res) {
        try {
            const dadosDoUsuario = req.body;
            console.log('Dados recebidos do frontend userController:', dadosDoUsuario);

            const usuario = await userService.cadastrarUsuario(dadosDoUsuario);

            // Gera o token
            const token = jwt.sign(
                { id: usuario.id, tipo: usuario.tipo },
                userToken.secret,
                { expiresIn: '1h' }
            );
            console.log('Token:', token);

            // Seta o cookie
            res.cookie("token", token, {
                httpOnly: true,   
                secure: process.env.NODE_ENV === "production", 
                sameSite: "strict",
                maxAge: 1000 * 60 * 60,
            });

            return res.status(201).json({
                message: 'Usuário cadastrado com sucesso!',
                id: usuario.id,
                token: token
            });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    static async buscarUsuario(req, res) {
        try {
            const usuario = await userService.buscarUsuario(req.params.id);
            return res.status(200).json(usuario);
        } catch (error) {
            return res.status(error.message.includes('não encontrado') ? 404 : 500, {
                error: error.message
            });
        }
    }

    static async listarUsuarios(req, res) {
        try {
            const usuarios = await userService.listarUsuarios();
            return res.status(200).json(usuarios);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    static async editarUsuario(req, res) {
        try {
            const usuario = await userService.editarUsuario(req.params.id, req.body);
            return res.status(200).json(usuario);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    static async removerUsuario(req, res) {
        try {
            const result = await userService.removerUsuario(req.params.id);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    static async atualizarTipoUsuario(req, res) {
        try {
            const usuario = await userService.atualizarTipoUsuario(req.params.id, req.body.tipo);
            return res.status(200).json(usuario);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    static async logout(req, res) {
        try {
            await userService.logout();

            res.clearCookie('token', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/', 
            });

            return res.status(200).json({ message: 'Logout realizado com sucesso!' });
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao tentar fazer logout' });
        }
    }
}

export default UserController;