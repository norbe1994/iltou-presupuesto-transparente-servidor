const mongoose = require('mongoose')

const programaSchema = new mongoose.Schema({
  tipo: {
    type: String,
    required: [true, 'Es requerido especificar el tipo del programa'],
    enum: {
      value: ['Funcionamiento', 'Inversión'],
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

module.exports = Programa
