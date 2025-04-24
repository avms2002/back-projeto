const express = require('express')
const router = express.Router()
const auth = require('../middlewares/authMiddleware')
const { createTask, getTasks, updateTask, deleteTask } = require('../controllers/taskController')

router.get('/', auth, getTasks)
router.post('/', auth, createTask)
router.put('/:id', auth, updateTask)
router.delete('/:id', auth, deleteTask)

module.exports = router