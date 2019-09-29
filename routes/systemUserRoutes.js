const express = require('express')
const {
  getAllSystemUsers,
  getSystemUser,
  createSystemUser,
  updateSystemUser,
  deleteSystemUser,
  updateMe,
} = require('../controllers/systemUserController')
const {
  signup,
  login,
  protect,
  restrictTo,
  forgotPassword,
  resetPassword,
  updatePassword,
} = require('../controllers/systemAuthController')

const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)
router.post('/forgotPassword', forgotPassword)
router.patch('/resetPassword/:token', resetPassword)
router.patch('/updateMyPassword', protect, updatePassword)
router.patch('/updateMe', protect, updateMe)

router
  .route('/')
  .get(protect, restrictTo('admin'), getAllSystemUsers)
  .post(protect, restrictTo('admin'), createSystemUser)

router
  .route('/:id')
  .get(protect, restrictTo('admin'), getSystemUser)
  .patch(protect, restrictTo('admin', 'self'), updateSystemUser)
  .delete(protect, restrictTo('admin'), deleteSystemUser)

module.exports = router
