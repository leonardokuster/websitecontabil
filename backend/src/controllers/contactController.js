import ContactService from "../services/contactService.js";

const contactService = new ContactService();

class ContactController {
  static async criarContato(req, res) {
    try {
      const contato = await contactService.criarContato(req.body);
      return res.status(201).json(contato);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  static async listarContatos(req, res) {
    try {
      const contatos = await contactService.listarContatos();
      return res.status(200).json(contatos);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  static async atualizarStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const contato = await contactService.atualizarStatus(id, status);
      return res.status(200).json(contato);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export default ContactController;