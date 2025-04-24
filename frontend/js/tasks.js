const baseURL = 'http://localhost:3000/api'

const token = localStorage.getItem('token')
if (!token) window.location.href = 'index.html'

const taskForm = document.getElementById('taskForm')
const pendingList = document.getElementById('pendingTasks')
const completedList = document.getElementById('completedTasks')

// Função para carregar as tarefas
const carregarTarefas = async () => {
  const res = await fetch(`${baseURL}/tasks`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  const tarefas = await res.json()
  pendingList.innerHTML = ''
  completedList.innerHTML = ''
  tarefas.forEach(t => {
    const item = document.createElement('li')
    item.textContent = `${t.name} - ${new Date(t.date).toLocaleDateString()} ${t.time}`
    
    // Adicionando botões de "Concluir" e "Excluir"
    const concluirBtn = document.createElement('button')
    concluirBtn.textContent = 'Concluir'
    concluirBtn.onclick = () => concluirTarefa(t.id)

    const excluirBtn = document.createElement('button')
    excluirBtn.textContent = 'Excluir'
    excluirBtn.onclick = () => excluirTarefa(t.id)

    item.appendChild(concluirBtn)
    item.appendChild(excluirBtn)

    // Separar tarefas concluídas e pendentes
    if (t.completed) completedList.appendChild(item)
    else pendingList.appendChild(item)
  })
}

// Função para concluir tarefa
const concluirTarefa = async (taskId) => {
  const res = await fetch(`${baseURL}/tasks/${taskId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ completed: true })
  })
  if (res.ok) {
    carregarTarefas()  // Atualiza a lista de tarefas
  } else {
    alert('Erro ao concluir tarefa')
  }
}

// Função para excluir tarefa
const excluirTarefa = async (taskId) => {
  const res = await fetch(`${baseURL}/tasks/${taskId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  })
  if (res.ok) {
    carregarTarefas()  // Atualiza a lista de tarefas
  } else {
    alert('Erro ao excluir tarefa')
  }
}

carregarTarefas()

// Função para adicionar nova tarefa
taskForm.addEventListener('submit', async (e) => {
  e.preventDefault()
  const data = Object.fromEntries(new FormData(taskForm).entries())
  const res = await fetch(`${baseURL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data)
  })
  if (res.ok) {
    taskForm.reset()
    carregarTarefas()  // Atualiza a lista de tarefas
  } else {
    alert('Erro ao adicionar tarefa')
  }
})
