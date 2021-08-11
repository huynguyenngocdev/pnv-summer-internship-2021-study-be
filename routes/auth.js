import env from 'dotenv';
env.config();

import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import HTTPStatus from 'http-status';
import passport from '../services/passport.js';
import cookieSession from 'cookie-session';
import User from '../app/models/user.model.js';
import TOKEN_KEY from '../config/config.js';
const router = Router();
router.use(
  cookieSession({
    name: 'project',
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: ['key1', 'key2'],
  })
);

/**
 * @api {post} /auth/login Login and get an access token
 * @apiName Login
 * @apiGroup Auth
 *
 * @apiSuccess {String} _id id of the User.
 * @apiSuccess {String} name name of the User.
 * @apiSuccess {String} avatar url avatar of the User.
 * @apiSuccess {boolean} block status account of the User.
 * @apiSuccess {Array} listClassJoin list classes are joining of the User.
 * @apiSuccess {String} listClassOwn list classes was created by the User.
 * @apiSuccess {String} googleId google id of the User(it was hashed).
 * @apiSuccess {String} email email of the User.
 * @apiSuccess {String} token token bearer to access routers of the User.
 *
 * @apiSuccessExample {json} Success-Response:
 * {
 *  "name": "Ngoc Huy Nguyen",
 *  "avatar": "https://lh3.googleusercontent.com/a-/AOh14GjpPz9OFwMWkz1d8iab4U8slFDkSs-eEHPcf3GcJw=s96-c",
 *  "block": false,
 *  "listClassJoin": [
 *
 *  ],
 *  "listClassOwn": [
 *
 *  ],
 *  "_id": "61097fe5303a09c4a5bfe779",
 *  "googleId": "$2a$10$trmDjzGjJpJnoqj31TlBWeaRMwpRufz9GSLiM/3VTN0vwPU68TrpK",
 *  "email": "huy.nguyen22@student.passerellesnumeriques.org",
 *  "__v": 0,
 *  "token": "eyJhbGciOiJIUzM4NCIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjEwOTdmZTUzMDNhMDljNGE1YmZlNzc5IiwiZW1haWwiOiJodXkubmd1eWVuMjJAc3R1ZGVudC5wYXNzZXJlbGxlc251bWVyaXF1ZXMub3JnIiwiaWF0IjoxNjI4MTg3MTYwLCJleHAiOjE2MjgxOTQzNjB9.MIIksQe-tnCoYcYuk6M-SIxG2iuHrs9DVHPK-5n6o1A7myBE-9mF3NZtyey8Ojgs"
 * }
 * @apiParam {String} googleId Google id of the User(it was not hashed).
 * @apiParam {String} name Full name of the User.
 * @apiParam {String} email Email of the User.
 * @apiParam {String} avatar Url avatar of the User.
 *
 * @apiParamExample {json} Request-Example:
 * {
 *  "name": "Nguyen Van A",
 *  "email": "exmaple@gmail.com"
 *  "avatar": "http://imgbb.com/asdfbg238",
 *  "googleId": "1234567abcd"
 * }
 */

router.post('/login', async (req, res) => {
  try {
    const { googleId, email, name, avatar } = req.body;

    if (!(googleId && email && name && avatar)) {
      return res.status(HTTPStatus.BAD_REQUEST).send({
        message:
          'All input is required. Please input goggleId, name, email, avatar',
      });
    }

    // Validate if user exist in our database
    const oldUser = await User.findOne({ email });

    if (oldUser && (await bcrypt.compare(googleId, oldUser.googleId))) {
      const token = jwt.sign(
        { user_id: oldUser._id, email },
        process.env.TOKEN_KEY,
        {
          algorithm: 'HS384',
          expiresIn: '2h',
        }
      );

      oldUser.token = token;

      return res.status(HTTPStatus.OK).json(oldUser);
    } else {
      const encryptedGoogleId = await bcrypt.hash(googleId, 10);

      const user = await User.create({
        googleId: encryptedGoogleId,
        name,
        email: email.toLowerCase(), // sanitize: convert email to lowercase
        avatar,
      });

      const token = jwt.sign({ user_id: user._id, email }, TOKEN_KEY, {
        algorithm: 'HS384',
        expiresIn: '2h',
      });

      user.token = token;

      return res.status(HTTPStatus.CREATED).json(user);
    }
  } catch (err) {
    console.log(err);
  }
});

router.use(passport.initialize());
router.use(passport.session());

/**
 * @api {get} /auth/google/login Test login with Google
 * @apiName Test login with Google
 * @apiGroup Test
 *
 * @apiSuccess {String} _id id of the User.
 * @apiSuccess {String} name name of the User.
 * @apiSuccess {String} avatar url avatar of the User.
 * @apiSuccess {boolean} block status account of the User.
 * @apiSuccess {Array} listClassJoin list classes are joining of the User.
 * @apiSuccess {String} listClassOwn list classes was created by the User.
 * @apiSuccess {String} googleId google id of the User(it was hashed).
 * @apiSuccess {String} email email of the User.
 * @apiSuccess {String} token token bearer to access routers of the User.
 *
 * @apiSuccessExample {json} Success-Response:
 * {
 *  "name": "Ngoc Huy Nguyen",
 *  "avatar": "https://lh3.googleusercontent.com/a-/AOh14GjpPz9OFwMWkz1d8iab4U8slFDkSs-eEHPcf3GcJw=s96-c",
 *  "block": false,
 *  "listClassJoin": [
 *
 *  ],
 *  "listClassOwn": [
 *
 *  ],
 *  "_id": "61097fe5303a09c4a5bfe779",
 *  "googleId": "$2a$10$trmDjzGjJpJnoqj31TlBWeaRMwpRufz9GSLiM/3VTN0vwPU68TrpK",
 *  "email": "huy.nguyen22@student.passerellesnumeriques.org",
 *  "__v": 0,
 *  "token": "eyJhbGciOiJIUzM4NCIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjEwOTdmZTUzMDNhMDljNGE1YmZlNzc5IiwiZW1haWwiOiJodXkubmd1eWVuMjJAc3R1ZGVudC5wYXNzZXJlbGxlc251bWVyaXF1ZXMub3JnIiwiaWF0IjoxNjI4MTg3MTYwLCJleHAiOjE2MjgxOTQzNjB9.MIIksQe-tnCoYcYuk6M-SIxG2iuHrs9DVHPK-5n6o1A7myBE-9mF3NZtyey8Ojgs"
 * }
 */

const isLoggedIn = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    return res.status(HTTPStatus.UNAUTHORIZED).redirect('/auth/google/login');
  }
};

router.get('/google/failed', (req, res) =>
  res
    .status(HTTPStatus.UNAUTHORIZED)
    .json({ message: 'Login with Google is failed!' })
);

router.get(
  '/google/login',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: 'failed',
  }),
  (req, res) => res.redirect('/auth/get_access_token')
);

// reuturn access token
router.get('/get_access_token', isLoggedIn, async (req, res) => {
  try {
    const { email, googleId } = req.user;

    if (!(email && googleId)) {
      return res
        .status(HTTPStatus.UNAUTHORIZED)
        .send('ERROR! Please login again.');
    }
    // Validate if user exist in our database
    const user = await User.findOne({ email, googleId });

    if (user) {
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          algorithm: 'HS384',
          expiresIn: '2h',
        }
      );

      user.token = token;
      req.session = null;
      req.logout();
      return res.status(HTTPStatus.OK).json(user);
    }
    req.session = null;
    req.logout();
    return res.status(HTTPStatus.BAD_REQUEST).send('Invalid Credentials');
  } catch (err) {
    console.log(err);
  }
});

export default router;
