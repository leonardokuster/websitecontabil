import CompanyService from "../services/companyService.js";

const companyService = new CompanyService();
class CompanyController {
  static async criarEmpresa(req, res) {
    try {
      const { userId } = req.params;
      console.log('Dados recebidos do frontend companyController:', req.body);
      console.log('UserID:', userId);
      const empresa = await companyService.criarEmpresa(req.body, userId);
      return res.status(201).json(empresa);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  static async buscarEmpresasPorUsuarioId(req, res) {
    try {
        const { userId } = req.params;
        const empresas = await companyService.buscarEmpresasPorUsuarioId(userId); 
        if (empresas.length === 0) {
            return res.status(404).json({ message: 'Nenhuma empresa encontrada para este usuário.'});
        }
        return res.status(200).json(empresas);
    } catch (error) {
        return res.status(404).json({ error: error.message });
    }
  }

  static async buscarEmpresaPorId(req, res) {
    try {
      const { companyId } = req.params;
      const empresa = await companyService.buscarEmpresaPorId(companyId);

      if (!empresa) {
        return res.status(404).json({ message: 'Empresa não encontrada.'});
      }
      return res.status(200).json(empresa);
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
  }

  static async editarEmpresa(req, res) {
    try {
      const { companyId } = req.params;
      const empresa = await companyService.editarEmpresa(companyId, req.body);
      return res.status(200).json(empresa);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  static async removerEmpresa(req, res) {
    try {
      const { companyId } = req.params;
      const result = await companyService.removerEmpresa(companyId);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export default CompanyController;
