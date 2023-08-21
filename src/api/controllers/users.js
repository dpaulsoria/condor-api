const {
  User,
  Role,
  UserRole,
  Family,
  Urbanization,
  ImageUser,
  sequelize,
} = require("../models");

const {
  userCreateValidation,
  userUpdateValidation,
  updateProfileValidation,
} = require("../validations/user");

const { Op } = require("sequelize");
const { getPagination, getPagingData } = require("../utils/pagination");

const {
  successResponse,
  errorResponse,
  validationResponse,
} = require("../utils/responseApi");

const { ROLES } = require("../../config/constants");

// Prueba
const { uploadMultipleImages } = require("../services/firebase.js");

const create = async (req, res) => {
  try {
    // Details field can be received as String or JsonObject
    req.body.details &&=
      typeof req.body.details === "string" && JSON.parse(req.body.details);

    // Validations data body
    const { error } = userCreateValidation({ ...req.body, ...req.files });

    if (error)
      return res
        .status(422)
        .json(validationResponse(error.details.map((e) => e.message)));

    const { email, username, codeRole, codeFamily, codeUrbanization } = req.body;

    const user = await User.findOne({
      where: { [Op.or]: [{ email }, { username }] },
    });

    if (user)
      return res
        .status(422)
        .json(validationResponse(["Email o usuario ya existen."]));

    const role = await Role.findAll({
      where: {
        code: codeRole,
      },
    });

    if (role.length < codeRole.length)
      return res
        .status(400)
        .json(validationResponse(["Los roles son incorrectos."]));

    const family =
      codeFamily &&
      (await Family.findAll({
        where: {
          code: codeFamily,
        },
      }));

    if (codeFamily && family.length < codeFamily.length)
      return res
        .status(400)
        .json(validationResponse(["Los grupos son incorrectos."]));

    const urbanization =
      codeUrbanization &&
      (await Urbanization.findOne({
        where: {
          code: codeUrbanization,
        },
      }));

    if (codeUrbanization && !urbanization)
      return res
        .status(400)
        .json(validationResponse(["La urbanización no existe."]));

    // Upload images
    const profileImgLink = await uploadMultipleImages(
      req.files?.profileImage,
      "profile"
    );

    const carPlateImgLink = await uploadMultipleImages(
      req.files?.carPlate,
      "carPlate"
    );

    const carImgLink = await uploadMultipleImages(req.files?.car, "car");

    await sequelize.transaction(async (t) => {
      const savedUser = await User.create(req.body, { transaction: t });
      await savedUser.addRoles(role, { transaction: t });

      await ImageUser.bulkCreate(
        [...profileImgLink, ...carImgLink, ...carPlateImgLink].map((i) => ({
          url: i?.url,
          type: i?.type,
          reference: i?.reference,
          username: savedUser?.username,
        })),
        { transaction: t }
      );

      if (codeFamily) await savedUser.addFamilies(family, { transaction: t });

      if (codeUrbanization)
        await savedUser.setUrbanization(urbanization, { transaction: t });

      return res.status(201).json(
        successResponse("User created!", {
          user: {
            username: savedUser.username,
          },
        })
      );
    });
  } catch (err) {
    console.log(err.message);
    return res
      .status(500)
      .json(errorResponse("Ocurrió un error en el servidor.", res.statusCode));
  }
};

const update = async (req, res) => {
  try {
    // Details field can be received as String or JsonObject
    req.body.details &&=
      typeof req.body.details === "string" && JSON.parse(req.body.details);

    const { error } = userUpdateValidation({ ...req.body, ...req.files });

    if (error)
      return res
        .status(422)
        .json(validationResponse(error.details.map((e) => e.message)));

    const { id } = req.params;
    let user = await User.findOne({ where: { id } });

    if (!user)
      return res.status(400).json(validationResponse(["Usuario no existe."]));

    const t = await sequelize.transaction();

    if (req.body?.codeRole) {
      const rolesUpdated = await user
        .setRoles(req.body?.codeRole, { transaction: t })
        .catch(async (e) => {
          await t.rollback();
          return null;
        });

      if (!rolesUpdated)
        return res
          .status(400)
          .json(validationResponse(["Los roles son incorrectos."]));
    }

    if (req.body?.codeFamily) {
      const familiesUpdated = await user
        .setFamilies(req.body?.codeFamily, { transaction: t })
        .catch(async (e) => {
          await t.rollback();
          return null;
        });

      if (!familiesUpdated)
        return res
          .status(400)
          .json(validationResponse(["Los grupos son incorrectos."]));
    }

    if (req.body?.details?.driver !== undefined && !req.body?.details?.driver) {
      // Delete existing
      await ImageUser.destroy({
        where: {
          username: user.username,
          type: {
            [Op.or]: ["car", "carPlate"],
          },
        },
        transaction: t,
      });
    }

    // Images
    let { carPlateUpdated, carUpdated, profileImageUpdated } = req.body;
    carPlateUpdated &&= JSON.parse(carPlateUpdated);
    carUpdated &&= JSON.parse(carUpdated);
    profileImageUpdated &&= JSON.parse(profileImageUpdated);

    // Delete carPlate
    carPlateUpdated &&
      (await Promise.all(
        carPlateUpdated?.map(async (carPlate) => {
          await ImageUser.destroy({
            where: {
              id: carPlate?.id,
            },
            transaction: t,
          });
        })
      ));

    // Delete Car updated
    carUpdated &&
      (await Promise.all(
        carUpdated?.map(async (car) => {
          await ImageUser.destroy({
            where: {
              id: car?.id,
            },
            transaction: t,
          });
        })
      ));

    // Delete profile upload
    profileImageUpdated &&
      (await ImageUser.destroy({
        where: {
          id: profileImageUpdated?.id,
        },
        transaction: t,
      }));

    const profileImgLink = await uploadMultipleImages(
      req.files?.profileImage,
      "profile"
    );

    const carPlateImgLink = await uploadMultipleImages(
      req.files?.carPlate,
      "carPlate"
    );

    const carImgLink = await uploadMultipleImages(req.files?.car, "car");

    await ImageUser.bulkCreate(
      [...profileImgLink, ...carImgLink, ...carPlateImgLink].map((i) => ({
        url: i?.url,
        type: i?.type,
        reference: i?.reference,
        username: user?.username,
      })),
      { transaction: t }
    );

    // Set data user
    user = Object.assign(user, req.body);
    await user.save({ transaction: t });
    await t.commit();

    return res.status(201).json(
      successResponse("User updated!", {
        user: {
          updated: user,
        },
      })
    );
  } catch (err) {
    return res
      .status(500)
      .json(errorResponse("Ocurrió un error en el servidor.", res.statusCode));
  }
};

const getAll = async (req, res) => {
  try {
    const { page, size, search } = req.query;
    const condition = search
      ? {
          [Op.or]: [
            { username: { [Op.startsWith]: search } },
            { fullName: { [Op.startsWith]: search } },
          ],
        }
      : null;

    const { limit, offset } = getPagination(page, size);

    // Condicion para obtener usuarios con roles especificos según el rol del usuario
    const getuserbyRoles = req.user.roles.includes(
      ROLES.superAdministrator.code
    )
      ? [ROLES.superAdministrator.code, ROLES.administrator.code]
      : [ROLES.user.code];

    const { count, rows } = await User.scope("hideSentive").findAndCountAll({
      offset: offset,
      limit: limit,

      where: {
        ...condition,

        ...(req.user?.codeUrbanization && {
          codeUrbanization: req.user.codeUrbanization,
        }),

        id: {
          [Op.ne]: req.user.id,
        },
      },

      include: [
        {
          model: Role,
          attributes: ["id", "code", "name"],
          where: {
            code: getuserbyRoles,
          },
        },
        { model: Family, attributes: ["id", "code", "name"] },
      ],
    });

    const pagination = getPagingData(count, page, limit);

    return res.status(200).json(
      successResponse("Success!", {
        pagination,
        users: rows,
      })
    );
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json(errorResponse("Ocurrió un error en el servidor.", res.statusCode));
  }
};

const get = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.scope("hideSentive").findOne({ where: { id: id } });

    if (
      req.user.roles.includes(ROLES.administrator.code) &&
      user?.codeUrbanization !== req.user.codeUrbanization
    )
      return res
        .status(400)
        .json(validationResponse(["Usuario no encontrado."]));

    const images = await ImageUser.findAll({
      where: { username: user.username },
      attributes: {
        exclude: ["username", "updatedAt"],
      },
    });

    // Roles
    const UserRoles = (await user.getRoles({ raw: true })).map((r) => r.code);
    const UserFamilies = (await user.getFamilies({ raw: true })).map((r) => r.code);
    // Response
    return res.status(200).json(
      successResponse("Success", {
        user: {
          ...user.dataValues,
          images: images,
          roles: UserRoles,
          families: UserFamilies,
        },
      })
    );
  } catch (err) {
    console.log(err.message);
    return res
      .status(500)
      .json(errorResponse("Ocurrió un error en el servidor.", res.statusCode));
  }
};

const destroy = async (req, res) => {
  const { id } = req.params;

  try {
    const num = await User.destroy({ where: { id } });

    if (num != 1)
      return res
        .status(400)
        .json(
          validationResponse([`No puede eliminar el usuario con id=${id}`])
        );

    return res
      .status(200)
      .json(successResponse("El usuario fué eliminado existosamente.", {}));
  } catch (err) {
    console.log(err.message);
    return res
      .status(500)
      .json(errorResponse("Ocurrió un error en el servidor.", res.statusCode));
  }
};

const getProfile = async (req, res) => {
  const user = req.user;

  try {
    const userData = await User.scope("hideSentive").findOne({
      where: { id: user.id },
    });

    const imagenes = await ImageUser.findAll({
      where: { username: userData.username },
      attributes: {
        exclude: ["username", "updatedAt"],
      },
    });

    return res.status(200).json(
      successResponse("Success", {
        user: userData,
        images: imagenes,
      })
    );
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json(errorResponse("Ocurrió un error en el servidor.", res.statusCode));
  }
};

const updateProfile = async (req, res) => {
  const { error } = updateProfileValidation(req.body);

  if (error)
    return res
      .status(422)
      .json(validationResponse(error.details.map((e) => e.message)));

  try {
    const user = req.user;

    let userData = await User.findOne({ where: { id: user.id } });

    if (!userData)
      return res
        .status(400)
        .json(validationResponse(["El usuario no existe."]));

    userData = Object.assign(userData, req.body);
    await userData.save();

    return res.status(201).json(
      successResponse("Usuario actualizado.", {
        user: userData,
      })
    );
  } catch (err) {
    console.log(err.message);
    return res
      .status(500)
      .json(errorResponse("Ocurrió un error en el servidor.", res.statusCode));
  }
};

const getUserData = async (req, res) => {  
  try {
    const userData = await User.scope("hideSentive").findOne({
      where: { username: req.params.username },
      include: [
        {
          model: Urbanization,          
          attributes: ["id", "code"],
          where: {
            code: req.params.urbanization,
          },
        }
      ]
    }); 
    const imagenes = await ImageUser.findAll({
      where: { username: userData.username },
      attributes: {
        exclude: ["username", "updatedAt"],
      },
    }); 
    return res.status(200).json(
      successResponse("Success", {
        user: userData,
        images: imagenes,
      })
    );
  } catch (err) { 
    return res
      .status(500)
      .json(errorResponse("Ocurrió un error en el servidor.", res.statusCode));
  }
};

module.exports = {
  create,
  getAll,
  get,
  destroy,
  update,
  getProfile,
  updateProfile,
  getUserData
};
