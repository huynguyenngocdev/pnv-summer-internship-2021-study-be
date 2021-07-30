const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const HTTPStatus = require("http-status");
const User = require("../model/User");

router.get("/", auth, async (req, res, next) => {
  let users = await User.find();
  return res.status(HTTPStatus.OK).json(users);
});

module.exports = router;
