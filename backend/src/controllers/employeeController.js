import EmployeeService from "../services/employeeService.js";

const employeeService = new EmployeeService();

class EmployeeController {
  static async cadastrarFuncionario(req, res) {
    try {
      const { companyId } = req.params; 
      const funcionario = await employeeService.cadastrarFuncionario(req.body, Number(companyId));
      return res.status(201).json(funcionario);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  static async editarFuncionario(req, res) {
    try {
      const { id } = req.params;
      const funcionario = await employeeService.editarFuncionario(id, req.body);
      return res.status(200).json(funcionario);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  static async removerFuncionario(req, res) {
    try {
      const { id } = req.params;
      const result = await employeeService.removerFuncionario(id);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  static async buscarFuncionarioPorEmpresaId(req, res) {
    try {
      const { companyId } = req.params;
      const funcionarios = await employeeService.buscarFuncionarioPorEmpresaId(Number(companyId));
      return res.status(200).json(funcionarios);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export default EmployeeController;
