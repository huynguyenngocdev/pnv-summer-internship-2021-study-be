import HTTPStatus from 'http-status';
import jwt from 'jsonwebtoken';

import TOKEN_KEY from '../../../config/config.js';

const verifyToken = (req, res, next) => {
  const {
    headers: { authorization },
  } = req;
  const token = authorization && authorization.split(' ').pop();

  if (!token) {
    return res
      .status(HTTPStatus.UNAUTHORIZED)
      .json({ message: 'A token is required for authentication' });
  }
  try {
    const decoded = jwt.verify(token, TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    return res
      .status(HTTPStatus.UNAUTHORIZED)
      .json({ message: 'Invalid Token' });
  }
  return next();
};
export default verifyToken;
