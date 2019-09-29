const Programa = require('../models/programaModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const APIFeature = require('../utils/apiFeatures')

exports.crearPrograma = catchAsync(async (req, res, next) => {
  const newPrograma = await Programa.create(req.body)

  res.status(201).json({
    programa: newPrograma,
  })
})

exports.getAllProgramas = catchAsync(async (req, res, next) => {
  const { query } = req

  const features = new APIFeature(Programa.find(), query)
    .filter()
    .sort()
    .limitFields()
    .paginate()

  const programas = await features.query

  res.status(200).json({
    status: 'success',
    data: {
      amount: programas.length,
      programas,
    },
  })
})

exports.getPrograma = catchAsync(async (req, res, next) => {
  const { id } = req.params
  const programa = await Programa.findById(id)

  if (!programa) return next(new AppError(`no hay programa con id: ${id}`, 404))

  res.status(200).json({
    status: 'success',
    data: {
      programa,
    },
  })
})
