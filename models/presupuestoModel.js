const mongoose = require('mongoose')

const presupuestoSchema = new mongoose.Schema(
  {
    presidencia: {
      type: String,
      required: [
        true,
        'Es requerido especificar la presidencia que corresponde a este presupuesto',
      ],
      // TODO leer un archivo con cádenas únicas que representen todas las presidencias históricas de Panamá
      enum: {
        values: ['jcv', 'nc', 'rm'],
        message: "Es requerido que el campo 'presidencia' sea uno de los valores enumerados",
      },
    },
    año: {
      type: Number,
      required: [true, 'Es requerido especificar el año al cúal el presupuesto pertenece'],
      validate: {
        validator: function(value) {
          return /^\d{4}$/.test(value.toString())
        },
        message: 'Formato inválido de año, debe ser de 4 dígitos',
      },
      unique: true,
    },
    monto: {
      type: Number,
      required: [true, 'Es requerido especificar el monto del presupuesto anual'],
      validate: {
        validator: function(value) {
          return value > 0
        },
        message: 'El monto del presupuesto debe ser mayor a cero',
      },
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

presupuestoSchema.virtual('gastos', {
  ref: 'Gasto',
  foreignField: 'presupuesto',
  localField: '_id',
})

presupuestoSchema.virtual('ingresos', {
  ref: 'Ingreso',
  foreignField: 'presupuesto',
  localField: '_id',
})

presupuestoSchema.virtual('programas', {
  ref: 'Programa',
  foreignField: 'presupuesto',
  localField: '_id',
})

const Presupuesto = mongoose.model('Presupuesto', presupuestoSchema)

module.exports = Presupuesto
