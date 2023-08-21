/** @format */

const { ValuesPerMonth } = require("../models");
const { Sequelize, Op } = require("sequelize");
const { getPagination, getPagingData } = require("../utils/pagination");

const { successResponse, errorResponse } = require("../utils/responseApi");

const getAll = async (req, res) => {
  try {
    const { page, size, search } = req.query;
    const currentMonth = new Date().getMonth() + 1; // JavaScript cuenta los meses desde 0
    const currentYear = new Date().getFullYear();

    const condition = {
      [Op.and]: [
        search
          ? { [Op.or]: [{ familyCode: { [Op.startsWith]: search } }] }
          : {},
        Sequelize.literal(`EXTRACT(MONTH FROM "issueDate") = ${currentMonth}`),
        Sequelize.literal(`EXTRACT(YEAR FROM "issueDate") = ${currentYear}`),
      ],
    };

    const { limit, offset } = getPagination(page, size);

    const { count, rows } = await ValuesPerMonth.findAndCountAll({
      where: condition,
      offset: offset,
      limit: limit,
    });

    const pagination = getPagingData(count, page, limit);

    return res.status(200).json(
      successResponse("Success!", {
        pagination,
        valuesPerMonth: rows,
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
    const valuesPerMonth = await ValuesPerMonth.findOne({ where: { id: id } });
    return res.status(200).json(successResponse("Success", { valuesPerMonth }));
  } catch (err) {
    return res
      .status(500)
      .json(errorResponse("Ocurrió un error en el servidor.", res.statusCode));
  }
};

module.exports = {
  getAll,
  get,
};
