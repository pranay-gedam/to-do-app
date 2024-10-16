const taskList = document.getElementById('taskList');

async function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskName = taskInput.value.trim(); // Trim whitespace

    if (!taskName) return; 

    try {
        const response = await fetch('http://localhost:3000/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: taskName }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        taskInput.value = ''; 
        fetchTasks(); 
    } catch (error) {
        console.error('Error adding task:', error);
    }
}


async function fetchTasks() {
    const response = await fetch('http://localhost:3000/tasks');
    if (!response.ok) {
        console.error('Failed to fetch tasks:', response.statusText);
        return;
    }
    const tasks = await response.json();
    renderTasks(tasks);
}

async function toggleTaskCompletion(id, completed) {
    try {
        const response = await fetch(`http://localhost:3000/tasks/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ completed }),
        });

        if (!response.ok) {
            throw new Error('Failed to update task');
        }

        fetchTasks(); 
    } catch (error) {
        console.error('Error updating task:', error);
    }
}


function renderTasks(tasks) {
    taskList.innerHTML = ''; 
    tasks.forEach(task => {
        const li = document.createElement('li');

        
        const taskName = document.createElement('span');
        taskName.textContent = task.name;
        taskName.classList.add('task-name');
        if (task.completed) {
            taskName.classList.add('completed'); 
        }

        
        const completeButton = document.createElement('button');
        completeButton.textContent = task.completed ? 'Undo' : 'Complete'; 
        completeButton.onclick = () => toggleTaskCompletion(task._id, !task.completed); 

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deleteTask(task._id);

        li.appendChild(taskName);
        li.appendChild(completeButton);
        li.appendChild(deleteButton);

        taskList.appendChild(li);
    });
}


async function deleteTask(id) {
    await fetch(`http://localhost:3000/tasks/${id}`, {
        method: 'DELETE',
    });
    
    fetchTasks();
}

fetchTasks();
