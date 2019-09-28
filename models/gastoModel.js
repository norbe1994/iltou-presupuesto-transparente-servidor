const mongoose = require('mongoose')

const gastoSchema = new mongoose.Schema({
  tipo: {
    type: String,
    required: [true, 'Es requerido especificar el tipo del gasto'],
    enum: {
      values: ['corriente', 'capital'],
      message: "Gasto debe ser de tipo 'corriente' o 'capital'",
    },
  },
  presupuesto: {
    type: mongoose.Schema.ObjectId,
    ref: 'Presupuesto',
    required: [true, 'Es requerido elegir a que presupuesto anual fiscal pertenece el gasto'],
  },
  institucion: {
    type: mongoose.Schema.ObjectId,
    ref: 'Institucion',
    required: [true, 'Es requerido especificar a que institución corresponde el gasto'],
  },
  entidad: {
    type: mongoose.Schema.ObjectId,
    ref: 'Entidad',
    required: [true, 'Es requerido especificar a que entidad corresponde el gasto'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Es requerido especificar que funcionario registra el gasto'],
  },
  monto: {
    type: Number,
    required: [true, 'Es requerido especificar el monto del gasto'],
    validate: {
      validator: function(value) {
        return value > 0
      },
      message: 'El monto del gasto debe ser mayor a cero',
    },
  },
  destino: {
    type: String,
    required: [true, 'Es requerido especificar el destino del gasto'],
    validate: {
      validator: function(value) {
        if (this.tipo === 'corriente')
          return [
            'operación',
            'transferencias-corrientes',
            'subsidios',
            'interés-de-la-deuda',
          ].includes(value)

        // si llegamos aquí es porque es de tipo 'capital'
        return [
          'inversiones',
          'otros-gastos-de-capital',
          'transferencias-de-capital',
          'amortización-de-la-deuda',
        ].includes(value)
      },
    },
  },
  justificacion: {
    type: String,
    required: [true, 'Es necesario incluir una justificación que explique la razón del gasto'],
    validate: {
      validator: function(value) {
        return value.length >= 100
      },
      message:
        'La justificación del gasto debe de ser de al menos 100 caracteres. Incluya tanto detalle como sea posible.',
    },
  },
})

const Gasto = mongoose.model('Gasto', gastoSchema)

module.exports = Gasto
