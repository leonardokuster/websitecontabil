'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Employees', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nome: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      telefone: {
        type: Sequelize.STRING
      },
      sexo: {
        type: Sequelize.STRING
      },
      corEtnia: {
        type: Sequelize.STRING
      },
      dataNascimento: {
        type: Sequelize.DATE
      },
      localNascimento: {
        type: Sequelize.STRING
      },
      cpf: {
        type: Sequelize.STRING
      },
      rg: {
        type: Sequelize.STRING
      },
      orgaoExpedidor: {
        type: Sequelize.STRING
      },
      dataRg: {
        type: Sequelize.DATE
      },
      cep: {
        type: Sequelize.STRING
      },
      endereco: {
        type: Sequelize.STRING
      },
      numeroCasa: {
        type: Sequelize.STRING
      },
      complementoCasa: {
        type: Sequelize.STRING
      },
      bairro: {
        type: Sequelize.STRING
      },
      cidade: {
        type: Sequelize.STRING
      },
      estado: {
        type: Sequelize.STRING
      },
      nomeMae: {
        type: Sequelize.STRING
      },
      nomePai: {
        type: Sequelize.STRING
      },
      escolaridade: {
        type: Sequelize.STRING
      },
      estadoCivil: {
        type: Sequelize.STRING
      },
      nomeConjuge: {
        type: Sequelize.STRING
      },
      pis: {
        type: Sequelize.STRING
      },
      numeroCt: {
        type: Sequelize.STRING
      },
      serie: {
        type: Sequelize.STRING
      },
      dataCt: {
        type: Sequelize.DATE
      },
      carteiraDigital: {
        type: Sequelize.BOOLEAN
      },
      tituloEleitoral: {
        type: Sequelize.STRING
      },
      zona: {
        type: Sequelize.STRING
      },
      secao: {
        type: Sequelize.STRING
      },
      funcao: {
        type: Sequelize.STRING
      },
      dataAdmissao: {
        type: Sequelize.DATE
      },
      salario: {
        type: Sequelize.DECIMAL
      },
      contratoExperiencia: {
        type: Sequelize.BOOLEAN
      },
      horarios: {
        type: Sequelize.STRING
      },
      insalubridade: {
        type: Sequelize.BOOLEAN
      },
      periculosidade: {
        type: Sequelize.BOOLEAN
      },
      quebraDeCaixa: {
        type: Sequelize.BOOLEAN
      },
      valeTransporte: {
        type: Sequelize.BOOLEAN
      },
      quantidadeVales: {
        type: Sequelize.STRING
      },
      companyId: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Employees');
  }
};