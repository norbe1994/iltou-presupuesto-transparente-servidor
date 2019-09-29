const express = require('express')
const { getGasto, getAllGastos, crearGasto } = require('../controllers/gastoController')
const { protect, restrictTo } = require('../controllers/authController')

const router = express.Router()

router
  .route('/')
  .get(protect, getAllGastos)
  .post(protect, crearGasto)

router.route('/:id').get(protect, restrictTo('system'), getGasto)

module.exports = router
