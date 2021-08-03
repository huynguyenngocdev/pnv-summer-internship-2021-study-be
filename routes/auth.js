require("dotenv").config();

const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const HTTPStatus = require("http-status");
const User = require("../model/User");
const { TOKEN_KEY } = process.env;

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!(email && password && name)) {
      return res.status(HTTPStatus.BAD_REQUEST).send({
        message: "All input is required. Please input name, email, password",
      });
    }

    // check if user already exist
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res
        .status(HTTPStatus.CONFLICT)
        .send({ message: "User Already Exist. Please Login" });
    }
    encryptedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
    });

    const token = jwt.sign({ user_id: user._id, email }, TOKEN_KEY, {
      algorithm: "HS384",
      expiresIn: "2h",
    });

    user.token = token;

    return res.status(HTTPStatus.CREATED).json(user);
  } catch (err) {
    console.log(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      res.status(HTTPStatus.BAD_REQUEST).send("All input is required");
    }
    // Validate if user exist in our database
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          algorithm: "HS384",
          expiresIn: "2h",
        }
      );

      user.token = token;

      return res.status(HTTPStatus.OK).json(user);
    }
    return res.status(HTTPStatus.BAD_REQUEST).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
