import ApiError from '../utils/ApiError.js';

const handleCastError = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new ApiError(400, message);
};

const handleDuplicateFields = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const message = `${field} already exists. Please use another value.`;
  return new ApiError(400, message, { field });
};

const handleValidationError = (err) => {
  const details = Object.values(err.errors).map((el) => ({
    field: el.path,
    message: el.message
  }));
  return new ApiError(400, 'Validation failed', details);
};

const errorHandler = (err, req, res, next) => {
  let error = { ...err, message: err.message };

  // MongoDB Cast Error
  if (err.name === 'CastError') {
    error = handleCastError(err);
  }

  // MongoDB Duplicate Key Error
  if (err.code === 11000) {
    error = handleDuplicateFields(err);
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    error = handleValidationError(err);
  }

  const statusCode = error.statusCode || 500;
  const response = {
    success: false,
    message: error.message || 'Internal Server Error',
    ...(error.details && { details: error.details }),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  };

  res.status(statusCode).json(response);
};

export default errorHandler;