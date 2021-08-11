import * as flashcard from '../app/http/controllers/flashcard.controller.js';
import { Router } from 'express';
import auth from '../app/http/middleware/auth.js';

const router = Router();
// log by id class
router.post('/', auth, flashcard.create);

router.get('/', auth, flashcard.findAll);

router.get('/:id', auth, flashcard.findOne);

router.put('/:id', auth, flashcard.update);

router.delete('/:id', auth, flashcard.deleteOne);

router.delete('/', auth, flashcard.deleteAll);

export default router;
