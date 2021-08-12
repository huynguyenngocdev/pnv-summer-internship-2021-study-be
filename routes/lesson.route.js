import { Router } from 'express';
const router = Router();
import * as lession from '../app/http/controllers/lesson.controller.js';
import auth from '../app/http/middleware/auth.js';

router.post('/', auth, lession.create);
router.get('/', auth, lession.findAll);
router.get('/:id', auth, lession.findOne);
router.put('/:id', auth, lession.update);
router.delete('/:id', auth, lession.deleteOne);
router.delete('/', auth, lession.deleteAll);
router.put('/:id/addAFlashcard', auth, lession.addAFlashCard);
router.put('/:id/removeAFlashCard', auth, lession.removeAFlashCard);
export default router;
