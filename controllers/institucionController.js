const Institucion = require('../models/institucionModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const APIFeature = require('../utils/apiFeatures')

exports.crearInstitucion = catchAsync(async (req, res, next) => {
  const newInstitucion = await Institucion.create(req.body)

  res.status(201).json({
    institucion: newInstitucion,
  })
})

exports.getAllInstituciones = catchAsync(async (req, res, next) => {
  const { query } = req

  const features = new APIFeature(Institucion.find(), query)
    .filter()
    .sort()
    .limitFields()
    .paginate()

  const Instituciones = await features.query

  res.status(200).json({
    status: 'success',
    data: {
      amount: Instituciones.length,
      Instituciones,
    },
  })
})

exports.getInstitucion = catchAsync(async (req, res, next) => {
  const { id } = req.params
  const institucion = await Institucion.findById(id)

  if (!institucion) return next(new AppError(`no hay institución con id: ${id}`, 404))

  res.status(200).json({
    status: 'success',
    data: {
      institucion,
    },
  })
})
