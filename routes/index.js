import { Router } from 'express';
const router = Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: "API for the project of PNV's students at CES",
  });
});

export default router;
