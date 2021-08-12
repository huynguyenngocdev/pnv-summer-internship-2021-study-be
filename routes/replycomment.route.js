import replyComment from '../controllers/replycomment.controller.js';
import auth from '../app/http/middleware/auth.js';
import { Router } from 'express';
const router = Router();

router.post('/', auth, replyComment.create);

router.get('/', auth, replyComment.findAll);

router.get('/:id', auth, replyComment.findOne);

router.put('/:id', auth, replyComment.update);

router.delete('/:id', auth, replyComment.delete);

router.delete('/', auth, replyComment.deleteAll);
export default router;
