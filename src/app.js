require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const taskRoutes = require('./routes/taskRoutes')

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static('src/uploads'))

app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/tasks', taskRoutes)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`))