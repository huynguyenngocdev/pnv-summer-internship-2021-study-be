import * as myClass from '../app/http/controllers/myclasses.controller.js';

import { Router } from 'express';
import auth from '../app/http/middleware/auth.js';
const router = Router({ mergeParams: true });

/**
 * @api {post} /api/class Create a new Folder for the Lesson and the Flashcard
 * @apiGroup Class Folder
 * @apiHeader {String} authorization Bearer token.
 *
 * @apiParam {String} name name of the Folder.
 * @apiParam {Array} [lessons=[]] list id of the Lesson in the Folder.
 * @apiParam {String} [color="gray"] color of the the Folder.
 * @apiParam {String} [backgroundImage=null] link image of background of the Folder.
 * @apiParam {String} userName name owner of the Folder.
 * @apiParam {String} userId id owner of the FoldclassIder.
 *
 * @apiSampleRequest off
 */
router.post('/', [auth, myClass.findFolder, myClass.create]);

/**
 * @api {get} /api/class Get a Folder for the Lesson and the Flashcard
 * @apiGroup Class Folder
 * @apiHeader {String} authorization Bearer token.
 *
 * @apiSuccess {String} name name of the Folder.
 * @apiSuccess {Array} lessons=[] list id of the Lesson in the Folder.
 * @apiSuccess {String} color="gray" color of the the Folder.
 * @apiSuccess {String} backgroundImage=null link image of background of the Folder.
 * @apiSuccess {String} userName name owner of the Folder.
 * @apiSuccess {String} userId id owner of the Folder.
 *
 * @apiSampleRequest off
 */

router.get('/', [auth, myClass.findFolder, myClass.findAll]);

router.get('/:classId', [
  auth,
  myClass.findFolder,
  myClass.checkClassInclude,
  myClass.findOne,
]);

/**
 * @api {put} /api/class Update a Folder for the Lesson and the Flashcard
 * @apiGroup Class Folder
 * @apiHeader {String} authorization Bearer token.
 *
 * @apiParam {String} [name] name of the Folder.
 * @apiParam {Array} [lessons=[]] list id of the Lesson in the Folder.
 * @apiParam {String} [color="gray"] color of the the Folder.
 * @apiParam {String} [backgroundImage=null] link image of background of the Folder.
 * @apiParam {String} [userName] name owner of the Folder.
 * @apiParam {String} [userId] id owner of the Folder.
 *
 * @apiSampleRequest off
 */
router.put('/:classId', [
  auth,
  myClass.findFolder,
  myClass.checkClassInclude,
  myClass.update,
]);
router.delete('/:classId', [
  auth,
  myClass.findFolder,
  myClass.checkClassInclude,
  myClass.deleteOne,
]);
export default router;
