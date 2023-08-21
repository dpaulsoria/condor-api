const jwt = require("jsonwebtoken");
require("dotenv");
const { errorResponse } = require("../utils/responseApi");

const verifyJWT = (req, res, next) => {    
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
 
    if (!authHeader?.startsWith("Bearer "))
      return res
        .status(401)
        .json(errorResponse("Usuario no autorizado.", res.statusCode));
  
    const token = authHeader.split(" ")[1];

    const verified = jwt.verify(token, process.env.JWT_SECRET); 
    req.user = verified;
    return next();
  } catch (error) { 
    return res
      .status(401)
      .json(errorResponse("Autenticación inválida.", res.statusCode));
  }
};

const canAccess = (roles) => async (req, res, next) => { 
  for (const role of roles)
    if (req.user?.roles?.includes(role.code)) return next();

  return res
    .status(401)
    .json(errorResponse("Usuario no autorizado - canAccess", res.statusCode));
};

module.exports = { verifyJWT, canAccess };
