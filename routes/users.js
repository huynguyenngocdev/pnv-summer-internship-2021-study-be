import { Router } from 'express';
import auth from '../app/http/middleware/auth.js';
import users from '../app/models/user.model.js';
const router = Router();

router.post('/', auth, users.create);

router.get('/:id', auth, users.findOne);

export default router;
