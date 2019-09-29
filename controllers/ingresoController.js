const Ingreso = require('../models/ingresoModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const APIFeature = require('../utils/apiFeatures')

exports.crearIngreso = catchAsync(async (req, res, next) => {
  const newIngreso = await Ingreso.create(req.body)

  res.status(201).json({
    ingreso: newIngreso,
  })
})

exports.getAllIngresos = catchAsync(async (req, res, next) => {
  const { query } = req

  const features = new APIFeature(Ingreso.find(), query)
    .filter()
    .sort()
    .limitFields()
    .paginate()

  const ingresos = await features.query

  res.status(200).json({
    status: 'success',
    data: {
      amount: ingresos.length,
      ingresos,
    },
  })
})

exports.getIngreso = catchAsync(async (req, res, next) => {
  const { id } = req.params
  const ingreso = await Ingreso.findById(id)

  if (!ingreso) return next(new AppError(`no hay ingreso con id: ${id}`, 404))

  res.status(200).json({
    status: 'success',
    data: {
      ingreso,
    },
  })
})
