const mongoose = require('mongoose')

const provinciaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: ['El nombre de provincia es requerido'],
    enum: {
      values: [
        'bocas-del-toro',
        'coclé',
        'colón',
        'chiriquí',
        'darién',
        'herrera',
        'los-santos',
        'panamá',
        'veraguas',
        'panamá-oeste',
      ],
      message: 'Provincia inválida',
    },
  },
})

const Provincia = mongoose.model('Provincia', provinciaSchema)

provinciaSchema.virtual('entidades', {
  ref: 'Entidad',
  foreignField: 'provincia',
  localField: '_id',
})

provinciaSchema.virtual('programas', {
  ref: 'Programa',
  foreignField: 'provincia',
  localField: '_id',
})

provinciaSchema.virtual('gastos', {
  ref: 'Gasto',
  foreignField: 'provincia',
  localField: '_id',
})

provinciaSchema.virtual('ingresos', {
  ref: 'Ingreso',
  foreignField: 'provincia',
  localField: '_id',
})

module.exports = Provincia
