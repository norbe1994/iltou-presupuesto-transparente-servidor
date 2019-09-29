const express = require('express')
const { getPrograma, getAllProgramas, crearPrograma } = require('../controllers/programaController')
const { protect, restrictTo } = require('../controllers/authController')

const router = express.Router()

router
  .route('/')
  .get(protect, getAllProgramas)
  .post(protect, restrictTo('system', 'admin'), crearPrograma)

router.route('/:id').get(protect, getPrograma)

module.exports = router
