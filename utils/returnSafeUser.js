const returnSafeUser = user => {
  delete user._doc.passwordChangedAt
  delete user._doc.password
  delete user._doc.__v
  delete user._doc._id

  return user
}

module.exports = returnSafeUser
