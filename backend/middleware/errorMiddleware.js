// 404 Not Found Handler
const notFound = (req, res, next) => {
  const error = new Error(`Resource Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Global Error Handler
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  // Handle Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return res.status(404).json({
      success: false,
      message: 'Product not found with the requested identifier',
    });
  }

  // Handle Mongoose Duplicate Key Error
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: 'A product with this unique field already exists',
    });
  }

  // Handle Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const errors = {};
    Object.keys(err.errors).forEach((key) => {
      errors[key] = err.errors[key].message;
    });
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors,
    });
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Server Internal Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { notFound, errorHandler };
