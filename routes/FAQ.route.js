import * as FAQ from '../app/http/controllers/FAQ.controller.js';
import { Router } from 'express';
import auth from '../app/http/middleware/auth.js';

const router = Router();

/**
 * @api {post} /api/faqs Create a new FAQ
 * @apiGroup FAQ
 *
 * @apiHeader {String} authorization Bearer token.
 * @apiParam {String} question the question of the FAQ
 * @apiParam {String} image image of the FAQ
 * @apiParam  {Array} [listAnswer=[]] list id of answer  for question
 * @apiParam {Boolean} isSolve=false status of question
 * @apiSampleRequest off
 */
router.post('/', auth, FAQ.create);

/**
 * @api {get} /api/faqs Get all FAQ
 * @apiGroup FAQ
 *
 * @apiHeader {String} authorization Bearer token.
 *
 * @apiSuccess {String} question the question
 * @apiSuccess {String} image image of the FAQ
 * @apiSuccess  {Array} listAnswer=[] list id of answer  for question
 * @apiSuccess {Boolean} isSolve=false status of question
 *
 * @apiSampleRequest off
 */
router.get('/', auth, FAQ.findAll);

/**
 * @api {get} /api/faqs/:id Get one FAQ
 * @apiGroup FAQ
 *
 * @apiHeader {String} authorization Bearer token.
 *
 * @apiSuccess {String} question the question
 * @apiSuccess {String} image image of the FAQ
 * @apiSuccess  {Array} listAnswer=[] list id of answer  for question
 * @apiSuccess {Boolean} isSolve=false status of question
 *
 * @apiSampleRequest off
 */
router.get('/:id', auth, FAQ.findOne);

/**
 * @api {put} /api/faqs/:id Update the FAQ
 * @apiGroup FAQ
 *
 * @apiHeader {String} authorization Bearer token.
 *
 * @apiParam {String} [question] the question
 * @apiParam {String} [image] image of the FAQ
 * @apiParam  {Array} [listAnswer=[]] list id of answer  for question
 * @apiParam {Boolean} [isSolve=false] status of question
 *
 * @apiSampleRequest off
 */
router.put('/:id', auth, FAQ.update);

/**
 * @api {delete} /api/faqs/:id Delete a FAQ
 * @apiGroup FAQ
 *
 * @apiHeader {String} authorization Bearer token.
 * @apiSampleRequest off
 */
router.delete('/:id', auth, FAQ.deleteOne);

/**
 * @api {delete} /api/faqs Delete all FAQs
 * @apiGroup FAQ
 *
 * @apiHeader {String} authorization Bearer token.
 * @apiSampleRequest off
 */
router.delete('/', auth, FAQ.deleteAll);

export default router;
