const mongoose = require('mongoose')

const institucionSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'Es requerido especificar el nombre de la institución'],
    },
    presupuesto: {
      type: Number,
      required: [true, 'Es necesario especificar el presupuesto de la institución'],
      validate: {
        validator: function(value) {
          return value > 0
        },
        message: 'El presupuesto debe ser mayor a cero',
      },
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

institucionSchema.virtual('gastos', {
  ref: 'Gasto',
  foreignField: 'institucion',
  localField: '_id',
})

institucionSchema.virtual('ingresos', {
  ref: 'Ingreso',
  foreignField: 'institucion',
  localField: '_id',
})

institucionSchema.virtual('programas', {
  ref: 'Programa',
  foreignField: 'institucion',
  localField: '_id',
})

institucionSchema.virtual('entidades', {
  ref: 'Entidad',
  foreignField: 'institucion',
  localField: '_id',
})

const Institucion = mongoose.model('Institucion', institucionSchema)

module.exports = Institucion
