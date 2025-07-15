const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Default error
  let error = {
    message: err.message || 'Internal Server Error',
    status: err.status || 500,
    code: err.code || 'INTERNAL_ERROR'
  };

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    error = {
      message: 'Validation Error',
      status: 400,
      code: 'VALIDATION_ERROR',
      details: Object.values(err.errors).map(e => e.message)
    };
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    error = {
      message: 'Duplicate field value',
      status: 400,
      code: 'DUPLICATE_ERROR',
      field: Object.keys(err.keyValue)[0]
    };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = {
      message: 'Invalid token',
      status: 401,
      code: 'JWT_INVALID'
    };
  }

  if (err.name === 'TokenExpiredError') {
    error = {
      message: 'Token expired',
      status: 401,
      code: 'JWT_EXPIRED'
    };
  }

  // File upload errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    error = {
      message: 'File too large',
      status: 400,
      code: 'FILE_TOO_LARGE',
      maxSize: '50MB'
    };
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    error = {
      message: 'Unexpected file field',
      status: 400,
      code: 'UNEXPECTED_FILE'
    };
  }

  // Rate limiting errors
  if (err.status === 429) {
    error = {
      message: 'Too many requests',
      status: 429,
      code: 'RATE_LIMIT_EXCEEDED',
      retryAfter: err.headers?.['retry-after'] || 60
    };
  }

  // AI service errors
  if (err.code === 'AI_SERVICE_ERROR') {
    error = {
      message: 'AI service temporarily unavailable',
      status: 503,
      code: 'AI_SERVICE_ERROR',
      retryAfter: 30
    };
  }

  // Database connection errors
  if (err.name === 'MongoNetworkError') {
    error = {
      message: 'Database connection error',
      status: 503,
      code: 'DB_CONNECTION_ERROR'
    };
  }

  // Send error response
  res.status(error.status).json({
    error: error.message,
    code: error.code,
    ...(error.details && { details: error.details }),
    ...(error.field && { field: error.field }),
    ...(error.retryAfter && { retryAfter: error.retryAfter }),
    ...(error.maxSize && { maxSize: error.maxSize }),
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method
  });
};

// Async error wrapper
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Not found handler
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.status = 404;
  error.code = 'NOT_FOUND';
  next(error);
};

module.exports = {
  errorHandler,
  asyncHandler,
  notFound
};