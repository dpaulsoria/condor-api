/** @format */

require("dotenv").config();
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const { User, Urbanization } = require("../models");
const { registerValidation, loginValidation } = require("../validations/auth");
const { createToken } = require("../utils/utils");
const nodemailer = require("../utils/nodemailer");
const JWT_SECRET = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");
const { encryptData } = require("../utils/utils");
const {
  successResponse,
  errorResponse,
  validationResponse,
} = require("../utils/responseApi");

const login = async (req, res) => {
  const { error } = loginValidation(req.body);

  if (error)
    return res
      .status(422)
      .json(validationResponse(error.details.map((e) => e.message)));

  const { username, password } = req.body;

  try {
    const user = await User.findOne({
      where: {
        [Op.or]: [{ username }, { email: username }],
      },
      include: [Urbanization],
    });

    if (!user)
      return res
        .status(422)
        .json(validationResponse(["Credenciales inválidas"]));

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword)
      return res
        .status(422)
        .json(validationResponse(["Credenciales inválidas"]));

    // List roles
    const roles = (await user.getRoles())?.map((r) => r.code) ?? [];

    const token = createToken(
      {
        id: user.id,
        username: user.username,
        codeUrbanization: user.codeUrbanization,
        roles: roles,
      },
      req.body?.mode ? "30d" : ""
    );
    let userReturn = user.dataValues;
    userReturn.roles = roles;
    delete userReturn.password;
    return res.status(200).json(
      successResponse(
        "Login success",
        {
          token,
          user: userReturn,
        },
        res.statusCode
      )
    );
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json(errorResponse("Ocurrió un error en el servidor.", res.statusCode));
  }
};

const register = async (req, res) => {
  const { error } = registerValidation(req.body);

  if (error) return res.status(400).json({ error: error.details[0].message });

  const user = await User.findOne({
    where: {
      [Op.or]: [{ email: req.body.email }, { username: req.body.username }],
    },
  });

  if (user)
    return res.status(400).json({ error: "Email o usuario ya existen" });

  try {
    const savedUser = await User.create(req.body);
    return res.status(201).json({ user: savedUser });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({
      where: { email: email },
    });
    if (user) {
      const options = { expiresIn: "1h" };
      const token = jwt.sign({ email }, JWT_SECRET, options);
      let mailOptions = {
        from: process.env.EMAIL_SENDER_USER,
        to: email,
        subject: "Restablecer contraseña",
        text: `Para restablecer tu contraseña, haz click en este link: ${process.env.API_FRONTEND}/reset-password?token=${token}`,
      };
      nodemailer.sendMail(mailOptions);
      res.status(200).json({ status: 200, message: "Email enviado" });
    } else {
      res.status(200).json({ status: 200, message: "Email enviado" });
    }
  } catch (error) {
    console.error("Error al enviar el email:", error);
    res.status(400).json({ status: 400, message: "Email no encontrado" });
  }
};
const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    const payload_token = jwt.verify(token, JWT_SECRET);
    if (payload_token) {
      const user = await User.findOne({
        where: { email: payload_token.email },
      });
      await user.update({
        password: password,
      });
      // encryptUserPassword(user);

      res.status(200).json({ valid: true });
    } else {
      res.status(400).json({ valid: false });
    }
  } catch (error) {
    console.error("Error al verificar el token:", error);
    res.status(400).json({ valid: false });
  }
};
const encryptUserPassword = async (user) => {
  if (user.changed("password")) {
    user.password = await encryptData(user.password);
  }
};
module.exports = {
  login,
  register,
  forgotPassword,
  resetPassword,
};
