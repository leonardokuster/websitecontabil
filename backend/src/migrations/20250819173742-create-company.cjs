'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Companies', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        allowNull: false,
        primaryKey: true
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
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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