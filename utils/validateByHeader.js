const validateByHeader = (req) => {
  // auth by reverse proxy header
  const authHeader = req.header('FlameReverseProxyAuth');
  return Boolean(
    authHeader
    && process.env.REVERSE_PROXY_AUTH_HEADER
    && authHeader === process.env.REVERSE_PROXY_AUTH_HEADER,
  );
};

module.exports = validateByHeader;