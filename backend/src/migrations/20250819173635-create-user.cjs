'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'), 
        allowNull: false,
        primaryKey: true
      },
      nome: {
        type: Sequelize.STRING
      },
      telefonePessoal: {
        type: Sequelize.STRING
      },
      emailPessoal: {
        type: Sequelize.STRING
      },
      dataNascimento: {
        type: Sequelize.DATE
      },
      cpf: {
        type: Sequelize.STRING
      },
      senha: {
        type: Sequelize.STRING
      },
      tipo: {
        type: Sequelize.ENUM('admin', 'collaborator', 'user'),
        allowNull: false,
        defaultValue: 'user'
      },
      possuiEmpresa: {
        type: Sequelize.BOOLEAN
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
    await queryInterface.dropTable('Users');
    await queryInterface.sequelize.query(`DROP TYPE IF EXISTS "enum_Users_tipo";`);
  }
};