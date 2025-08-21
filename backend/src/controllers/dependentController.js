import DependentService from "../services/dependentService.js";

const dependentService = new DependentService();

class DependentController {
  static async cadastrarDependente(req, res) {
    try {
      const { employeeId } = req.params; 
      const dependente = await dependentService.cadastrarDependente(req.body, employeeId);
      return res.status(201).json(dependente);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  static async editarDependente(req, res) {
    try {
      const { id } = req.params;
      const dependente = await dependentService.editarDependente(id, req.body);
      return res.status(200).json(dependente);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  static async removerDependente(req, res) {
    try {
      const { id } = req.params;
      const result = await dependentService.removerDependente(id);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  static async buscarDependentePorFuncionarioId(req, res) {
    try {
      const { employeeId } = req.params;
      const dependentes = await dependentService.buscarDependentePorFuncionarioId(employeeId);
      return res.status(200).json(dependentes);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export default DependentController;
