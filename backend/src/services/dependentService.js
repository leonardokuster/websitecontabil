import database from "../models/index.js";
import { v4 as uuidv4 } from 'uuid';

class DependentService {
  async cadastrarDependente(dados, employeeId) {
    const dependente = await database.Dependent.create({
      id:uuidv4(),
      ...dados,
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

  async buscarDependentePorFuncionarioId(employeeId) {
    const dependentes = await database.Dependent.findAll({
      where: { employeeId },
    });
    return dependentes;
  }
}

export default DependentService;
