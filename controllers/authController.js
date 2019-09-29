const crypto = require('crypto')
const { promisify } = require('util')
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const sendEmail = require('../utils/email')
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

exports.signup = catchAsync(async ({ body: { cedula, email, password, passwordConfirm } }, res) => {
  const newUser = await User.create({
    cedula,
    email,
    password,
    passwordConfirm,
  })

  createAndSendToken(newUser, 201, res)
})

exports.login = catchAsync(async ({ body: { email, password } }, res, next) => {
  if (!email || !password) return next(new AppError('please provide an email and password', 400))

  const user = await User.findOne({ email }).select('+password')

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

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const {
    protocol,
    body: { email },
  } = req
  const user = await User.findOne({ email })

  if (!user) return next(new AppError(`no user was found with email: ${email}`, 404))

  const resetToken = user.generatePasswordResetToken()
  await user.save({ validateBeforeSave: false })

  const resetUrl = `${protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`
  const message = `Forgot your password? Submit a PATCH  request with your new password
  and passwordConfirm to: ${resetUrl}\nIf you didn't forget your password, please ignore this email`

  try {
    await sendEmail({
      email,
      subject: 'Your password reset token (valid for 10 min)',
      message,
    })

    res.status(200).json({
      status: 'success',
      message: 'token sent to your email! it is valid for 10 minutes',
    })
  } catch (error) {
    user.passwordResetToken = undefined
    user.passwordResetTokenExpiryDate = undefined
    await user.save({ validateBeforeSave: false })

    return next(new AppError('there was an error sending email. try again later.', 500))
  }
})

exports.resetPassword = catchAsync(async (req, res, next) => {
  const {
    params: { token },
    body: { password, passwordConfirm },
  } = req
  // get user based on token
  const hashedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex')

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetTokenExpiryDate: { $gt: Date.now() },
  })
  // set new password if token has not expired and there is an user
  if (!user) return next(new AppError('token is invalid or has expired', 400))
  // update changedPasswordAt property for the current user
  user.password = password
  user.passwordConfirm = passwordConfirm
  user.passwordResetToken = undefined
  user.passwordResetTokenExpiryDate = undefined
  await user.save()
  // log the user in
  createAndSendToken(user, 200, res)
})

exports.updatePassword = catchAsync(async (req, res, next) => {
  const {
    user: { id },
    body: { passwordCurrent, passwordNew, passwordConfirm },
  } = req
  const user = await User.findById(id).select('+password')

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
