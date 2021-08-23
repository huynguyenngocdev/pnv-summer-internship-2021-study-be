import * as flashcard from '../app/http/controllers/flashcard.controller.js';
import * as lesson from '../app/http/controllers/lesson.controller.js';
import * as myClass from '../app/http/controllers/myclasses.controller.js';

import { Router } from 'express';
import auth from '../app/http/middleware/auth.js';

const router = Router({ mergeParams: true });
// log by id class

/**
 * @api {post} /api/users/:userId/folders/:folderId/lessons/:lessonId/flashcards Create a new Flashcard
 * @apiGroup Flashcards
 *
 * @apiHeader {String} authorization Bearer token.
 *
 * @apiParam {String} topic topic of the Flashcard.
 * @apiParam {String} owner id of User.
 * @apiParam {String} question question of The Flashcard.
 * @apiParam {String} answer answer of The Flashcard.
 *
 * @apiSampleRequest off
 */

router.post('/', [
  auth,
  myClass.findFolder,
  myClass.checkClassInclude,
  lesson.checkClassExist,
  lesson.checkLessonInclude,
  flashcard.checkLessonExist,
  flashcard.create,
]);

/**
 * @api {get} /api/users/:userId/folders/:folderId/lessons/:lessonId/flashcards Get all Flashcard
 * @apiGroup Flashcards
 *
 * @apiHeader {String} authorization Bearer token.
 *
 * @apiSuccess {String} id id of the Flashcard.
 * @apiSuccess {String} topic topic of the Flashcard.
 * @apiSuccess {String} owner id of User.
 * @apiSuccess {Array} list array contain question and answer.
 * @apiSuccess {String} question owner's id of the User.
 * @apiSuccess {String} answer owner's name of the User.
 *
 * @apiSampleRequest off
 */

router.get('/', [
  auth,
  myClass.findFolder,
  myClass.checkClassInclude,
  lesson.checkClassExist,
  lesson.checkLessonInclude,
  flashcard.checkLessonExist,

  flashcard.findAll,
]);

/**
 * @api {get} /api/users/:userId/folders/:folderId/lessons/:lessonId/flashcards/:flashCardId Get a Flashcard
 * @apiGroup Flashcards
 *
 * @apiHeader {String} authorization Bearer token.
 *
 * @apiSuccess {String} id id of the Flashcard.
 * @apiSuccess {String} topic topic of the Flashcard.
 * @apiSuccess {String} owner id of User.
 * @apiSuccess {Array} list array contain question and answer.
 * @apiSuccess {String} question owner's id of the User.
 * @apiSuccess {String} answer owner's name of the User.
 *
 * @apiSampleRequest off
 */

router.get('/:flashCardId', [
  auth,
  myClass.findFolder,
  myClass.checkClassInclude,
  lesson.checkClassExist,
  lesson.checkLessonInclude,
  flashcard.checkLessonExist,
  flashcard.checkLessonInclude,
  flashcard.findOne,
]);

/**
 * @api {put} /api/users/:userId/folders/:folderId/lessons/:lessonId/flashcards/:flashCardId Update a Flashcard
 * @apiGroup Flashcards
 *
 * @apiHeader {String} authorization Bearer token.
 *
 * @apiParam {String} [topic] topic of the Flashcard.
 * @apiParam {String} [owner] id of User.
 * @apiParam {String} [question] owner's id of the User.
 * @apiParam {String} [answer] owner's name of the User.
 *
 * @apiSampleRequest off
 */

router.put('/:flashCardId', [
  auth,
  myClass.findFolder,
  myClass.checkClassInclude,
  lesson.checkClassExist,
  lesson.checkLessonInclude,
  flashcard.checkLessonExist,
  flashcard.checkLessonInclude,
  flashcard.update,
]);

/**
 * @api {delete} /api/users/:userId/folders/:folderId/lessons/:lessonId/flashcards/:flashCardId Delete a Flashcard
 * @apiGroup Flashcards
 *
 * @apiHeader {String} authorization Bearer token.
 * @apiSampleRequest off
 */

router.delete('/:flashCardId', [
  auth,
  myClass.findFolder,
  myClass.checkClassInclude,
  lesson.checkClassExist,
  lesson.checkLessonInclude,
  flashcard.checkLessonExist,
  flashcard.checkLessonInclude,
  flashcard.deleteOne,
]);

/**
 * @api {delete} /api/users/:userId/folders/:folderId/lessons/:lessonId/flashcards Delete all Flashcard
 * @apiGroup Flashcards
 *
 * @apiHeader {String} authorization Bearer token.
 * @apiSampleRequest off
 */

router.delete('/', [
  auth,
  myClass.findFolder,
  myClass.checkClassInclude,
  lesson.checkClassExist,
  lesson.checkLessonInclude,
  flashcard.checkLessonExist,
  flashcard.deleteAll,
]);

export default router;
