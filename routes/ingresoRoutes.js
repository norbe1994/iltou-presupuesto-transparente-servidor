const express = require('express')
const { getIngreso, getAllIngresos, crearIngreso } = require('../controllers/ingresoController')
const { protect, restrictTo } = require('../controllers/authController')

const router = express.Router()

router
  .route('/')
  .get(protect, getAllIngresos)
  .post(protect, restrictTo('system', 'admin'), crearIngreso)

router.route('/:id').get(protect, getIngreso)

module.exports = router
