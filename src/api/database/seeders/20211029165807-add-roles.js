"use strict";

const constants = require("../../../config/constants");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "Roles",
      [
        constants.ROLES.superAdministrator,
        constants.ROLES.administrator,
        constants.ROLES.user,
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Roles", null, {});
  },
};
