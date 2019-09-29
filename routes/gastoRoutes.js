const express = require('express')
const { getGasto, getAllGastos, crearGasto } = require('../controllers/gastoController')
const { protect, restrictTo } = require('../controllers/authController')

const router = express.Router()

router
  .route('/')
  .get(protect, getAllGastos)
  .post(protect, restrictTo('system', 'admin'), crearGasto)

router.route('/:id').get(protect, getGasto)

module.exports = router
