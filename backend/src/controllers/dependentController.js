import DependentService from "../services/dependentService.js";

const dependentService = new DependentService();

class DependentController {
  static async cadastrarDependente(req, res) {
    const { employeeId, ...dependentData } = req.body;

    const { id: userId, tipo: userType } = req;

    console.log('Dados recebidos:', req.body);
    console.log('ID Empresa:', employeeId);

    try {
      if (!employeeId) {
        return res.status(400).json({ error: 'ID do funcionário é obrigatório.' });
      }

      const dependente = await dependentService.cadastrarDependente(dependentData, employeeId);
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

  static async buscarDependentePorId(req, res) {
    try {
      const { id } = req.params;
      const dependente = await dependentService.buscarDependentePorId(id);

      if (!dependente) {
        return res.status(404).json({ message: 'Dependente não encontrado.'});
      }
      res.status(200).json(dependente);
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
  }
}

export default DependentController;
