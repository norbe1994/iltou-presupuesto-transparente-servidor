const Provincia = require('../models/provinciaModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const APIFeature = require('../utils/apiFeatures')

exports.crearProvincia = catchAsync(async (req, res, next) => {
  const newProvincia = await Provincia.create(req.body)

  res.status(201).json({
    provincia: newProvincia,
  })
})

exports.getAllProvincias = catchAsync(async (req, res, next) => {
  const { query } = req

  const features = new APIFeature(Provincia.find(), query)
    .filter()
    .sort()
    .limitFields()
    .paginate()

  const provincias = await features.query

  res.status(200).json({
    status: 'success',
    data: {
      amount: provincias.length,
      provincias,
    },
  })
})

exports.getProvincia = catchAsync(async (req, res, next) => {
  const { id } = req.params
  const provincia = await Provincia.findById(id)

  if (!provincia) return next(new AppError(`no hay provincia con id: ${id}`, 404))

  res.status(200).json({
    status: 'success',
    data: {
      provincia,
    },
  })
})
