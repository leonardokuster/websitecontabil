'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'Contacts', // Nome da sua tabela. O Sequelize costuma pluralizar os nomes dos modelos.
      'status',
      {
        type: Sequelize.ENUM('pendente', 'em_andamento', 'atendido'),
        defaultValue: 'pendente',
        allowNull: false,
      }
    );
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.removeColumn('Contacts', 'status');
  }
};
