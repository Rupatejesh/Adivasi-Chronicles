// Express identifies error handlers by their four arguments.
export default function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ success: false, message: 'Invalid JSON request body' });
  }

  if (err.name === 'ValidationError') {
    const details = Object.values(err.errors || {}).map((item) => item.message);
    return res.status(400).json({
      success: false,
      message: details[0] || 'Validation failed',
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ success: false, message: 'Invalid resource identifier' });
  }

  if (err.code === 11000) {
    const fields = Object.keys(err.keyPattern || {});
    const label = fields.length ? fields.join(', ') : 'value';
    return res.status(409).json({
      success: false,
      message: `A record with this ${label} already exists`,
    });
  }

  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, message: 'Invalid or expired authentication token' });
  }

  const candidate = err.status ?? err.statusCode;
  const status = Number.isInteger(candidate) && candidate >= 400 && candidate <= 599
    ? candidate
    : 500;

  // Do not return stacks, request bodies or internal exception messages.
  let message = 'Internal server error';
  if (status < 500) {
    message = err.expose && err.message ? err.message : 'Invalid request';
  }

  return res.status(status).json({ success: false, message });
}
