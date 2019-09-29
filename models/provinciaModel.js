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

module.exports = Provincia
