const mongoose = require('mongoose')
const validator = require('validator')

const presupuestoSchema = new mongoose.Schema({
  presidencia: {
    type: String,
    required: [true, 'Es requerido especificar la presidencia que corresponde a este presupuesto'],
    // TODO leer un archivo con cádenas únicas que representen todas las presidencias históricas de Panamá
    enum: {
      values: [''],
      message: "Es requerido que el campo 'presidencia' sea uno de los valores enúmerados",
    },
    validate: [validator.isAlpha, "El campo 'presidencia' debe ser alfabético"],
  },
  anho: {
    type: Number,
    required: [true, 'Es requerido especificar el año al cúal el presupuesto pertenece'],
    validate: {
      validator: function(value) {
        const exRegNumeroCuatroDigitos = new RegExp('/^d{4}$/')
        return exRegNumeroCuatroDigitos.test(value)
      },
      message: 'Formato inválido de año, debe ser de 4 dígitos',
    },
  },
  monto: {
    type: Number,
    required: [true, 'Es requerido especificar el monto del presupuesto anual'],
  },
  gastos: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Gasto',
    },
  ],
  ingresos: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Ingreso',
    },
  ],
})

const Presupuesto = mongoose.model('Presupuesto', presupuestoSchema)

module.exports = Presupuesto
