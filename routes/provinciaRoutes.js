const express = require('express')
const {
  getProvincia,
  getAllProvincias,
  crearProvincia,
} = require('../controllers/provinciaController')
const { protect, restrictTo } = require('../controllers/authController')

const router = express.Router()

router
  .route('/')
  .get(protect, getAllProvincias)
  .post(protect, restrictTo('system', 'admin'), crearProvincia)

router.route('/:id').get(protect, getProvincia)

module.exports = router
