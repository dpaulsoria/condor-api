const { User, Role, UserRole } = require("../models");
const { roleValidation, assignRoleValidation } = require("../validations/role");
const { Op } = require("sequelize");

const {
  successResponse,
  errorResponse,
  validationResponse,
} = require("../utils/responseApi");
const { ROLES } = require("../../config/constants");

const get = async (req, res) => {
  try {
    const getRolesByUser = req.user.roles.includes(
      ROLES.superAdministrator.code
    )
      ? [ROLES.superAdministrator.code, ROLES.administrator.code]
      : [ROLES.user.code];

    const roles = await Role.findAll({
      where: {
        code: getRolesByUser,
      },
    });

    return res.status(200).json(successResponse("Success", { roles }));
  } catch (err) {
    console.log(err.message);
    return res
      .status(500)
      .json(errorResponse("Ocurrió un error en el servidor.", res.statusCode));
  }
};

// const get = async (req, res) => {
//   try {
//     const role = await Role.findAll();
//     res.status(200).json({ roles: role });
//   } catch (err) {
//     return res.status(400).json({ error: err.message });
//   }
// };

const create = async (req, res) => {
  const { error } = roleValidation(req.body);

  if (error) return res.status(400).json({ error: error.details[0].message });

  const role = await Role.findOne({
    where: {
      [Op.or]: [{ code: req.body.code }, { name: req.body.name }],
    },
  });

  if (role)
    return res
      .status(400)
      .json({ error: "role with code or name already exists" });

  try {
    const savedRole = await Role.create(req.body);
    return res.status(201).json({ role: savedRole });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const assign = async (req, res) => {
  const { error } = assignRoleValidation(req.body);

  if (error) return res.status(400).json({ error: error.details[0].message });

  const role = await Role.findOne({
    where: { code: req.body.codeRole },
  });

  const user = await User.findOne({
    where: {
      username: req.body.username,
    },
  });

  if (!user || !role)
    return res.status(400).json({ error: "user or role does not exists" });

  try {
    const userRoleSaved = await UserRole.create(req.body);
    return res.status(201).json({ userRole: userRoleSaved });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

module.exports = {
  create,
  assign,
  get,
};
