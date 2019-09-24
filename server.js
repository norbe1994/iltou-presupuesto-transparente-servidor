const mongoose = require('mongoose')
const dotenv = require('dotenv')

process.on('uncaughtException', ({ name, message }) => {
  console.error(name, message, '💥unhandled rejection💥 shutting down...')
  process.exit(1)
})

dotenv.config({ path: './config.env' })
const app = require('./app')

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful'))

process.env.PORT = process.env.PORT || process.env.FALLBACKPORT

const server = app.listen(process.env.PORT, () =>
  console.log(`app up and running on port: ${process.env.PORT}`),
)

process.on('unhandledRejection', ({ name, message }) => {
  console.error(name, message, '💥unhandled rejection💥 shutting down...')
  server.close(() => process.exit(1))
})
