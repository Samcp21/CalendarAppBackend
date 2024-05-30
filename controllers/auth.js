const { response } = require("express");
const bcrypt = require("bcryptjs");
const Users = require("../models/Users");
const { generateJWT } = require("../helpers/jwt");

const createUser = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    let user = await Users.findOne({ email });
    if (user) {
      return res.status(400).json({
        ok: false,
        msg: "A user already exists with that email",
      });
    }
    user = new Users({ ...req.body });

    const salt = bcrypt.genSaltSync();

    user.password = bcrypt.hashSync(password, salt);

    await user.save();

    const token = await generateJWT(user.id, user.name);

    res.status(201).json({
      ok: true,
      uuid: user.id,
      name: user.name,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Please contact the administrator",
    });
  }
};

const loginUser = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    const user = await Users.findOne({ email });

    if (!user) {
      return res.status(400).json({
        ok: false,
        msg: "The user does not exist",
      });
    }

    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "The password is not correct",
      });
    }

    const token = await generateJWT(user.id, user.name);
    return res.json({
      ok: true,
      uuid: user.id,
      name: user.name,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Please contact the administrator",
    });
  }

  res.status(200).json({
    ok: true,
    msg: "Login",
    user: req.body,
  });
};

const revalidateToken = async (req, res = response) => {
  const { uuid, name } = req;
  const token = await generateJWT(uuid, name);

  res.json({
    ok: true,
    uid: uuid,
    name,
    token,
  });
};

module.exports = { createUser, loginUser, revalidateToken };
