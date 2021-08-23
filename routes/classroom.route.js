import * as classroom from '../app/http/controllers/classroom.controller.js';
import { Router } from 'express';
import auth from '../app/http/middleware/auth.js';

const router = Router();

/**
 * @api {get} /api/classrooms/joinClassroom?code=<code-to-join-classroom> Join in a classroom
 * @apiGroup Classrooms
 * @apiHeader {String} authorization Bearer token.
 * @apiExample Example usage:
 *    https://pnv-ces-classwork.herokuapp.com/api/classrooms/joinClassroom?code=abcdef
 * @apiSampleRequest off
 */
router.get('/joinClassroom', auth, classroom.joinClassroom);

/**
 * @api {get} /api/classrooms/:classroomId/leaveClassroom Leave in a classroom
 * @apiGroup Classrooms
 * @apiHeader {String} authorization Bearer token.
 * @apiExample Example usage:
 *    https://pnv-ces-classwork.herokuapp.com/api/classrooms/jhgf7634t153ery7sdfjgbb/leaveClassroom
 * @apiSampleRequest off
 */
router.get('/:classroomId/leaveClassroom', auth, classroom.leaveClassroom);

/**
 * @api {post} /api/classrooms Create a new classroom
 * @apiGroup Classrooms
 *
 * @apiHeader {String} authorization Bearer token.
 *
 * @apiParam {String} className name of the Classroom.
 * @apiParam {String} topic topicof the Classroom.
 * @apiParam {String} code code to invite new member of Classroom
 * @apiParam {Number} [member] quantity of menber in the Classroom.
 * @apiParam {String} ownerId owner's id of the User.
 * @apiParam {String} ownerName owner's name of the User.
 * @apiParam {String} [backgroundImage] link background image of the Classroom.
 *
 * @apiSampleRequest off
 */

router.post('/', auth, classroom.create);

/**
 * @api {get} /api/classrooms Get all classrooms
 * @apiGroup Classrooms
 *
 * @apiHeader {String} authorization Bearer token.
 *
 * @apiSuccess {String} id id of the Classroom.
 * @apiSuccess {String} className name of the Classroom.
 * @apiSuccess {String} topic topicof the Classroom.
 * @apiSuccess {String} code code to invite new member of Classroom
 * @apiSuccess {Number} member quantity of menber in the Classroom.
 * @apiSuccess {String} ownerId owner's id of the User.
 * @apiSuccess {String} ownerName owner's name of the User.
 * @apiSuccess {Array} listUserJoined list the Users joined in Classroom.
 * @apiSuccess {String} backgroundImage link background image of the Classroom.
 * @apiSuccess {Array} listQuestions list id of questions in the Classroom
 * @apiSampleRequest off
 */

router.get('/', auth, classroom.findAll);

/**
 * @api {get} /api/classrooms/:classroomId Get one classroom
 * @apiGroup Classrooms
 * @apiHeader {String} authorization Bearer token.
 *
 * @apiSuccess {String} id id of the Classroom.
 * @apiSuccess {String} className name of the Classroom.
 * @apiSuccess {String} topic topicof the Classroom.
 * @apiSuccess {String} code code to invite new member of Classroom
 * @apiSuccess {Number} member quantity of menber in the Classroom.
 * @apiSuccess {String} ownerId owner's id of the User.
 * @apiSuccess {String} ownerName owner's name of the User.
 * @apiSuccess {Array} listUserJoined list the Users joined in Classroom.
 * @apiSuccess {String} backgroundImage link background image of the Classroom.
 * @apiSuccess {Array} listQuestions list id of questions in the Classroom
 * @apiSampleRequest off
 */

router.get('/:classroomId', auth, classroom.findOne);

/**
 * @api {put} /api/classrooms/:classroomId Update the classroom
 * @apiName Update the classroom
 * @apiGroup Classrooms
 * @apiHeader {String} authorization Bearer token.
 *
 * @apiParam {String} [className] name of the Classroom.
 * @apiParam {String} [topic] topicof the Classroom.
 * @apiParam {String} [code] code to invite new member of Classroom
 * @apiParam {Number} [member] quantity of menber in the Classroom.
 * @apiParam {String} [ownerId] owner's id of the User.
 * @apiParam {String} [ownerName] owner's name of the User.
 * @apiParam {Array} [listUserJoined] list the Users joined in Classroom.
 * @apiParam {String} [backgroundImage] link background image of the Classroom.
 * @apiParam {Array} [listQuestions] list id of questions in the Classroom
 * @apiSampleRequest off
 */

router.put('/:classroomId', auth, classroom.update);

/**
 * @api {delete} /api/classrooms/:classroomId Delete one classroom
 * @apiName Delete one classroom
 * @apiGroup Classrooms
 * @apiHeader {String} authorization Bearer token.
 * @apiSampleRequest off
 */

router.delete('/:classroomId', auth, classroom.deleteOne);

/**
 * @api {delete} /api/classrooms Delete all classrooms
 * @apiName Delete all classrooms
 * @apiGroup Classrooms
 * @apiHeader {String} authorization Bearer token.
 * @apiSampleRequest off
 */
router.delete('/', auth, classroom.deleteAll);

export default router;