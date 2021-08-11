import { Router } from 'express';
import auth from '../app/http/middleware/auth.js';
import * as users from '../app/http/controllers/user.controller.js';
const router = Router();

/**
 *
 * @api {get} /api/users/:id Get one user
 * @apiName Get one user
 * @apiGroup Users
 *
 * @apiHeader (200) {String} authorization Bearer token to accecc
 * @apiSuccessExample {json} Success-Response:
 *{
    "name": "Ngoc Huy Nguyen",
    "avatar": "https://lh3.googleusercontent.com/a-/AOh14GjpPz9OFwMWkz1d8iab4U8slFDkSs-eEHPcf3GcJw=s96-c",
    "block": false,
    "listClassJoin": [],
    "listClassOwn": [],
    "folderFlashCard": null,
    "googleId": "$2a$10$s4M363fpOE9CwAs/hm7sMerXwYqyxIK275l1ynMMp98mlTqjXYWim",
    "email": "huy.nguyen22@student.passerellesnumeriques.org",
    "createdAt": "2021-08-15T11:34:30.453Z",
    "updatedAt": "2021-08-15T11:34:30.453Z",
    "id": "6118fbc62e959e001f0eca6d"
 *}
 */

router.get('/:userId', auth, users.findOne);

export default router;
