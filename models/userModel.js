const crypto = require('crypto')
const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  cedula: {
    type: String,
    required: [true, 'Cédula es requerida'],
    unique: true,
  },
  email: {
    type: String,
    required: [true, 'user must have an email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'email provided is not valid'],
  },
  photo: String,
  role: {
    type: String,
    enum: ['user'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'user must have a password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'user must confirm their password'],
    validate: {
      validator: function(value) {
        return value === this.password
      },
      message: 'password and password confirmation do not match',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetTokenExpiryDate: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
})

userSchema.pre('save', async function(next) {
  // only run if the password was modified. create() returns true for this.isModified for all fields, so the middleware WILL run on create(), which is what we want
  if (!this.isModified('password')) return next()

  // hash with cost of 12
  this.password = await bcrypt.hash(this.password, 12)
  this.passwordConfirm = undefined
  next()
})

userSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next()

  this.passwordChangedAt = Date.now() - 1000
  next()
})

userSchema.pre(/^find/, function(next) {
  this.find({ active: { $ne: false } })
  next()
})

userSchema.methods.validatePassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword)
}

userSchema.methods.changedPasswordAfterJwt = function(JwtTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10)

    return JwtTimestamp < changedTimeStamp
  }

  // password not changed
  return false
}

userSchema.methods.generatePasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex')

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex')

  this.passwordResetTokenExpiryDate = Date.now() + 600000

  return resetToken
}

const User = mongoose.model('User', userSchema)

module.exports = User
