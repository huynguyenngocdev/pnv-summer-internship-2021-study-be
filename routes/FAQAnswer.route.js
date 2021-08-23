import * as FAQAnswer from '../app/http/controllers/FAQAnswer.controller.js';

import { Router } from 'express';

const router = Router({ mergeParams: true });

/**
 * @api {post} /api/faqs/:faqId/faqAnswers Create a new FAQ answer
 * @apiGroup FAQAnswer
 * @apiHeader {String} authorization Bearer token.
 * @apiParam {String} answer answer
 * @apiParam {String} userId user id of commenter
 * @apiParam {String} userName name of commenter
 * @apiSampleRequest off
 */

router.post('/', [FAQAnswer.checkFAQExist, FAQAnswer.create]);

/**
 * @api {get} /api/faqs/:faqId/faqAnswers Get all FAQ answer
 * @apiGroup FAQAnswer
 *
 * @apiSuccess {String} answer answer
 * @apiSuccess {String} userId user id of commenter
 * @apiSuccess {String} userName name of commenter
 * @apiSampleRequest off
 */

router.get('/', [FAQAnswer.checkFAQExist, FAQAnswer.findAll]);

/**
 * @api {get} /api/faqs/:faqId/faqAnswers/:faqAnswerId Get one FAQ answer
 * @apiGroup FAQAnswer
 *
 * @apiSuccess {String} answer answer
 * @apiSuccess {String} userId user id of commenter
 * @apiSuccess {String} userName name of commenter
 * @apiSampleRequest off
 */
router.get('/:faqAnswerId', [
  FAQAnswer.checkFAQExist,
  FAQAnswer.checkFAQAnswerInclude,
  FAQAnswer.findOne,
]);

/**
 * @api {put} /api/faqs/:faqId/faqAnswers Update a FAQ answer
 * @apiGroup FAQAnswer
 *
 * @apiParam {String} [answer] answer
 * @apiParam {String} [userId] user id of commenter
 * @apiParam {String} [userName] name of commenter
 * @apiSampleRequest off
 */
router.put('/:faqAnswerId', [
  FAQAnswer.checkFAQExist,
  FAQAnswer.checkFAQAnswerInclude,
  FAQAnswer.update,
]);

/**
 *
 * @api {delete} /api/faqs/:faqId/faqAnswers/:faqAnswerId Delete a FAQ answer
 * @apiGroup FAQAnswer
 * @apiHeader {String} authorization Bearer token.
 *
 * @apiSampleRequest off
 */
router.delete('/:faqAnswerId', [
  FAQAnswer.checkFAQExist,
  FAQAnswer.checkFAQAnswerInclude,
  FAQAnswer.deleteOne,
]);

/**
 *
 * @api {delete} /api/faqs/:faqId/faqAnswers Delete all FAQ answer
 * @apiGroup FAQAnswer
 * @apiHeader {String} authorization Bearer token.
 *
 * @apiSampleRequest off
 */
router.delete('/', [FAQAnswer.checkFAQExist, FAQAnswer.deleteAll]);

export default router;
