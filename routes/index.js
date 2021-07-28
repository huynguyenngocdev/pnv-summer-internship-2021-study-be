var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: "API for the project of PNV's students at CES" });
});


module.exports = router;
