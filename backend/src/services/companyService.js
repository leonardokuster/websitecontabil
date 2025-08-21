import { where } from "sequelize";
import database from "../models/index.js";

class CompanyService {
    async criarEmpresa(dados, userId) {
        const {
            cnpj,
            nomeFantasia,
            razaoSocial,
            atividadesExercidas,
            capitalSocial,
            cep,
            endereco,
            numeroEmpresa,
            complementoEmpresa,
            emailEmpresa,
            telefoneEmpresa,
            socios,
        } = dados; 

        const existeCnpj = await database.Company.findOne({ where: { cnpj } });
        if (existeCnpj) {
            throw new Error('Já existe uma empresa cadastrada com esse CNPJ');
        }

        const usuario = await database.User.findByPk(userId);
        if (!usuario) {
            throw new Error('Usuário não encontrado');
        }

        const novaEmpresa = await database.Company.create({
            cnpj,
            nomeFantasia,
            razaoSocial,
            atividadesExercidas,
            capitalSocial,
            cep,
            endereco,
            numeroEmpresa,
            complementoEmpresa,
            emailEmpresa,
            telefoneEmpresa,
            socios,
            userId,
        });

        await database.User.update(
            { possuiEmpresa: true },
            { where: { id: userId } }
        );

        return novaEmpresa;   
    }

    async buscarEmpresa(id) {
        const empresa = await database.Company.findByPk(id, {
        include: [{ model: database.User, as: "user", attributes: ["id", "nome", "emailPessoal"] }],
        });

        if (!empresa) {
        throw new Error("Empresa não encontrada");
        }

        return empresa;
    }

    async editarEmpresa(id, dados) {
        const empresa = await database.Company.findByPk(id);
        if (!empresa) {
        throw new Error("Empresa não encontrada");
        }

        await empresa.update(dados);
        return empresa;
    }

    async removerEmpresa(id) {
        const empresa = await database.Company.findByPk(id);
        if (!empresa) {
        throw new Error("Empresa não encontrada");
        }

        await empresa.destroy();
        return { message: "Empresa removida com sucesso." };
    }
}

export default CompanyService;