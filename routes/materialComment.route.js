import * as comment from '../app/http/controllers/comment.controller.js';
import * as material from '../app/http/controllers/material.controller.js';

import { Router } from 'express';
import auth from '../app/http/middleware/auth.js';

const router = Router({ mergeParams: true });

/**
 * @api {material} /api/classrooms/:classroomId/materials/:materialId/comments Create a new comment in a material
 * @apiGroup Comments
 *
 * @apiHeader {String} authorization Bearer token.
 *
 * @apiParam {String} ownerId id of the User who commented.
 * @apiParam {String} ownerName name of commenter.
 * @apiParam {String} message content of the comment.
 * @apiParam {Boolean} [isCommentCorrect] status of the Comment.
 * @apiParam {String} listReply list id of Reply Comment for the Comment.
 *
 * @apiSampleRequest off
 */

router.post('/', [
  auth,
  material.checkClassExist,
  material.checkMaterialInclude,
  comment.checkMaterialExist,
  comment.create,
]);

/**
 * @api {get} /api/classrooms/:classroomId/materials/:materialId/comments Get all comment in the material
 * @apiGroup Comments
 *
 * @apiHeader {String} authorization Bearer token.
 *
 * @apiSuccess {String} id id of the Comment.
 * @apiSuccess {String} ownerId id of the User who commented.
 * @apiSuccess {String} ownerName name of commenter.
 * @apiSuccess {String} message content of the comment.
 * @apiSuccess {Boolean} isCommentCorrect status of the Comment.
 * @apiSuccess {String} listReply list id of Reply Comment for the Comment.
 *
 * @apiSampleRequest off
 */

router.get('/', [
  auth,
  material.checkClassExist,
  material.checkMaterialInclude,
  comment.checkMaterialExist,
  comment.findAll,
]);

/**
 * @api {get} /api/classrooms/:classroomId/materials/:materialId/comments/:commentId Get one comment in the material
 * @apiGroup Comments
 *
 * @apiHeader {String} authorization Bearer token.
 *
 * @apiSuccess {String} id id of the Comment.
 * @apiSuccess {String} ownerId id of the User who commented.
 * @apiSuccess {String} ownerName name of commenter.
 * @apiSuccess {String} message content of the comment.
 * @apiSuccess {Boolean} isCommentCorrect status of the Comment.
 * @apiSuccess {String} listReply list id of Reply Comment for the Comment.
 *
 * @apiSampleRequest off
 */

router.get('/:commentId', [
  auth,
  material.checkClassExist,
  material.checkMaterialInclude,
  comment.checkMaterialExist,
  comment.checkCommentInclude,
  comment.findOne,
]);

/**
 * @api {put} /api/classrooms/:classroomId/materials/:materialId/comments/:commentId Update a comment in a material
 * @apiGroup Comments
 *
 * @apiHeader {String} authorization Bearer token.
 *
 * @apiParam {String} [ownerId] id of the User who commented.
 * @apiParam {String} [ownerName] name of commenter.
 * @apiParam {String} [message] content of the comment.
 * @apiParam {Boolean} [isCommentCorrect] status of the Comment.
 * @apiParam {String} [listReply] list id of Reply Comment for the Comment.
 *
 * @apiSampleRequest off
 */

router.put('/:commentId', [
  auth,
  material.checkClassExist,
  material.checkMaterialInclude,
  comment.checkMaterialExist,
  comment.checkCommentInclude,
  comment.update,
]);

/**
 * @api {delete} /api/classrooms/:classroomId/materials/:materialId/comments/:commentId Delete a comment in the material
 * @apiGroup Comments
 *
 * @apiHeader {String} authorization Bearer token.
 *
 * @apiSampleRequest off
 */

router.delete('/:commentId', [
  auth,
  material.checkClassExist,
  material.checkMaterialInclude,
  comment.checkMaterialExist,
  comment.checkCommentInclude,
  comment.deleteOne,
]);

/**
 * @api {delete} /api/classrooms/:classroomId/materials/:materialId/comments/ Delete all comments in the material
 * @apiGroup Comments
 *
 * @apiHeader {String} authorization Bearer token.
 *
 * @apiSampleRequest off
 */

router.delete('/', [
  auth,
  material.checkClassExist,
  material.checkMaterialInclude,
  comment.checkMaterialExist,
  comment.deleteAll,
]);

export default router;
