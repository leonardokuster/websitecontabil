'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Dependents', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('Dependents');
  }
};