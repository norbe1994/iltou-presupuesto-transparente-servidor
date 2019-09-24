const nodemailer = require('nodemailer')

const sendEmail = async ({ email, subject, message }) => {
  const { EMAIL_USERNAME, EMAIL_PASSWORD, EMAIL_HOST, EMAIL_PORT } = process.env

  const transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    auth: {
      user: EMAIL_USERNAME,
      pass: EMAIL_PASSWORD,
    },
  })

  const mailOptions = {
    from: 'Norberto Cáceres <norberto@test.io>',
    to: email,
    subject,
    text: message,
  }

  await transporter.sendMail(mailOptions)
}

module.exports = sendEmail
