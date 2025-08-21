import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import database from '../models/index.js';
import transporter from '../controllers/nodemailerController.js'
import 'dotenv/config.js';
import jwt from 'jsonwebtoken';
import userToken from '../config/userToken.js';

class UserService {
    async logarUsuario({emailPessoal, senha}) {
        const usuario = await database.User.findOne({ where: {emailPessoal} });

        if (!usuario) {
            throw new Error('Usuário não encontrado');
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha);

        if (!senhaValida) {
            throw new Error('Senha inválida');
        }

        const token = jwt.sign(
            { id: usuario.id, tipo: usuario.tipo },
            userToken.secret,
            { expiresIn: userToken.expiresIn }
        );

        // remove a senha antes de retornar
        const { senha: _, ...usuarioSemSenha } = usuario.toJSON();

        return { usuario: usuarioSemSenha, token };
    }

    async cadastrarUsuario(dados) {
        const { nome, telefonePessoal, emailPessoal, dataNascimento, cpf, senha, possuiEmpresa } = dados; 

        const existeCpf = await database.User.findOne({ where: { cpf } });
        if (existeCpf) {
            throw new Error('CPF já cadastrado');
        }

        const existeEmail = await database.User.findOne({ where: { emailPessoal } });
        if (existeEmail) {
            throw new Error('E-mail já cadastrado');
        }

        const senhaHash = await bcrypt.hash(senha, 10);

        const novoUsuario = await database.User.create({
            nome,
            telefonePessoal,
            emailPessoal,
            dataNascimento,
            cpf,
            senha: senhaHash,
            tipo: 'user',
            possuiEmpresa
        });

        const info = await transporter.sendMail({
            from: "Escritório Kuster <l.kusterr@gmail.com>",
            to: emailPessoal,
            subject: "Obrigado por realizar seu cadastro! - Escritório Küster",
            html: `
            <html>
            <body>
                <h2>Olá <strong>${nome}</strong>,</h2>
                <p>Obrigado por se cadastrar em nosso serviço!</p>
                
                <p>Para acessar sua conta, visite nosso site <a href='https://escritoriokuster.netlify.app/login'>aqui</a> e faça login usando o e-mail cadastrado em nosso sistema.</p>

                <ul>
                    <li><strong>E-mail:</strong> ${emailPessoal}</li>
                </ul>

                <p>Lembre-se de manter suas credenciais seguras e não compartilhá-las com ninguém.</p>

                <p>Se você tiver alguma dúvida ou precisar de assistência, não hesite em nos contatar.</p>

                <p>Obrigado!</p>
                <p>Escritório Küster</p>
            </body>
            </html>
            `,
        });

        return novoUsuario;
    }

    async buscarUsuario(id) {
        try {
            const usuario = await database.User.findByPk(id, { attributes: { exclude: ["senha"] } });
            return usuario;
        } catch (error) {
            console.error('Erro ao listar usuário:', error);
            throw error;
        }
    }

    async listarUsuarios() {
        try {
            const usuarios = await database.User.findAll({ attributes: {exclude: ['senha'] } });
            return usuarios;
        } catch (error) {
            console.error('Erro ao listar usuários:', error);
            throw error;
        }
    }

    async editarUsuario(id, dados) {
        const usuario = await database.User.findByPk(id);
        if (!usuario) {
            throw new Error('Usuário não encontrado');
        }

        if (dados.senha) {
            dados.senha = await bcrypt.hash(dados.senha, 10);
        }

        await usuario.update(dados);
        return usuario;
    }

    async removerUsuario(id) {
        const usuario = await database.User.findByPk(id);
        if (!usuario) {
            throw new Error('Usuário não encontrado');
        }

        try {
            await usuario.destroy();
            return { message: 'Usuário removido com sucesso.' };
        } catch (error) {
            console.error('Erro ao remover usuário:', error);
            throw error;
        }
    }

    async atualizarTipoUsuario(id, novoTipo) {
        const usuario = await database.User.findByPk(id);
        if (!usuario) {
            throw new Error('Usuário não encontrado');
        }

        try {
            usuario.tipo = novoTipo;
            await usuario.save();
            return usuario;
        } catch (error) {
            throw new Error('Erro ao atulizar tipo de usuário');
        }
    }
}

export default UserService;