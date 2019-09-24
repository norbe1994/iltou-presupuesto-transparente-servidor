const AppError = require('./../utils/appError')

const handleCastErrorDB = ({ path, value }) => {
  const message = `invalid ${path}: ${value}`
  return new AppError(message, 400)
}

const handleDuplicateFieldsDB = ({ errmsg }) => {
  const [duplicateField] = errmsg.match(/(["'])(\\?.)*?\1/)
  const message = `duplicate field value: ${duplicateField}. please use another value`

  return new AppError(message, 400)
}

const handleValidationErrorDB = ({ errors }) => {
  const errorMessages = Object.values(errors).map(({ message }) => message)
  const message = `validation error: ${errorMessages.join(' | ')}`

  return new AppError(message, 400)
}

const handleJwtError = () => new AppError('invalid token', 401)

const handleJwtExpiredError = () => new AppError('expired token', 401)

const sendErrorDev = (error, res) => {
  const { statusCode, status, message, stack } = error
  res.status(statusCode).json({
    error,
    status,
    message,
    stack,
  })
}

const sendErrorProd = (error, res) => {
  const { statusCode, status, message, isOperational } = error

  if (isOperational) {
    res.status(statusCode).json({
      status,
      message,
    })
  } else {
    console.error(`💥ERROR💥: ${error}`)

    res.status(500).json({
      status: 'error',
      message: 'something went wrong!',
    })
  }
}

module.exports = (error, _, res, __) => {
  error.statusCode = error.statusCode || 500
  error.status = error.status || 'error'

  const { NODE_ENV } = process.env

  if (NODE_ENV === 'development') sendErrorDev(error, res)
  else if (NODE_ENV === 'production') {
    let errorCopy = Object.create(error)

    const { name, code } = errorCopy

    if (code === 11000) errorCopy = handleDuplicateFieldsDB(errorCopy)
    if (name === 'CastError') errorCopy = handleCastErrorDB(errorCopy)
    if (name === 'ValidationError') errorCopy = handleValidationErrorDB(errorCopy)
    if (name === 'JsonWebTokenError') errorCopy = handleJwtError()
    if (name === 'TokenExpiredError') errorCopy = handleJwtExpiredError()

    sendErrorProd(errorCopy, res)
  }
}
