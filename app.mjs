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
import usersRouter from './routes/users.js';
import postsRouter from './routes/post.route.js';
import indexRouter from './routes/index.js';
import authRouter from './routes/auth.js';
import FAQRouter from './routes/FAQ.route.js';
import FAQAnswerRouter from './routes/FAQ.route.js';

import logRouter from './routes/log.route.js';
import lessonRouter from './routes/lesson.route.js';
import expressroute from 'express-list-routes';
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

// Declare Routers

app.use('/docs', express.static(path.join(__dirname, 'docs')));
app.use('/', indexRouter);
app.use('/api', indexRouter);
app.use('/auth', authRouter);

app.use('/api/users', usersRouter);
app.use('/api/posts', postsRouter);
app.use('/api/FAQS', FAQRouter);
app.use('/api/FAQs/answers', FAQAnswerRouter);

app.use('/api/lesson', lessonRouter);
app.use('/api/flashcards', logRouter);
app.use('/auth', authRouter);
app.use('*', (req, res) => {
  res.status(HTTPStatus.NOT_FOUND).json({
    success: 'false',
    message: 'Page not found',
    error: {
      statusCode: HTTPStatus.NOT_FOUND,
      message: 'You reached a route that is not defined on this server',
    },
  });
});

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
expressroute(app);
console.log();
export default app;
