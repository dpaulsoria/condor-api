"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "UserRoles",
      [
        {
          username: "condoradmin",
          codeRole: "001",
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("UserRoles", null, {});
  },
};
