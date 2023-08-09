const asyncWrapper = require('../../middleware/asyncWrapper');
const ErrorResponse = require('../../utils/ErrorResponse');
const validateByHeader = require('../../utils/validateByHeader');
const jwt = require('jsonwebtoken');

// @desc      Verify token
// @route     POST /api/auth/verify
// @access    Public
const validate = asyncWrapper(async (req, res, next) => {
  if (process.env.REVERSE_PROXY_AUTH_HEADER && validateByHeader(req)) {
    res.status(200).json({
      success: true,
    });
  } else try {
    jwt.verify(req.body.token, process.env.SECRET);

    res.status(200).json({
      success: true,
      data: { token: { isValid: true } },
    });
  } catch (err) {
    return next(new ErrorResponse('Token expired', 401));
  }
});

module.exports = validate;
