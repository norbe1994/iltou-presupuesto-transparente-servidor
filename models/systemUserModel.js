const mongoose = require('mongoose')
const validator = require('validator')

const systemUserSchema = new mongoose.Schema({
  cedula: {
    type: String,
    required: [true, 'Cédula es requerida'],
    unique: true,
  },
  email: {
    type: String,
    required: [true, 'Email es requerido'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Email inválido'],
  },
  photo: String,
  entidad: {
    type: mongoose.Schema.ObjectId,
    ref: 'Entidad',
    required: [
      true,
      'Es necesario especificar la entidad a la cual pertenece el usuario del sistema',
    ],
  },
})

systemUserSchema.virtual('gastos', {
  ref: 'Gasto',
  foreignField: 'user',
  localField: '_id',
})

systemUserSchema.virtual('ingresos', {
  ref: 'Ingreso',
  foreignField: 'user',
  localField: '_id',
})

const SystemUser = mongoose.model('SystemUser', systemUserSchema)

module.exports = SystemUser
