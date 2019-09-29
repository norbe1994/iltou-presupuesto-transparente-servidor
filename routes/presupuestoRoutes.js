const express = require('express')
const {
  getPresupuesto,
  getAllPresupuestos,
  crearPresupuesto,
} = require('../controllers/presupuestoController')
const { protect, restrictTo } = require('../controllers/authController')

const router = express.Router()

router
  .route('/')
  .get(protect, getAllPresupuestos)
  .post(protect, restrictTo('system', 'admin'), crearPresupuesto)

router.route('/:id').get(protect, getPresupuesto)

module.exports = router
