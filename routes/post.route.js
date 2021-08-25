import * as post from '../app/http/controllers/post.controller.js';
import auth from '../app/http/middleware/auth.js';
import upload from '../services/multer.js';
import { Router } from 'express';
const router = Router({ mergeParams: true });

/**
 * @api {post} /api/classrooms Create a new post
 * @apiName Create a new post in the class
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
  post.checkClassExist,
  upload.array('fileAttachment'),
  post.create,
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

router.get('/', [auth, post.checkClassExist, post.findAll]);

/**
 * @api {get} /api/classrooms/:classroomId/posts/:postId Get one post in a class
 * @apiName Get one post in a class
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

router.get('/:postId', [
  auth,
  post.checkClassExist,
  post.checkPostInclude,
  post.findOne,
]);

/**
 * @api {put} /api/classrooms/:classroomId/posts/:postId Update one post in a class
 * @apiName Update one post in a class
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

router.put('/:postId', [
  auth,
  upload.array('fileAttachment'),
  post.checkClassExist,
  post.checkPostInclude,
  post.update,
]);

/**
 * @api {delete} /api/classrooms/:classroomId/posts/:postId Delete one post in a class
 * @apiName Delete one post in a class
 * @apiGroup Posts
 *
 * @apiHeader {String} authorization Bearer token.
 *
 * @apiSampleRequest off
 */

router.delete('/:postId', [
  auth,
  post.checkClassExist,
  post.checkPostInclude,
  post.deleteOne,
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

router.delete('/', auth, [post.checkClassExist, post.deleteAll]);

export default router;
