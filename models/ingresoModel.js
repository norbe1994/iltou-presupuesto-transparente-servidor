const mongoose = require('mongoose')

const ingresoSchema = new mongoose.Schema({
  tipo: {
    type: String,
    required: [true, 'Es requerido especificar el tipo del ingreso'],
    enum: {
      values: ['corriente', 'capital'],
      message: "Ingreso debe ser de tipo 'corriente' o 'capital'",
    },
  },
  presupuesto: {
    type: mongoose.Schema.ObjectId,
    ref: 'Presupuesto',
    required: [true, 'Es requerido elegir a que presupuesto anual fiscal pertenece el ingreso'],
  },
  institucion: {
    type: mongoose.Schema.ObjectId,
    ref: 'Institucion',
    required: [true, 'Es requerido especificar a que institución corresponde el ingreso'],
  },
  entidad: {
    type: mongoose.Schema.ObjectId,
    ref: 'Entidad',
    required: [true, 'Es requerido especificar a que entidad corresponde el ingreso'],
  },
  provincia: {
    type: mongoose.Schema.ObjectId,
    ref: 'Provincia',
    required: [true, 'Es necesario especificar a que provincia corresponde el ingreso'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Es requerido especificar que funcionario registra el ingreso'],
  },
  monto: {
    type: Number,
    required: [true, 'Es requerido especificar el monto del ingreso'],
    validate: {
      validator: function(value) {
        return value > 0
      },
      message: 'El monto del ingreso debe ser mayor a cero',
    },
  },
  /*   origenTipo: {
    type: String,
    required: [true, 'Es requerido especificar el tipo de origen del ingreso'],
    validate: {
      validator: function(value) {
        if (this.tipo === 'corriente')
          return [
            'operación',
            'transferencias-corrientes',
            'aporte-al-físico',
            'subsidios',
            'interes-de-la-deuda',
          ].includes(value)
        return [
          'inversiones',
          'otros-gastos-de-capital',
          'transferencias-de-capital',
          'amortización-de-la-deuda',
        ].includes(value)
      },
      message:
        'El tipo de origen elegido no corresponde a ninguno de los válidos según el tipo de ingreso',
    },
  }, */
  origenNombre: {
    type: String,
    required: [true, 'Es requerido dar nombre al origen del ingreso'],
  },
  origenNaturaleza: {
    type: String,
    required: [true, 'Es requerido especificar la naturaleza del origen'],
    enum: {
      values: ['privado', 'particular', 'público'],
      message: 'Naturaleza de origen inválida',
    },
  },
  origenID: {
    type: String,
    required: [
      true,
      'Es requerido especificar el identificador único del origen (cédula si en un particular,RUC si es una empresa, pid si es público)',
    ],
  },
  justificacion: {
    type: String,
    required: [
      true,
      'Es necesario incluir una justificación que explique el origen y razón del ingreso',
    ],
    validate: {
      validator: function(value) {
        return value.length >= 100
      },
      message:
        'La justificación del ingreso debe de ser de al menos 100 caracteres. Incluya tanto detalle como sea posible.',
    },
  },
  fecha: {
    type: Date,
    required: [true, 'Es requerido incluir la fecha del ingreso'],
  },
  creadoEn: {
    type: Date,
    default: Date.now,
  },
})

const Ingreso = mongoose.model('Ingreso', ingresoSchema)

module.exports = Ingreso
