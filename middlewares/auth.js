const jwt = require('jsonwebtoken');
const NotAuthenticated = require('../errors/NotAuthenticated');

module.exports = (req, res, next) => {
  let payload;
  try {
    const token = req.headers.authorization;

    if (!token) {
      throw new NotAuthenticated('Authorization required');
    }

    const validTocken = token.replace('Bearer ', '');

    payload = jwt.verify(validTocken, 'jwt-secret-key');
  } catch (e) {
    if (e.name === 'JsonWebTokenError') {
      next(new NotAuthenticated('Problems with the token'));
    }
  }
  req.user = payload;
  next();
};
