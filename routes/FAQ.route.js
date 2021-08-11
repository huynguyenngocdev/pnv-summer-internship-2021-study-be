import * as FAQ from '../app/http/controllers/FAQ.controller.js';
import { Router } from 'express';

const router = Router();
router.post('/', FAQ.create);

router.get('/', FAQ.findAll);

router.get('/:id', FAQ.findOne);

router.put('/:id', FAQ.update);

router.delete('/:id', FAQ.deleteOne);

router.delete('/', FAQ.deleteAll);

export default router;
