const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../model/User");

/* GET users listing. */
router.get("/", auth, async (req, res, next) => {
  let users = await User.find();
  return res.status(200).json(users);
});

// router.get(`/:uid`, async (req, res, next) => {
//   let user = await User.findOne({ '_id': `${req.params.uid}` });
//   if (user) {
//     return res.status(200).json(user);
//   } else {
//     return res.status(200).json({ message: "User is not exists." });
//   }
// });

module.exports = router;
