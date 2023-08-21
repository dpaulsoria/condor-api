const ROLES = {
  superAdministrator: {
    code: "001",
    name: "Super administrador",
  },

  administrator: {
    code: "002",
    name: "Administrador",
  },

  user: {
    code: "003",
    name: "Usuario",
  },
};

const DEFAULT_PAGINATION_SIZE = 10;

const ALL_ROLES = [
  ROLES.superAdministrator,
  ROLES.administrator,
  ROLES.user,
];

const MAX_MINUTES_BEFORE = 5

module.exports = {
  ROLES,
  DEFAULT_PAGINATION_SIZE,
  ALL_ROLES,
  MAX_MINUTES_BEFORE
};
