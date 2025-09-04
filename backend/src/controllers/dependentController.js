import DependentService from "../services/dependentService.js";

const dependentService = new DependentService();
class DependentController {
  static async cadastrarDependente(req, res) {
    const { employeeId } = req.params;
    const dependentData = req.body;

    console.log('Dados recebidos:', req.body);
    console.log('ID Empresa:', employeeId);

      if (!employeeId) {
        return res.status(400).json({ error: 'ID do funcionário é obrigatório.' });
      }

    try {
      const dependente = await dependentService.cadastrarDependente(dependentData, employeeId);
      return res.status(201).json(dependente);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  static async editarDependente(req, res) {
    try {
      const { dependentId } = req.params;
      const dependente = await dependentService.editarDependente(dependentId, req.body);
      return res.status(200).json(dependente);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  static async removerDependente(req, res) {
    try {
      const { dependentId } = req.params;
      const result = await dependentService.removerDependente(dependentId);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  static async buscarDependentesPorFuncionarioId(req, res) {
    try {
      const { employeeId } = req.params;
      const dependentes = await dependentService.buscarDependentesPorFuncionarioId(employeeId);

      if (!dependentes || dependentes.length === 0) {
        return res.status(404).json({ message: 'Nenhum dependente encontrado para este funcionário.' });
      }

      return res.status(200).json(dependentes);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  static async buscarDependentePorId(req, res) {
    try {
      const { dependentId } = req.params;
      const dependente = await dependentService.buscarDependentePorId(dependentId);

      if (!dependente) {
        return res.status(404).json({ message: 'Dependente não encontrado.'});
      }
      return res.status(200).json(dependente);
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
  }
}

export default DependentController;