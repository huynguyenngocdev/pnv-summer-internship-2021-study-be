import * as comment from '../app/http/controllers/comment.controller.js';
import { Router } from 'express';
import auth from '../app/http/middleware/auth.js';

const router = Router();
router.post('/', auth, comment.create);

router.get('/', auth, comment.findAll);

router.get('/:id', auth, comment.findOne);

router.put('/:id', auth, comment.update);

router.delete('/:id', auth, comment.deleteOne);

router.delete('/', auth, comment.deleteAll);

export default router;
