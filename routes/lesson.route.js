import { Router } from 'express';
const router = Router({ mergeParams: true });
import * as lesson from '../app/http/controllers/lesson.controller.js';
import * as myClass from '../app/http/controllers/myclasses.controller.js';

import auth from '../app/http/middleware/auth.js';

/**
 * @api {post} /api/users/:userId/folders/:folderId/lessons Create a new lesson
 * @apiGroup Lessons
 *
 * @apiHeader {String} authorization Bearer token.
 *
 * @apiParam {String} name name of the Lesson.
 * @apiParam {String} color color  of the Lesson.
 * @apiParam {String} [star=0] star of the Lesson .
 *
 * @apiSampleRequest off
 */

router.post('/', [
  auth,
  myClass.findFolder,
  myClass.checkClassInclude,
  lesson.checkClassExist,

  lesson.create,
]);

/**
 * @api {get} /api/users/:userId/folders/:folderId/lessons Get all lessons
 * @apiGroup Lessons
 *
 * @apiHeader {String} authorization Bearer token.
 *
 * @apiSuccess {String} name name of the Lesson.
 * @apiSuccess {String} color color  of the Lesson.
 * @apiSuccess {Array} flashCards=[] list id Flashcard of the Lesson.
 * @apiSuccess {String} star=0 star of the Lesson.
 *
 * @apiSampleRequest off
 */

router.get('/', [
  auth,
  myClass.findFolder,
  myClass.checkClassInclude,
  lesson.checkClassExist,
  lesson.findAll,
]);

/**
 * @api {get} /api/users/:userId/folders/:folderId/lessons/:lessonId Get a lesson
 * @apiGroup Lessons
 *
 * @apiHeader {String} authorization Bearer token.
 *
 * @apiSuccess {String} name name of the Lesson.
 * @apiSuccess {String} color color  of the Lesson.
 * @apiSuccess {Array} flashCards=[] list id Flashcard of the Lesson.
 * @apiSuccess {String} star=0 star of the Lesson.
 *
 * @apiSampleRequest off
 */

router.get('/:lessonId', [
  auth,
  myClass.findFolder,
  myClass.checkClassInclude,
  lesson.checkClassExist,
  lesson.checkLessonInclude,
  lesson.findOne,
]);

/**
 * @api {put} /api/users/:userId/folders/:folderId/lessons/:lessonId Update a lesson
 * @apiGroup Lessons
 *
 * @apiHeader {String} authorization Bearer token.
 *
 * @apiParam {String} [name] name of the Lesson.
 * @apiParam {String} [color] color  of the Lesson.
 * @apiParam {Array} [flashCards=[]] list id Flashcard of the Lesson.
 * @apiParam {String} [star=0] star of the Lesson.
 *
 * @apiSampleRequest off
 */

router.put('/:lessonId', [
  auth,
  myClass.findFolder,
  myClass.checkClassInclude,
  lesson.checkClassExist,
  lesson.checkLessonInclude,
  lesson.update,
]);

/**
 * @api {delete} /api/users/:userId/folders/:folderId/lessons/:lessonId Delete a lesson
 * @apiGroup Lessons
 *
 * @apiHeader {String} authorization Bearer token.
 * @apiSampleRequest off
 */

router.delete('/:lessonId', [
  auth,
  myClass.findFolder,
  myClass.checkClassInclude,
  lesson.checkClassExist,
  lesson.checkLessonInclude,
  lesson.deleteOne,
]);

/**
 * @api {delete} /api/users/:userId/folders/:folderId/lessons Dalete all lessons
 * @apiGroup Lessons
 *
 * @apiHeader {String} authorization Bearer token.
 * @apiSampleRequest off
 */

router.delete('/', [
  auth,
  myClass.findFolder,
  myClass.checkClassInclude,
  lesson.checkClassExist,
  lesson.deleteAll,
]);
export default router;
