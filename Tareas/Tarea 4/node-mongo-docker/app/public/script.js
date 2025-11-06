document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskList = document.getElementById('task-list');

    // Función para obtener y mostrar todas las tareas
    const fetchTasks = async () => {
        const response = await fetch('/tasks');
        const tasks = await response.json();
        taskList.innerHTML = ''; // Limpiar la lista antes de añadir nuevas tareas
        tasks.forEach(task => {
            const li = document.createElement('li');
            li.innerHTML = `
                <div>
                    <strong>${task.title}</strong> - <em>(${task.status})</em>
                    <p>${task.description}</p>
                </div>
                <button class="delete-btn" data-id="${task._id}">Eliminar</button>
            `;
            taskList.appendChild(li);
        });
    };

    // Event listener para crear una nueva tarea
    taskForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;

        await fetch('/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, description }),
        });

        taskForm.reset();
        fetchTasks();
    });

    // Event listener para eliminar una tarea (usando delegación de eventos)
    taskList.addEventListener('click', async (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const id = e.target.dataset.id;
            await fetch(`/tasks/${id}`, {
                method: 'DELETE',
            });
            fetchTasks();
        }
    });

    // Cargar las tareas al iniciar la página
    fetchTasks();
});