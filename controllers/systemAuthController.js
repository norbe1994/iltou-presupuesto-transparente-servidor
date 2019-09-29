const { promisify } = require('util')
const jwt = require('jsonwebtoken')
const SystemUser = require('../models/systemUserModel')
const User = require('../models/userModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const returnSafeUser = require('../utils/returnSafeUser')

const signToken = id => {
  const { JWT_SECRET, JWT_EXPIRES_IN } = process.env

  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  })
}

const createAndSendToken = (user, statusCode, res) => {
  const token = signToken(user.id)
  const cookieConfig = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 1),
    httpOnly: true,
  }

  if (process.env.NODE_ENV === 'production') cookieConfig.secure = true

  res.cookie('jwt', token, cookieConfig)

  res.status(statusCode).json({
    status: 'success',
    token,
    data: { user: returnSafeUser(user) },
  })
}

exports.login = catchAsync(async ({ body: { email, password } }, res, next) => {
  if (!email || !password) return next(new AppError('please provide an email and password', 400))

  const user = await SystemUser.findOne({ email }).select('+password')

  if (!user || !(await user.validatePassword(password, user.password)))
    return next(new AppError('incorrect email or password'), 401)

  createAndSendToken(user, 200, res)
})

exports.protect = catchAsync(async (req, _, next) => {
  const { authorization } = req.headers
  let token
  if (authorization && authorization.startsWith('Bearer')) {
    // eslint-disable-next-line prefer-destructuring
    token = authorization.split(' ')[1]
  }

  if (!token) return next(new AppError('you are not logged in, please do so to get access', 401))

  // check if token is valid
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)

  const currentUser = await User.findById(decoded.id)

  // check if the user has not been deleted after token was granted
  if (!currentUser)
    return next(new AppError('the user belonging to this jwt does not longer exist', 401))

  // check if the user changed their password after token was granted
  if (currentUser.changedPasswordAfterJwt(decoded.iat))
    return next(
      new AppError(
        'user changed their password after authorization was granted, please log in again with your new password',
        401,
      ),
    )

  // grant access to protected route
  req.user = currentUser
  next()
})

exports.restrictTo = (...roles) => {
  return ({ user: { role } }, _, next) => {
    if (!roles.includes(role))
      return next(new AppError('no tiene autorización para ejecutar esta acción', 403))
    next()
  }
}

exports.createSystemUser = catchAsync(
  async ({ body: { cedula, email, password, passwordConfirm, entidadId } }, res) => {
    console.log({ cedula, email, password, passwordConfirm, entidadId })
    console.log(entidadId)
    const newUser = await SystemUser.create({
      cedula,
      email,
      entidad: entidadId,
      password,
      passwordConfirm,
    })

    createAndSendToken(newUser, 201, res)
  },
)

exports.updatePassword = catchAsync(async (req, res, next) => {
  const {
    user: { id },
    body: { passwordCurrent, passwordNew, passwordConfirm },
  } = req
  const user = await SystemUser.findById(id).select('+password')

  if (!user) return next(new AppError(`no user was found with id: ${id}`))

  const isPasswordCorrect = await user.validatePassword(passwordCurrent, user.password)

  if (!isPasswordCorrect) return next(new AppError('incorrect password', 401))
  if (passwordConfirm !== passwordNew)
    return next(new AppError('your new password and confirmation do not match', 400))

  user.password = passwordNew
  user.passwordConfirm = passwordConfirm
  await user.save()

  createAndSendToken(user, 200, res)
})
