const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const bcrypt = require('bcrypt')
const fs = require('fs')
const path = require('path')

exports.getProfile = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: {
      id: true,
      name: true,
      email: true,
      profilePic: true,
      birthDate: true,
      createdAt: true
    }
  })
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado' })

  // estatísticas
  const tasks = await prisma.task.findMany({ where: { userId: req.userId } })
  const completed = tasks.filter(t => t.completed).length
  const total = tasks.length
  const percent = total ? Math.round((completed / total) * 100) : 0

  res.json({ ...user, stats: { completed, total, percent } })
}

exports.updateProfile = async (req, res) => {
  const { name, email } = req.body
  const profilePic = req.file?.filename
  try {
    const data = { name, email }
    if (profilePic) data.profilePic = profilePic
    await prisma.user.update({ where: { id: req.userId }, data })
    res.json({ message: 'Perfil atualizado com sucesso' })
  } catch {
    res.status(400).json({ error: 'Erro ao atualizar perfil' })
  }
}

exports.updatePassword = async (req, res) => {
  const { password } = req.body
  const hashed = await bcrypt.hash(password, 10)
  await prisma.user.update({ where: { id: req.userId }, data: { password: hashed } })
  res.json({ message: 'Senha atualizada' })
}