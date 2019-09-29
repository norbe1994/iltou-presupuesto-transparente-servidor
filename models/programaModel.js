const mongoose = require('mongoose')
const Entidad = require('./entidadModel')
const entidadProgramaMap = require('../static/entidadProgramaMap')

const programaSchema = new mongoose.Schema({
  tipo: {
    type: String,
    required: [true, 'Es requerido especificar el tipo del programa'],
    enum: {
      values: ['funcionamiento', 'inversion'],
      message: 'Tipo de programa inválido',
    },
  },
  nombre: {
    type: String,
    required: [true, 'Es requerido especificar el nombre de programa'],
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
})

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

module.exports = Programa
