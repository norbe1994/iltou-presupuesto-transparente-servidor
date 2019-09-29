const User = require('../models/userModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const returnSafeUser = require('../utils/returnSafeUser')

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find()

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  })
})

exports.getUser = catchAsync(async (req, res, next) => {
  const { id } = req.params
  const user = await User.findById(id)

  if (!user) return next(new AppError(`no user was found with id: ${id}`, 404))

  res.status(200).json({
    status: 'success',
    user,
  })
})

exports.updateMe = catchAsync(async (req, res, next) => {
  const {
    user: { id },
    body: { email },
  } = req

  if (!email || Object.keys(req.body).length > 1)
    return next(new AppError('invalid body, expecting only "email" key', 400))

  const updates = { email }
  const updatedUser = returnSafeUser(
    await User.findByIdAndUpdate(id, updates, { new: true, runValidators: true }),
  )

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  })
})

exports.deleteMe = catchAsync(async ({ user: { id } }, res) => {
  await User.findByIdAndUpdate(id, { active: false })

  res.status(200).json({
    status: 'success',
    data: null,
  })
})

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not yet implemented!',
  })
}
