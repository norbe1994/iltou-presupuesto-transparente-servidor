const mongoose = require('mongoose')

const entidadSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'Se debe especificar el nombre de la entidad'],
    },
    presupuesto: {
      type: Number,
      required: [true, 'Es necesario especificar el presupuesto de la entidad'],
      validate: {
        validator: function(value) {
          return value > 0
        },
        message: 'El presupuesto debe ser mayor a cero',
      },
    },
    /*   ubicacion: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinadas: [Number],
      direccion: String,
      descripcion: String,
    }, */
    provincia: {
      type: mongoose.Schema.ObjectId,
      ref: 'Provincia',
      required: [true, 'Es necesario especificar a que provincia corresponde la entidad'],
    },
    institucion: {
      type: mongoose.Schema.ObjectId,
      ref: 'Institucion',
      required: [true, 'Es necesario especificar la institución de la entidad'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

entidadSchema.virtual('gastos', {
  ref: 'Gasto',
  foreignField: 'entidad',
  localField: '_id',
})

entidadSchema.virtual('ingresos', {
  ref: 'Ingreso',
  foreignField: 'entidad',
  localField: '_id',
})
entidadSchema.virtual('programas', {
  ref: 'Programa',
  foreignField: 'entidad',
  localField: '_id',
})
entidadSchema.virtual('inspectores', {
  ref: 'User',
  foreignField: 'entidad',
  localField: '_id',
})

const Entidad = mongoose.model('Entidad', entidadSchema)

module.exports = Entidad
