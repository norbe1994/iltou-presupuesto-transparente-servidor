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
    ref: 'SystemUser',
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
  destinoTipo: {
    type: String,
    required: [true, 'Es requerido especificar el tipo de destino del gasto'],
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
      message: 'El tipo de destino elegido no corresponde a los válidos según el tipo de gasto',
    },
  },
  destinoNombre: {
    type: String,
    required: [true, 'Es requerido dar nombre al destiono del gasto'],
  },
  destinoNaturaleza: {
    type: String,
    required: [true, 'Es requerido especificar la naturaleza del destino'],
    enum: {
      value: ['privado', 'particular', 'público'],
      message: 'Naturaleza de destino inválida',
    },
  },
  destinoID: {
    type: String,
    required: [
      true,
      'Es requerido especificar el identificador único del destino (cédula si en un particular, RUC si es una empresa, pid si en público)',
    ],
  },
  justificacion: {
    type: String,
    required: [
      true,
      'Es necesario incluir una justificación que explique el destino y la razón del gasto',
    ],
    validate: {
      validator: function(value) {
        return value.length >= 100
      },
      message:
        'La justificación del gasto debe de ser de al menos 100 caracteres. Incluya tanto detalle como sea posible.',
    },
  },
  provincia: {
    type: String,
    required: [true, 'Es necesario especificar a que provincia corresponde el gasto'],
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
      message: 'Provincia  inexistente',
    },
  },
  fecha: {
    type: Date,
    required: [true, 'Es requerido incluir la fecha del gasto'],
  },
  creadoEn: {
    type: Date,
    default: Date.now,
  },
})

const Gasto = mongoose.model('Gasto', gastoSchema)

module.exports = Gasto
