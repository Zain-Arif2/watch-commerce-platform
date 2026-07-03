const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  console.log(err);

  if (err.name === 'CastError') {
    const message = `Resource not found`;
    res.status(404).json({
      success: false,
      message,
    });
    return;
  }

  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    res.status(400).json({
      success: false,
      message,
    });
    return;
  }

  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message);
    res.status(400).json({
      success: false,
      message,
    });
    return;
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error',
  });
};

export default errorHandler;
