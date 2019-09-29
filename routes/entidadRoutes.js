const express = require('express')
const { getEntidad, getAllEntidades, crearEntidad } = require('../controllers/entidadController')
const { protect, restrictTo } = require('../controllers/authController')

const router = express.Router()

router
  .route('/')
  .get(protect, getAllEntidades)
  .post(protect, restrictTo('admin', 'system'), crearEntidad)

router.route('/:id').get(protect, restrictTo('system'), getEntidad)

module.exports = router
