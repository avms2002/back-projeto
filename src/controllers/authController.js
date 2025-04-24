const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const prisma = new PrismaClient()
const { sendRecoveryEmail } = require('../utils/mailer')

exports.register = async (req, res) => {
  const { name, email, password, birthDate } = req.body
  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, birthDate: new Date(birthDate) }
    })
    res.status(201).json({ message: 'Usuário registrado com sucesso' })
  } catch (error) {
    res.status(400).json({ error: 'Erro ao registrar usuário' })
  }
}

exports.login = async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Email ou senha inválidos' })
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' })
    res.json({ token, userId: user.id })
  } catch {
    res.status(500).json({ error: 'Erro no login' })
  }
}

exports.recoverPassword = async (req, res) => {
  const { email } = req.body
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado' })

  await sendRecoveryEmail(email)
  res.json({ message: 'Email de recuperação enviado' })
}
