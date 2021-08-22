import * as material from '../app/http/controllers/material.controller.js';
import auth from '../app/http/middleware/auth.js';
import upload from '../services/multer.js';
import { Router } from 'express';
const router = Router({ mergeParams: true });

/**
 * @api {material} /api/classrooms Create a new material
 * @apiName Create a new material in the class
 * @apiGroup Posts
 *
 * @apiHeader {String} authorization Bearer token.
 *
 * @apiParam {String} ownerId id of the User.
 * @apiParam {String} ownerName name of the User.
 * @apiParam {String} title title of the Posts.
 * @apiParam {String} content content of the Posts.
 * @apiParam {Array} listComment list id of comments in the Post.
 * @apiParam {File} [fileAttachment] file/documentation of the Post.
 *
 * @apiSampleRequest off
 */

router.post('/', [
  auth,
  material.checkClassExist,
  upload.array('fileAttachment'),
  material.create,
]);

/**
 * @api {get} /api/classrooms/:classroomId/posts Get all posts in a class
 * @apiName Get all posts in a class
 * @apiGroup Posts
 *
 * @apiHeader {String} authorization Bearer token.
 *
 * @apiSuccess {String} id id of the Post.
 * @apiSuccess {String} ownerId id of the User.
 * @apiSuccess {String} ownerName name of the User.
 * @apiSuccess {String} title title of the Posts.
 * @apiSuccess {String} content content of the Posts.
 * @apiSuccess {Array} listComment list id of comments in the Post.
 * @apiSuccess {Array} fileAttachment link file/documentation of the Post.
 *
 * @apiSampleRequest off
 */

router.get('/', [auth, material.checkClassExist, material.findAll]);

/**
 * @api {get} /api/classrooms/:classroomId/posts/:materialId Get one material in a class
 * @apiName Get one material in a class
 * @apiGroup Posts
 *
 * @apiHeader {String} authorization Bearer token.
 *
 * @apiSuccess {String} id id of the Post.
 * @apiSuccess {String} ownerId id of the User.
 * @apiSuccess {String} ownerName name of the User.
 * @apiSuccess {String} title title of the Posts.
 * @apiSuccess {String} content content of the Posts.
 * @apiSuccess {Array} listComment list id of comments in the Post.
 * @apiSuccess {Array} fileAttachment link file/documentation of the Post.
 *
 * @apiSampleRequest off
 */

router.get('/:materialId', [
  auth,
  material.checkClassExist,
  material.checkMaterialInclude,
  material.findOne,
]);

/**
 * @api {put} /api/classrooms/:classroomId/posts/:materialId Update one material in a class
 * @apiName Update one material in a class
 * @apiGroup Posts
 *
 * @apiHeader {String} authorization Bearer token.
 *
 * @apiParam {String} [ownerId] id of the User.
 * @apiParam {String} [ownerName] name of the User.
 * @apiParam {String} [title] title of the Posts.
 * @apiParam {String} [content] content of the Posts.
 * @apiParam {Array} [listComment] list id of comments in the Post.
 * @apiParam {File} [fileAttachment] file/documentation of the Post.
 *
 * @apiSampleRequest off
 */

router.put('/:materialId', auth, upload.array('fileAttachment'), [
  material.checkClassExist,
  material.checkMaterialInclude,
  material.update,
]);

/**
 * @api {delete} /api/classrooms/:classroomId/posts/:materialId Delete one material in a class
 * @apiName Delete one material in a class
 * @apiGroup Posts
 *
 * @apiHeader {String} authorization Bearer token.
 *
 * @apiSampleRequest off
 */

router.delete('/:materialId', auth, [
  material.checkClassExist,
  material.checkMaterialInclude,
  material.deleteOne,
]);

/**
 * @api {delete} /api/classrooms/:classroomId/posts Delete all posts in a class
 * @apiName Delete all posts in a class
 * @apiGroup Posts
 *
 * @apiHeader {String} authorization Bearer token.
 *
 * @apiSampleRequest off
 */

router.delete('/', auth, [material.checkClassExist, material.deleteAll]);

export default router;
