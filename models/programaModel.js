const mongoose = require('mongoose')
const Entidad = require('./entidadModel')
const entidadProgramaMap = require('../static/entidadProgramaMap')

const programaSchema = new mongoose.Schema(
  {
    tipo: {
      type: String,
      required: [true, 'Es requerido especificar el tipo del programa'],
      enum: {
        values: ['funcionamiento', 'inversión'],
        message: 'Tipo de programa inválido',
      },
    },
    nombre: {
      type: String,
      required: [true, 'Es requerido especificar el nombre de programa'],
      unique: true,
    },
    presupuesto: {
      type: mongoose.Schema.ObjectId,
      ref: 'Presupuesto',
      required: [true, 'Es requerido especificar a que presupesto pertenece el programa'],
    },
    institucion: {
      type: mongoose.Schema.ObjectId,
      ref: 'Institucion',
      required: [true, 'Es requerido especificar a que entidad pertenece el programa'],
    },
    entidad: {
      type: mongoose.Schema.ObjectId,
      ref: 'Entidad',
      required: [true, 'Es requerido especificar a que entidad pertenece el programa'],
    },
    provincia: {
      type: mongoose.Schema.ObjectId,
      ref: 'Provincia',
      required: [true, 'Es necesario especificar a que provincia corresponde el programa'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

const Programa = mongoose.model('Programa', programaSchema)

programaSchema.pre('save', function(next) {
  const entidad = Entidad.findById(this.entidad).select('nombre')

  if (!entidadProgramaMap[entidad.nombre][this.tipo].includes(this.nombre)) {
    const error = new Error('Nombre de programa no existe en la entidad')
    next(error)
  } else {
    next()
  }
})

programaSchema.virtual('gastos', {
  ref: 'Gasto',
  foreignField: 'programa',
  localField: '_id',
})

module.exports = Programa
