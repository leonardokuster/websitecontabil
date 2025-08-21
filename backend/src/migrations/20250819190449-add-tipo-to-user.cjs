'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'tipo', {
      type: Sequelize.ENUM('admin', 'collaborator', 'user'),
      defaultValue: 'user',
      allowNull: false
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'tipo');
  }
};
