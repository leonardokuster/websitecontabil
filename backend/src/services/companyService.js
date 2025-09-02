import { where } from "sequelize";
import database from "../models/index.js";
import { v4 as uuidv4 } from 'uuid';

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
            id: uuidv4(),
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

    async buscarEmpresa(userId) {
        const empresa = await database.Company.findOne({
            where: { userId }
        })

        if (!empresa) {
            return null;
        }

        return empresa;
    }

    async buscarEmpresaPorId(id) {
        const empresa = await database.Company.findByPk(id);

        if (!empresa) {
            return null;
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