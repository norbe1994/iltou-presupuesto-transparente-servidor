const mongoose = require('mongoose')

const entidadSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'Se debe especificar el nombre de la entidad'],
    },
    presupuesto: {
      type: Number,
      required: [true, 'Es necesari especificar el presupuesto de la entidad'],
      validate: {
        validator: function(value) {
          return value > 0
        },
        message: 'El presupuesto debe ser mayor a cero',
      },
    },
    ubicacion: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinadas: [Number],
      direccion: String,
      descripcion: String,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

entidadSchema.virtual('gastos', {
  ref: 'Gasto',
  foreingField: 'entidad',
  localField: '_id',
})

entidadSchema.virtual('ingresos', {
  ref: 'Ingreso',
  foreingField: 'entidad',
  localField: '_id',
})

const Entidad = mongoose.model('Entidad', entidadSchema)

module.exports = Entidad
