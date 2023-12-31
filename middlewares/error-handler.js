const errorHandler = (err, req, res, next) => {
  next();
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'Server error'
        : message,
    });
};

module.exports = errorHandler;
