import HTTPStatus from 'http-status';
import { Router } from 'express';
const router = Router();

router.use('/', (req, res) => {
  res.status(HTTPStatus.NOT_FOUND).json({
    success: 'false',
    message: 'Page not found',
    error: {
      statusCode: HTTPStatus.NOT_FOUND,
      message: 'You reached a route that is not defined on this server',
    },
  });
});

export default router;
