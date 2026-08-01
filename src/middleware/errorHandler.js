const errorHandler = (err, req, res, next) => {
  console.error('Global Error:', err);

  if (err.code === '23505') {
    return res.status(409).json({
      success: false,
      message: 'Conflict: The record already exists (Duplicate value).',
      data: {}
    });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: err.message,
      data: {}
    });
  }

  res.status(500).json({
    success: false,
    message: 'Internal server error.',
    data: {}
  });
};

module.exports = errorHandler;
