import database from "../models/index.js";
import { v4 as uuidv4 } from 'uuid';

class EmployeeService {
  async cadastrarFuncionario(dados, companyId, userId, userType) {
    const {
      nome,
      email,
      telefone,
      sexo,
      corEtnia,
      dataNascimento,
      localNascimento,
      cpf,
      rg,
      orgaoExpedidor,
      dataRg,
      cep,
      endereco,
      numeroCasa,
      complementoCasa,
      bairro,
      cidade,
      estado,
      nomeMae,
      nomePai,
      escolaridade,
      estadoCivil,
      nomeConjuge,
      pis,
      numeroCt,
      serie,
      dataCt,
      carteiraDigital,
      tituloEleitoral,
      zona,
      secao,
      funcao,
      dataAdmissao,
      salario,
      contratoExperiencia,
      horarios,
      insalubridade,
      periculosidade,
      quebraDeCaixa,
      valeTransporte,
      quantidadeVales,
    } = dados;

    const existeCpf = await database.Employee.findOne({ where: { cpf } });
    if (existeCpf) {
      throw new Error('Já existe um funcionário cadastrado com esse CPF');
    }

    const empresa = await database.Company.findByPk(companyId);
    if (!empresa) {
      throw new Error('Empresa não encontrada');
    }

    const funcionario = await database.Employee.create({
      id: uuidv4(),
      nome,
      email,
      telefone,
      sexo,
      corEtnia,
      dataNascimento,
      localNascimento,
      cpf,
      rg,
      orgaoExpedidor,
      dataRg,
      cep,
      endereco,
      numeroCasa,
      complementoCasa,
      bairro,
      cidade,
      estado,
      nomeMae,
      nomePai,
      escolaridade,
      estadoCivil,
      nomeConjuge,
      pis,
      numeroCt,
      serie,
      dataCt,
      carteiraDigital,
      tituloEleitoral,
      zona,
      secao,
      funcao,
      dataAdmissao,
      salario,
      contratoExperiencia,
      horarios,
      insalubridade,
      periculosidade,
      quebraDeCaixa,
      valeTransporte,
      quantidadeVales,
      companyId,
    });
    return funcionario;
  }

  async editarFuncionario(id, dados) {
    const funcionario = await database.Employee.findByPk(id);
    if (!funcionario) {
      throw new Error("Funcionário não encontrado");
    }

    await funcionario.update(dados);
    return funcionario;
  }

  async removerFuncionario(id) {
    const funcionario = await database.Employee.findByPk(id);
    if (!funcionario) {
      throw new Error("Funcionário não encontrado");
    }

    await funcionario.destroy();
    return { message: "Funcionário removido com sucesso." };
  }

  async buscarFuncionarioPorEmpresaId(companyId) {
    const funcionarios = await database.Employee.findAll({
      where: { companyId },
      include: [{ model: database.Dependent, as: "dependents" }],
    });

    return funcionarios;
  }

  async buscarFuncionarioPorId(id) {
          const funcionario = await database.Employee.findByPk(id);
  
          if (!funcionario) {
              return null;
          }
  
          return funcionario;
      }
}

export default EmployeeService;
