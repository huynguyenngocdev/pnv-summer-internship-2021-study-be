import * as myClassFolder from '../app/http/controllers/myClassFolder.controller.js';

import { Router } from 'express';
import auth from '../app/http/middleware/auth.js';
const router = Router({ mergeParams: true });

/**
 * @api {post} /api/users/:userId/folders Create a new Folder for the Lesson and the Flashcard
 * @apiGroup Class Folder
 * @apiHeader {String} authorization Bearer token.
 *
 * @apiParam {String} name name of the Folder.
 * @apiParam {Array} [lessons=[]] list id of the Lesson in the Folder.
 * @apiParam {String} [color="gray"] color of the the Folder.
 * @apiParam {String} [backgroundImage=null] link image of background of the Folder.
 * @apiParam {String} userName name owner of the Folder.
 * @apiParam {String} userId id owner of the Folder.
 *
 * @apiSampleRequest off
 */
router.post('/', [
  auth,
  myClassFolder.checkUserExist,
  myClassFolder.checkFolderInclude,
  myClassFolder.create,
]);

/**
 * @api {get} /api/users/:userId/folders/:folderId Get a Folder for the Lesson and the Flashcard
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
router.get('/:folderId', [
  auth,
  myClassFolder.checkUserExist,
  myClassFolder.checkFolderInclude,
  myClassFolder.findOne,
]);

/**
 * @api {put} /api/users/:userId/folders/:folderId Update a Folder for the Lesson and the Flashcard
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
router.put('/:folderId', [
  auth,
  myClassFolder.checkUserExist,
  myClassFolder.checkFolderInclude,
  myClassFolder.update,
]);

export default router;
