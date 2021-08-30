import * as notification from '../app/http/controllers/notification.controller.js';
import { Router } from 'express';
import auth from '../app/http/middleware/auth.js';

const router = Router();

/**
 * @api {get} /api/notifications
 * @apiGroup Classrooms
 * @apiHeader {String} authorization Bearer token.
 * @apiExample Example usage:
 *    https://pnv-ces-classwork.herokuapp.com/api/notifications
 * @apiSampleRequest off
 */
router.get('/', auth, notification.findAll);

export default router;
