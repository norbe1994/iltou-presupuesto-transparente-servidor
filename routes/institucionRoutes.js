const express = require('express')
const {
  getInstitucion,
  getAllInstituciones,
  crearInstitucion,
} = require('../controllers/institucionController')
const { protect, restrictTo } = require('../controllers/authController')

const router = express.Router()

router
  .route('/')
  .get(protect, getAllInstituciones)
  .post(protect, restrictTo('system', 'admin'), crearInstitucion)

router.route('/:id').get(protect, getInstitucion)

module.exports = router
