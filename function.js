document.addEventListener('DOMContentLoaded', function () {
    const addButton = document.getElementById('add-task-btn');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    const totalTasksSpan = document.getElementById('total-tasks');
    const completedTasksSpan = document.getElementById('completed-tasks');

    let tasks = [];

    function updateStats() {
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.completed).length;
        
        totalTasksSpan.textContent = totalTasks;
        completedTasksSpan.textContent = completedTasks;
    }

    function addTask() {
        const taskName = taskInput.value.trim();
        if (taskName === "") return;

        const task = {
            id: Date.now(),
            name: taskName,
            completed: false
        };

        tasks.push(task);
        addTaskToList(task);
        updateStats();
        
        taskInput.value = '';
        
        // Add entrance animation
        const taskElement = taskList.lastElementChild;
        taskElement.style.opacity = '0';
        taskElement.style.transform = 'translateX(-20px)';
        setTimeout(() => {
            taskElement.style.opacity = '1';
            taskElement.style.transform = 'translateX(0)';
        }, 50);
    }

    function addTaskToList(task) {
        const li = document.createElement('li');
        li.dataset.id = task.id;
        li.innerHTML = `
            <span class="task-name">${task.name}</span>
            <div class="task-actions">
                <button class="task-btn complete-btn" onclick="toggleComplete(this)">
                    <i class="fas fa-check"></i>
                </button>
                <button class="task-btn edit-btn" onclick="editTask(this)">
                    <i class="fas fa-pen"></i>
                </button>
                <button class="task-btn delete-btn" onclick="deleteTask(this)">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        taskList.appendChild(li);
    }

    addButton.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addTask();
    });

    window.toggleComplete = function(button) {
        const taskItem = button.closest('li');
        const taskId = parseInt(taskItem.dataset.id);
        const task = tasks.find(t => t.id === taskId);
        
        if (task) {
            task.completed = !task.completed;
            taskItem.classList.toggle('completed');
            updateStats();
        }
    };

    window.deleteTask = function(button) {
        const taskItem = button.closest('li');
        const taskId = parseInt(taskItem.dataset.id);
        
        // Add exit animation
        taskItem.style.opacity = '0';
        taskItem.style.transform = 'translateX(20px)';
        
        setTimeout(() => {
            tasks = tasks.filter(task => task.id !== taskId);
            taskItem.remove();
            updateStats();
        }, 300);
    };

    window.editTask = function(button) {
        const taskItem = button.closest('li');
        const taskNameSpan = taskItem.querySelector('.task-name');
        const currentTaskName = taskNameSpan.textContent;
        
        taskNameSpan.innerHTML = `<input type="text" value="${currentTaskName}" class="edit-input" />`;
        const input = taskNameSpan.querySelector('input');
        input.focus();
        
        button.innerHTML = '<i class="fas fa-save"></i>';
        button.setAttribute('onclick', 'saveTask(this)');
    };

    window.saveTask = function(button) {
        const taskItem = button.closest('li');
        const taskId = parseInt(taskItem.dataset.id);
        const taskNameInput = taskItem.querySelector('.edit-input');
        const newTaskName = taskNameInput.value.trim();
        
        if (newTaskName === "") return;
        
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            task.name = newTaskName;
            const taskNameSpan = taskItem.querySelector('.task-name');
            taskNameSpan.textContent = newTaskName;
        }
        
        button.innerHTML = '<i class="fas fa-pen"></i>';
        button.setAttribute('onclick', 'editTask(this)');
    };
});