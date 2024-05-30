const { response } = require("express");
const jwt = require("jsonwebtoken");

const validarJWT = (req, res = response, next) => {
  const token = req.header("x-token");
  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: "There is no token in the request",
    });
  }
  try {
    const { uuid, name } = jwt.verify(token, process.env.SECRET_JWT_SEED);
    console.log(uuid, name);
    req.uuid = uuid;
    req.name = name;
  } catch (error) {
    return res.status(401).json({
      ok: false,
      msg: "Invalid token",
    });
  }
  next();
};
module.exports = {
  validarJWT,
};
