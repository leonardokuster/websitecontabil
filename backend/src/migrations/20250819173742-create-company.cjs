'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Companies', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      cnpj: {
        type: Sequelize.STRING
      },
      nomeFantasia: {
        type: Sequelize.STRING
      },
      razaoSocial: {
        type: Sequelize.STRING
      },
      atividadesExercidas: {
        type: Sequelize.STRING
      },
      capitalSocial: {
        type: Sequelize.DECIMAL
      },
      cep: {
        type: Sequelize.STRING
      },
      endereco: {
        type: Sequelize.STRING
      },
      numeroEmpresa: {
        type: Sequelize.STRING
      },
      complementoEmpresa: {
        type: Sequelize.STRING
      },
      emailEmpresa: {
        type: Sequelize.STRING
      },
      telefoneEmpresa: {
        type: Sequelize.STRING
      },
      socios: {
        type: Sequelize.STRING
      },
      userId: {
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
    await queryInterface.dropTable('Companies');
  }
};