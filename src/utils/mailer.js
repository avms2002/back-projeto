const nodemailer = require('nodemailer')

exports.sendRecoveryEmail = async (to) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    }
  })

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Recuperação de senha',
    text: 'Clique no link para redefinir sua senha: ' + process.env.FRONTEND_URL + '/recuperar-senha'
  }

  await transporter.sendMail(mailOptions)
}
