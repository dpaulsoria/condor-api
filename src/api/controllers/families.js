const {  Family, Urbanization } = require("../models");
const { Op } = require("sequelize");
const { familyValidation } = require("../validations/family");
const { getPagination, getPagingData } = require("../utils/pagination");

const {
  successResponse,
  errorResponse,
  validationResponse,
} = require("../utils/responseApi");

const create = async (req, res) => {
  const { error } = familyValidation(req.body);

  if (error)
    return res
      .status(422)
      .json(validationResponse(error.details.map((e) => e.message)));

  const family = await Family.findOne({
    where: {
      [Op.or]: [{ code: req.body.code }, { name: req.body.name }],
    },
  });

  if (family)
    return res
      .status(422)
      .json(validationResponse(["Código o nombre ya existe"]));

  const urbanization = await Urbanization.findOne({
    where: { code: req.user.codeUrbanization },
  });

  if (!urbanization)
    return res
      .status(400)
      .json(validationResponse(["La urbanización no existe"]));

  try {
    const savedFamily = await Family.create({
      code: req.body.code,
      name: req.body.name,
      address: req.body.address,
      aliquot : req.body.aliquot,
      codeUrbanization: req.user.codeUrbanization,
    });

    return res.status(201).json(
      successResponse("family created!", {
        family: savedFamily,
      })
    );
  } catch (err) {
    return res
      .status(500)
      .json(errorResponse("Ocurrió un error en el servidor.", res.statusCode));
  }
};

const destroy = async (req, res) => {
  const id = req.params.id;

  try {
    const num = await Family.destroy({ where: { id: id } });

    if (num != 1)
      return res
        .status(400)
        .json(validationResponse([`No puede eliminar la familia con id=${id}`]));

    return res
      .status(200)
      .json(successResponse("La familia fué eliminada exitosamente.", {}));
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
            { name: { [Op.startsWith]: search } },
            { code: { [Op.startsWith]: search } },
          ],
        }
      : null;

    const { limit, offset } = getPagination(page, size);

    const { count, rows } = await Family.findAndCountAll({
      where: {
        ...condition,
        ...(req?.user?.codeUrbanization && {
          codeUrbanization: req.user.codeUrbanization,
        }),
      },
      offset: offset,
      limit: limit,
    });

    const pagination = getPagingData(count, page, limit);

    return res.status(200).json(
      successResponse("Success!", {
        pagination,
        families: rows,
      })
    );
  } catch (err) {
    console.log(err.message);
    return res
      .status(500)
      .json(errorResponse("Ocurrió un error en el servidor.", res.statusCode));
  }
};

const get = async (req, res) => {
  const id = req.params.id;

  try {
    const family = await Family.findOne({ where: { id: id } });
    return res.status(200).json(successResponse("Success", { family }));
  } catch (err) {
    return res
      .status(500)
      .json(errorResponse("Ocurrió un error en el servidor.", res.statusCode));
  }
};

const getByCode = async (req, res) => {
  const code = req.params.code;

  try {
    const family = await Family.findOne({ where: { code: code } });
    return res.status(200).json(successResponse("Success", { family }));
  } catch (err) {
    return res
      .status(500)
      .json(errorResponse("Ocurrió un error en el servidor.", res.statusCode));
  }
};

const update = async (req, res) => {
  const { error } = familyValidation(req.body, true);

  if (error)
    return res
      .status(422)
      .json(validationResponse(error.details.map((e) => e.message)));

  try {
    const id = req.params.id;

    const [num, familyUpdated] = await Family.update(req.body, {
      where: { id: id },
      returning: true,
    });

    // Validate if urbanization exist

    if (num != 1)
      return res
        .status(400)
        .json(
          validationResponse([`No puede actualizar la familia con id=${id}`])
        );

    return res.status(200).json(
      successResponse("La familia fué actualizada exitosamente.", {
        family: familyUpdated,
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
  getByCode,
  destroy,
  update,
};
