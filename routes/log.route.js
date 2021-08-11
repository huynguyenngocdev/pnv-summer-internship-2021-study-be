import * as log from '../app/http/controllers/log.controller.js';
import { Router } from 'express';
import auth from '../app/http/middleware/auth.js';
const router = Router();
// log by id class
router.post('/class/:classId', auth, log.create);

router.get('/class/:classId', auth, log.findAll);

router.get('/class/:classId/:id', auth, log.findOne);

export default router;
