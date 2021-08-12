import * as FAQAnswer from '../app/http/controllers/FAQAnswer.controller';
import { Router } from 'express';

const router = Router();
router.post('/:FQAID', FAQAnswer.create);

router.get('/:FQAID', FAQAnswer.findAll);

router.get('/:FQAID/:id', FAQAnswer.findOne);

router.put('/:FQAID/:id', FAQAnswer.update);

router.delete('/:FQAID/:id', FAQAnswer.deleteOne);

router.delete('/:FQAID', FAQAnswer.deleteAll);

export default router;
