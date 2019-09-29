const Presupuesto = require('../models/presupuestoModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const APIFeature = require('../utils/apiFeatures')

exports.crearPresupuesto = catchAsync(async (req, res, next) => {
  const newPresupuesto = await Presupuesto.create(req.body)

  res.status(201).json({
    presupuesto: newPresupuesto,
  })
})

exports.getAllPresupuestos = catchAsync(async (req, res, next) => {
  const { query } = req

  const features = new APIFeature(Presupuesto.find(), query)
    .filter()
    .sort()
    .limitFields()
    .paginate()

  const presupuestos = await features.query

  res.status(200).json({
    status: 'success',
    data: {
      amount: presupuestos.length,
      presupuestos,
    },
  })
})

exports.getPresupuesto = catchAsync(async (req, res, next) => {
  const { id } = req.params
  const presupuesto = await Presupuesto.findById(id)

  if (!presupuesto) return next(new AppError(`no hay presupuesto con id: ${id}`, 404))

  res.status(200).json({
    status: 'success',
    data: {
      presupuesto,
    },
  })
})
