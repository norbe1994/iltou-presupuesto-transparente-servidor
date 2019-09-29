const Gasto = require('../models/gastoModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const APIFeature = require('../utils/apiFeatures')

exports.crearGasto = catchAsync(async (req, res, next) => {
  const newGasto = await Gasto.create(req.body)

  res.status(201).json({
    gasto: newGasto,
  })
})

exports.getAllGastos = catchAsync(async (req, res, next) => {
  const { query } = req

  const features = new APIFeature(Gasto.find(), query)
    .filter()
    .sort()
    .limitFields()
    .paginate()

  const gastos = await features.query

  res.status(200).json({
    status: 'success',
    data: {
      amount: gastos.length,
      gastos,
    },
  })
})

exports.getGasto = catchAsync(async (req, res, next) => {
  const { id } = req.params
  const gasto = await Gasto.findById(id)

  if (!gasto) return next(new AppError(`no hay gasto con id: ${id}`, 404))

  res.status(200).json({
    status: 'success',
    data: {
      gasto,
    },
  })
})
