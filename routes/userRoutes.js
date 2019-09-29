const express = require('express')
const {
  getAllUsers,
  getUser,
  deleteUser,
  updateMe,
  deleteMe,
} = require('../controllers/userController')
const {
  signup,
  login,
  protect,
  restrictTo,
  forgotPassword,
  resetPassword,
  updatePassword,
} = require('../controllers/authController')

const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)
router.post('/forgotPassword', forgotPassword)
router.patch('/resetPassword/:token', resetPassword)
router.patch('/updateMyPassword', protect, updatePassword)
router.patch('/updateMe', protect, updateMe)
router.patch('/deleteMe', protect, deleteMe)

router
  .route('/')
  .get(getAllUsers)

router
  .route('/:id')
  .get(protect, restrictTo('admin'), getUser)
  .delete(deleteUser)

module.exports = router
