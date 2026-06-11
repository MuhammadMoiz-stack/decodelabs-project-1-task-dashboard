/* 
    Project: Task Management Dashboard
    Author: Gemini CLI
    Logic: Vanilla JavaScript
*/

document.addEventListener('DOMContentLoaded', () => {
    // --- State Management ---
    let tasks = [
        { id: 1, name: 'Design Project Mockups', description: 'Create high-fidelity mockups for the new dashboard.', priority: 'High', completed: false, date: '2026-06-12' },
        { id: 2, name: 'Develop Core API', description: 'Implement the RESTful API for task management.', priority: 'Medium', completed: true, date: '2026-06-11' },
        { id: 3, name: 'Write Documentation', description: 'Document the project structure and setup.', priority: 'Low', completed: false, date: '2026-06-15' }
    ];

    // --- DOM Elements ---
    const navMenu = document.getElementById('nav-menu');
    const hamburger = document.getElementById('hamburger');
    const taskForm = document.getElementById('task-form');
    const taskList = document.getElementById('task-list');
    
    // Stats Elements
    const totalTasksEl = document.getElementById('total-tasks');
    const completedTasksEl = document.getElementById('completed-tasks');
    const pendingTasksEl = document.getElementById('pending-tasks');
    const productivityPctEl = document.getElementById('productivity-pct');

    // --- Mobile Menu Logic ---
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('open');
        
        // Simple hamburger animation
        const spans = hamburger.querySelectorAll('span');
        if (hamburger.classList.contains('open')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -7px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('open');
            const spans = hamburger.querySelectorAll('span');
            spans.forEach(s => s.style.transform = 'none');
            spans[1].style.opacity = '1';
        });
    });

    // --- Task Rendering Logic ---
    function renderTasks() {
        taskList.innerHTML = '';
        
        if (tasks.length === 0) {
            taskList.innerHTML = '<p class="text-center" style="grid-column: 1/-1; color: var(--text-secondary);">No tasks yet. Add one above!</p>';
            return;
        }

        tasks.forEach(task => {
            const card = document.createElement('div');
            card.className = `task-card ${task.completed ? 'completed' : ''}`;
            card.dataset.id = task.id;

            card.innerHTML = `
                <div class="task-header">
                    <span class="task-title">${task.name}</span>
                    <span class="priority-badge priority-${task.priority}">${task.priority}</span>
                </div>
                <p class="task-desc">${task.description}</p>
                <div class="task-footer">
                    <span class="due-date">Due: ${task.date}</span>
                    <div class="task-actions">
                        <button class="btn btn-complete" onclick="toggleTask(${task.id})">
                            ${task.completed ? 'Undo' : 'Complete'}
                        </button>
                    </div>
                </div>
            `;
            taskList.appendChild(card);
        });

        updateStats();
    }

    // --- Stats Update Logic ---
    function updateStats() {
        const total = tasks.length;
        const completed = tasks.filter(t => t.completed).length;
        const pending = total - completed;
        const productivity = total > 0 ? Math.round((completed / total) * 100) : 0;

        totalTasksEl.textContent = total;
        completedTasksEl.textContent = completed;
        pendingTasksEl.textContent = pending;
        productivityPctEl.textContent = `${productivity}%`;
    }

    // --- Add Task Logic ---
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('task-name').value;
        const desc = document.getElementById('task-desc').value;
        const priority = document.getElementById('task-priority').value;

        if (!name || !priority) {
            alert('Please fill in the required fields.');
            return;
        }

        const newTask = {
            id: Date.now(),
            name,
            description: desc || 'No description provided.',
            priority,
            completed: false,
            date: new Date().toISOString().split('T')[0]
        };

        tasks.unshift(newTask); // Add to beginning
        renderTasks();
        taskForm.reset();
        
        // Smooth scroll to task list
        document.getElementById('task-list').scrollIntoView({ behavior: 'smooth' });
    });

    // --- Toggle Task Completion ---
    // Defined globally so the inline onclick works, 
    // though event delegation is usually better.
    window.toggleTask = (id) => {
        tasks = tasks.map(task => {
            if (task.id === id) {
                return { ...task, completed: !task.completed };
            }
            return task;
        });
        renderTasks();
    };

    // --- Initial Render ---
    renderTasks();
});
