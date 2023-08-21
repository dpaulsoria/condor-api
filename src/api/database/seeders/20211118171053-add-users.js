"use strict";

const { encryptData } = require("../../utils/utils");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const passwordEncrypted = await encryptData("condorcondor");

    return queryInterface.bulkInsert(
      "Users",
      [
        {
          username: "condoradmin",
          password: passwordEncrypted,
          idCard: "0000000000",
          fullName: "-",
          email: "condoradmin@gmail.com",
          createdAt: "2021-01-01",
          updatedAt: "2021-01-01",
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Users", null, {});
  },
};
