'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Contacts', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        allowNull: false,
        primaryKey: true
      },
      fullname: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      phone: {
        type: Sequelize.STRING
      },
      subject: {
        type: Sequelize.STRING
      },
      message: {
        type: Sequelize.TEXT
      },
      status: {
        type: Sequelize.ENUM('pendente', 'em_andamento', 'atendido'),
        allowNull: false,
        defaultValue: 'pendente'
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
    await queryInterface.dropTable('Contacts');
    await queryInterface.sequelize.query(`DROP TYPE IF EXISTS "enum_Contacts_status";`);
  }
};