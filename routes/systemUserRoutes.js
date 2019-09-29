const express = require('express')
const {
  getAllSystemUsers,
  getSystemUser,
  updateSystemUser,
  deleteSystemUser,
  updateMe,
} = require('../controllers/systemUserController')
const {
  login,
  protect,
  restrictTo,
  updatePassword,
  createSystemUser,
} = require('../controllers/systemAuthController')

const router = express.Router()

router.post('/login', login)
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
