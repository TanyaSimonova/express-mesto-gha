const jwt = require('jsonwebtoken');
const NotAuthenticated = require('../errors/NotAuthenticated');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  let payload;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new NotAuthenticated('Authorization required');
  }
  const token = authorization.replace('Bearer ', '');
  try {
    // попытаемся верифицировать токен
    payload = jwt.verify(token, 'jwt-secret-key');
  } catch (e) {
    if (e.name === 'JsonWebTokenError') {
      next(new NotAuthenticated('Problems with the token'));
    }
  }
  req.user = payload;
  next();
};

/*
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
*/