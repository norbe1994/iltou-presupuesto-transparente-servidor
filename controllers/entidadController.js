const Entidad = require('../models/entidadModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const APIFeature = require('../utils/apiFeatures')

exports.crearEntidad = catchAsync(async (req, res, next) => {
  const newEntidad = await Entidad.create(req.body)

  res.status(201).json({
    entidad: newEntidad,
  })
})

exports.getAllEntidades = catchAsync(async (req, res, next) => {
  const { query } = req

  const features = new APIFeature(Entidad.find(), query)
    .filter()
    .sort()
    .limitFields()
    .paginate()

  const entidades = await features.query

  res.status(200).json({
    status: 'success',
    data: {
      amount: entidades.length,
      entidades,
    },
  })
})

exports.getEntidad = catchAsync(async (req, res, next) => {
  const { id } = req.params
  const entidad = await Entidad.findById(id)

  if (!entidad) return next(new AppError(`no hay entidad con id: ${id}`, 404))

  res.status(200).json({
    status: 'success',
    data: {
      entidad,
    },
  })
})
