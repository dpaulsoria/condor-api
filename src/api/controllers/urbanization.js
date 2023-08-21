const { validateUrbanization } = require("../validations/urbanization");
const { Urbanization } = require("../models");
const { Op } = require("sequelize");
const { getPagination, getPagingData } = require("../utils/pagination");

const {
  successResponse,
  errorResponse,
  validationResponse,
} = require("../utils/responseApi");

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

    const { count, rows } = await Urbanization.findAndCountAll({
      where: condition,
      offset: offset,
      limit: limit,
    });

    const pagination = getPagingData(count, page, limit);

    return res.status(200).json(
      successResponse("Success!", {
        pagination,
        urbanizations: rows,
      })
    );
  } catch (error) {
    return res
      .status(500)
      .json(errorResponse("Ocurrió un error en el servidor.", res.statusCode));
  }
};

const get = async (req, res) => {
  const id = req.params.id;

  try {
    const urbanization = await Urbanization.findOne({ where: { id: id } });
    return res.status(200).json(successResponse("Success", { urbanization }));
  } catch (err) {
    return res
      .status(500)
      .json(errorResponse("Ocurrió un error en el servidor.", res.statusCode));
  }
};

const create = async (req, res) => {
  const { error } = validateUrbanization(req.body);

  if (error)
    return res
      .status(422)
      .json(validationResponse(error.details.map((e) => e.message)));

  try {
    const urbanization = await Urbanization.findOne({
      where: {
        [Op.or]: { code: req.body.code, name: req.body.name },
      },
    });

    if (urbanization)
      return res
        .status(422)
        .json(validationResponse(["Código o nombre ya existen."]));

    const savedUrbanization = await Urbanization.create(req.body);

    return res.status(201).json(
      successResponse("Urbanización creada!", {
        urbanization: savedUrbanization,
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
    const num = await Urbanization.destroy({ where: { id: id } });

    if (num != 1)
      return res
        .status(400)
        .json(
          validationResponse([`No puede eliminar la urbanización con id=${id}`])
        );

    return res
      .status(200)
      .json(successResponse("La urbanización fué eliminada exitosamente.", {}));
  } catch (err) {
    return res
      .status(500)
      .json(errorResponse("Ocurrió un error en el servidor.", res.statusCode));
  }
};

const update = async (req, res) => {
  const { error } = validateUrbanization(req.body, true);

  if (error)
    return res
      .status(422)
      .json(validationResponse(error.details.map((e) => e.message)));

  try {
    const id = req.params.id;

    const [num, urbanizationUpdated] = await Urbanization.update(req.body, {
      where: { id: id },
      returning: true,
    });

    if (num != 1)
      return res
        .status(400)
        .json(
          validationResponse([
            `No puede actualizar la urbanización con id=${id}`,
          ])
        );

    return res.status(200).json(
      successResponse("La urbanización fue actualizada exitosamente.", {
        urbanization: urbanizationUpdated,
      })
    );
  } catch (err) {
    return res
      .status(500)
      .json(errorResponse("Ocurrió un error en el servidor.", res.statusCode));
  }
};

module.exports = {
  getAll,
  get,
  create,
  update,
  destroy,
};
