import CompanyService from "../services/companyService.js";

const companyService = new CompanyService();

class CompanyController {
  static async criarEmpresa(req, res) {
    try {
      const userId = req.userId; 
      console.log('Dados recebidos do frontend empresa:', req.body);
      console.log('UserID:', userId);
      const empresa = await companyService.criarEmpresa(req.body, userId);
      return res.status(201).json(empresa);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  static async buscarEmpresa(req, res) {
    try {
        const { userId } = req.params;
        const empresa = await companyService.buscarEmpresa(userId); 
        return res.status(200).json(empresa);
    } catch (error) {
        return res.status(404).json({ error: error.message });
    }
  }

  static async buscarEmpresaPorId(req, res) {
    try {
      const { id } = req.params;
      const empresa = await companyService.buscarEmpresaPorId(id);

      if (!empresa) {
        return res.status(404).json({ message: 'Empresa não encontrada.'});
      }
      res.status(200).json(empresa);
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
  }

  static async editarEmpresa(req, res) {
    try {
      const { id } = req.params;
      const empresa = await companyService.editarEmpresa(id, req.body);
      return res.status(200).json(empresa);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  static async removerEmpresa(req, res) {
    try {
      const { id } = req.params;
      const result = await companyService.removerEmpresa(id);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export default CompanyController;
