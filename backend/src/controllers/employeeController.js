import EmployeeService from "../services/employeeService.js";

const employeeService = new EmployeeService();

class EmployeeController {
  static async cadastrarFuncionario(req, res) {
    const { companyId } = req.params;
    const employeeData = req.body;

    console.log('Dados recebidos:', req.body);
    console.log('ID Empresa:', companyId);

    try {
      const funcionario = await employeeService.cadastrarFuncionario(employeeData, companyId);
      return res.status(201).json(funcionario);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  static async editarFuncionario(req, res) {
    try {
      const { employeeId } = req.params;
      const funcionario = await employeeService.editarFuncionario(employeeId, req.body);
      return res.status(200).json(funcionario);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  static async removerFuncionario(req, res) {
    try {
      const { employeeId } = req.params;
      const result = await employeeService.removerFuncionario(employeeId);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  static async buscarFuncionariosPorEmpresaId(req, res) {
    try {
      const { companyId } = req.params;
      const funcionarios = await employeeService.buscarFuncionariosPorEmpresaId(companyId);

      if (funcionarios.length === 0) {
        return res.status(404).json({ message: 'Nenhum funcionário encontrado para esta empresa.' });
      }

      return res.status(200).json(funcionarios);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  static async buscarFuncionarioPorId(req, res) {
    try {
      const { employeeId } = req.params;
      const funcionario = await employeeService.buscarFuncionarioPorId(employeeId);

      if (!funcionario) {
        return res.status(404).json({ message: 'Funcionário não encontrado.'});
      }
      return res.status(200).json(funcionario);
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
  }
}

export default EmployeeController;
