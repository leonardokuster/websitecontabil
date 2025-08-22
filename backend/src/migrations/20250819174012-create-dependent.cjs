'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Dependents', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        allowNull: false,
        primaryKey: true
      },
      nomeDependente: {
        type: Sequelize.STRING
      },
      dataNascimentoDependente: {
        type: Sequelize.DATE
      },
      cpfDependente: {
        type: Sequelize.STRING
      },
      localNascimentoDependente: {
        type: Sequelize.STRING
      },
      employeeId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'Employees', key: 'id' },
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
    await queryInterface.dropTable('Dependents');
  }
};