const express = require('express')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
// const hpp = require('hpp')
// 1) DEPENDENCIES -- END
const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')
const userRouter = require('./routes/userRoutes')
const systemUserRouter = require('./routes/systemUserRoutes')
const gastosRouter = require('./routes/gastoRoutes')
const entidadesRouter = require('./routes/entidadRoutes')
const institucionesRouter = require('./routes/institucionRoutes')
const presupuestosRouter = require('./routes/presupuestoRoutes')
const provinciasRouter = require('./routes/provinciaRoutes')
const ingresosRouter = require('./routes/ingresoRoutes')

const app = express()
// 2) MIDDLEWARES -- START
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'))

const limiter = rateLimit({
  max: 150,
  windowMs: 60 * 60 * 1000,
  message: 'too many requests from this IP, please try again in an hour',
})

// wearing a helmet is always a good idea
app.use(helmet())
// limit the amount of requests accepted in an hour
app.use('/api', limiter)
// parse body to json and limit its size to 10kb
app.use(express.json({ limit: '10kb' }))
// data sanitization against noSQL query injection
app.use(mongoSanitize())
// data sanitization against XSS
app.use(xss())
// prevent parameter pollution
/* app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
) */
// serve static files
app.use(express.static(`${__dirname}/public`))

app.use((req, _, next) => {
  req.requestTime = new Date().toISOString()
  next()
})
// MIDDLEWARES -- END

// 3) ROUTERS -- START
app.use('/api/v1/users', userRouter)
app.use('/api/v1/inspectores', systemUserRouter)
app.use('/api/v1/gastos', gastosRouter)
app.use('/api/v1/entidades', entidadesRouter)
app.use('/api/v1/instituciones', institucionesRouter)
app.use('/api/v1/presupuestos', presupuestosRouter)
app.use('/api/v1/provincias', provinciasRouter)
app.use('/api/v1/ingresos', ingresosRouter)
// ROUTERS -- END

app.all('*', (req, _, next) => {
  next(new AppError(`can't find ${req.originalUrl} on this server`, 404))
})

// all four variables must be declared for Express to recognize it as an error handling middleware
app.use(globalErrorHandler)

module.exports = app
