import env from 'dotenv';
env.config();
import connect from './config/database.js';
connect();
import './services/passport.js';
import createError from 'http-errors';
import express from 'express';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import HTTPStatus from 'http-status';
import expressroute from 'express-list-routes';

import notFound from './routes/notFound.route.js';
import usersRouter from './routes/users.route.js';
import indexRouter from './routes/index.js';
import authRouter from './routes/auth.js';
import logRouter from './routes/log.route.js';
import lessonRouter from './routes/lesson.route.js';
import FAQRouter from './routes/FAQ.route.js';
import FAQAnswerRouter from './routes/FAQAnswer.route.js';
import classroomRouter from './routes/classroom.route.js';
import postRouter from './routes/post.route.js';
import materialRouter from './routes/material.route.js';
import commentRouter from './routes/comment.route.js';
import replyCommentRoute from './routes/replycomment.route.js';
import materialCommentRouter from './routes/materialComment.route.js';
import materialReplyCommentRoute from './routes/materialReplyComment.route.js';
import myClassRouter from './routes/myclasses.route.js';
import flashCardRouter from './routes/flashcard.route.js';
import listEndpoints from 'express-list-endpoints';
import notifyRouter from './routes/notifications.route.js';
import _ from 'lodash';
// import all_routes from 'express-list-endpoints';
const __dirname = path.resolve();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// // Declare Routers

app.use('/docs', express.static(path.join(__dirname, 'docs')));
app.use('/', indexRouter);
app.use('/api', indexRouter);
app.use('/api/notifications', notifyRouter);
app.use('/auth', authRouter);
app.use('/api/user', usersRouter);
app.use('/api/classrooms', classroomRouter);
classroomRouter.use('/:classroomId/materials', materialRouter);
materialRouter.use('/:materialId/comments', materialCommentRouter);
materialCommentRouter.use(
  '/:commentId/replycomments',
  materialReplyCommentRoute
);
classroomRouter.use('/:classroomId/posts', postRouter);
postRouter.use('/:postId/comments', commentRouter);
commentRouter.use('/:commentId/replycomments', replyCommentRoute);

app.use('/api/class', myClassRouter);
myClassRouter.use('/:classId/lessons', lessonRouter);
lessonRouter.use('/:lessonId/flashcards', flashCardRouter);
app.use('/api/faqs', FAQRouter);
FAQRouter.use('/:faqId/faqAnswers', FAQAnswerRouter);
app.use('*', notFound);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(HTTPStatus.NOT_FOUND));
});

// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || HTTPStatus.INTERNAL_SERVER_ERROR);
  res.render('error');
});

console.log(listEndpoints(app));
export default app;
