import database from "../models/index.js";

class ContactService {
  async criarContato(dados) {
    const contato = await database.Contact.create({
      fullname: dados.fullname,
      email: dados.email,
      phone: dados.phone,
      subject: dados.subject,
      content: dados.content,
      status: "pendente" 
    });

    return contato;
  }

  async listarContatos() {
    const contatos = await database.Contact.findAll({
      order: [["createdAt", "DESC"]]
    });
    return contatos;
  }

  async atualizarStatus(id, novoStatus) {
    const contato = await database.Contact.findByPk(id);
    if (!contato) {
      throw new Error("Contato não encontrado");
    }

    contato.status = novoStatus;
    await contato.save();

    return contato;
  }
}

export default ContactService;
