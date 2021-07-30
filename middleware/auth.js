const HTTPStatus = require("http-status");
const jwt = require("jsonwebtoken");

const { TOKEN_KEY } = process.env;

const verifyToken = (req, res, next) => {
  const {
    headers: { authorization },
  } = req;
  const token = authorization && authorization.split(" ").pop();

  if (!token) {
    return res
      .status(HTTPStatus.UNAUTHORIZED)
      .json({ message: "A token is required for authentication" });
  }
  try {
    const decoded = jwt.verify(token, TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    return res
      .status(HTTPStatus.UNAUTHORIZED)
      .json({ message: "Invalid Token" });
  }
  return next();
};

module.exports = verifyToken;
