import database from "../models/index.js";
import { v4 as uuidv4 } from 'uuid';

class DependentService {
  async cadastrarDependente(dados, employeeId) {
    const {
      nomeDependente, 
      dataNascimentoDependente, 
      localNascimentoDependente, 
      cpfDependente,
    } = dados;

    const existeDependente = await database.Dependent.findOne({ where: { cpfDependente } });
    if (existeDependente) {
      throw new Error('Já existe um dependente cadastrado com esse CPF');
    }

    const funcionario = await database.Employee.findByPk(employeeId);
    if (!funcionario) {
      throw new Error('Funcionário não encontrado');
    }

    const dependente = await database.Dependent.create({
      id:uuidv4(),
      nomeDependente, 
      dataNascimentoDependente, 
      localNascimentoDependente, 
      cpfDependente,
      employeeId,
    });
    return dependente;
  }

  async editarDependente(id, dados) {
    const dependente = await database.Dependent.findByPk(id);
    if (!dependente) {
      throw new Error("Dependente não encontrado");
    }

    await dependente.update(dados);
    return dependente;
  }

  async removerDependente(id) {
    const dependente = await database.Dependent.findByPk(id);
    if (!dependente) {
      throw new Error("Dependente não encontrado");
    }

    await dependente.destroy();
    return { message: "Dependente removido com sucesso." };
  }

  async buscarDependentesPorFuncionarioId(employeeId) {
    const dependentes = await database.Dependent.findAll({
      where: { employeeId },
    });
    return dependentes;
  }

  async buscarDependentePorId(id) {
    const dependente = await database.Dependent.findByPk(id);

    if (!dependente) {
        return null;
    }

    return dependente;
  }
}

export default DependentService;