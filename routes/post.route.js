import * as post from '../app/http/controllers/post.controller.js';
import auth from '../app/http/middleware/auth.js';
import { Router } from 'express';
const router = Router();

/**s
 * @api {post} /api/posts Create a new post
 * @apiName Create a new post in the class
 * @apiGroup Posts
 *
 * @apiHeader {String} authorization Bearer token.
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer ya29.a0ARrdaM89EB125ISOtb01lLmFfYWhANwNgDahRS3Du
 *                         GjUl8y_O1KxWi674OJT7b2C-eVau5CuoSjLFQADOyMzLg140lt3BCv6vIeho1S
 *                         cc6pXCZzPh0hsTYNKVzUt1_RJqNBpHOzn74ShcAY_IlyqC989ediR"
 *     }
 *
 * @apiSuccess {String} owner id of the User.
 * @apiSuccess {String} title title of the Posts.
 * @apiSuccess {String} content content of the Posts.
 * @apiSuccess {Array} listComment list id of comments in the Post
 *
 * @apiSuccessExample {json} Success-Response:
 * {
 *  "owner": "Nguyen Ngoc Huy",
 *  "title": "Demo tieu de"
 *  "content": "demo",
 *  "listComment": "[]"
 * }
 * @apiParam {String} owner id of the User.
 * @apiParam {String} title title of the Posts.
 * @apiParam {String} content content of the Posts.
 * @apiParam {Array} listComment list id of comments in the Post
 *
 * @apiParamExample {json} Request-Example:
 * {
 *  "owner": "Nguyen Ngoc Huy",
 *  "title": "Demo tieu de"
 *  "content": "demo",
 *  "listComment": "[]"
 * }
 */

router.post('/', auth, post.create);

/**
 * @api {get} /api/posts Get all posts
 * @apiName Get all posts in the class
 * @apiGroup Posts
 *
 * @apiHeader {String} authorization Bearer token.
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer ya29.a0ARrdaM89EB125ISOtb01lLmFfYWhANwNgDahRS3Du
 *                         GjUl8y_O1KxWi674OJT7b2C-eVau5CuoSjLFQADOyMzLg140lt3BCv6vIeho1S
 *                         cc6pXCZzPh0hsTYNKVzUt1_RJqNBpHOzn74ShcAY_IlyqC989ediR"
 *     }
 *
 * @apiSuccess {String} owner id of the User.
 * @apiSuccess {String} title title of the Posts.
 * @apiSuccess {String} content content of the Posts.
 * @apiSuccess {Array} listComment list id of comments in the Post
 *
 * @apiSuccessExample {json} Success-Response:
 * {
 *  "owner": "Nguyen Ngoc Huy",
 *  "title": "Demo tieu de"
 *  "content": "demo",
 *  "listComment": "[]"
 * }
 *
 */

router.get('/', auth, post.findAll);

router.get('/:id', auth, post.findOne);

router.put('/:id', auth, post.update);

router.delete('/:id', auth, post.deleteOne);

router.delete('/', auth, post.deleteAll);

export default router;
