const mongoose = require('mongoose')
const validator = require('validator')

const gastoSchema = new mongoose.Schema({
  tipo: {
    type: String,
    enum: {
      values: ['corriente', 'capital'],
      message: "Gasto debe ser de tipo 'corriente' o 'capital'",
    },
    required: [true, 'Es requerido especificar el tipo del gasto'],
  },
  presupuesto: {
    type: mongoose.Schema.ObjectId,
    ref: 'Presupuesto',
    required: [true, 'Es requerido elegir a que presupuesto anual fiscal pertenece el gasto'],
  },
})
