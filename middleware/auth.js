const validateByHeader = require('../utils/validateByHeader');
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  let tokenIsValid = false;

  if (process.env.REVERSE_PROXY_AUTH_HEADER) {
    tokenIsValid = validateByHeader(req);
  }

  const authHeader = req.header('Authorization-Flame');
  let token;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (token) {
    try {
      jwt.verify(token, process.env.SECRET);
    } finally {
      tokenIsValid = true;
    }
  }

  req.isAuthenticated = tokenIsValid;

  next();
};

module.exports = auth;
