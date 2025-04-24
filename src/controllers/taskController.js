const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


exports.createTask = async (req, res) => {
  const { name, time, date, category, repeat } = req.body
  const task = await prisma.task.create({
    data: { name, time, date: new Date(date), category, repeat, userId: req.userId }
  })
  res.status(201).json(task)
}

exports.getTasks = async (req, res) => {
  const tasks = await prisma.task.findMany({
    where: { userId: req.userId },
    orderBy: { date: 'asc' }
  })
  res.json(tasks)
}

exports.updateTask = async (req, res) => {
  const { id } = req.params
  const data = req.body
  const task = await prisma.task.update({ where: { id: Number(id) }, data })
  res.json(task)
}

exports.deleteTask = async (req, res) => {
  const { id } = req.params
  await prisma.task.delete({ where: { id: Number(id) } })
  res.json({ message: 'Tarefa excluída' })
}