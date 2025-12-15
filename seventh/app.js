const taskInput = document.getElementById("new-task");
const addButton = document.querySelector(".todo-app__button_add");
const incompleteTaskHolder = document.getElementById("incomplete-tasks");
const completedTasksHolder = document.getElementById("completed-tasks");
const filterButtons = document.querySelectorAll(".filter-btn");
const navBurger = document.querySelector(".nav__burger");
const navMenu = document.querySelector(".nav__menu");
const body = document.body;

const menuOverlay = document.createElement('div');
menuOverlay.className = 'menu-overlay';
document.body.appendChild(menuOverlay);

let tasks = JSON.parse(localStorage.getItem('tasks')) || {
    incomplete: [],
    completed: []
};

function init() {
    loadTasks();
    setupEventListeners();
    setupSmoothScrolling();
    updateEmptyStates();
}

function loadTasks() {
    incompleteTaskHolder.innerHTML = '';
    completedTasksHolder.innerHTML = '';

    tasks.incomplete.forEach(function (taskText, index) {
        const listItem = createNewTaskElement(taskText, index);
        incompleteTaskHolder.appendChild(listItem);
        bindTaskEvents(listItem, taskCompleted);
    });

    tasks.completed.forEach(function (taskText, index) {
        const listItem = createNewTaskElement(taskText, index + tasks.incomplete.length);
        const checkbox = listItem.querySelector(".todo-app__checkbox");
        const label = listItem.querySelector(".todo-app__task-label");

        checkbox.checked = true;
        label.classList.add("todo-app__task-label_completed");
        completedTasksHolder.appendChild(listItem);
        bindTaskEvents(listItem, taskIncomplete);
    });

    applyFilter('all');
    updateEmptyStates();
}

function updateEmptyStates() {
    const incompleteEmpty = incompleteTaskHolder.children.length === 0;
    const completedEmpty = completedTasksHolder.children.length === 0;

    if (incompleteEmpty) {
        const emptyMsg = document.createElement('li');
        emptyMsg.className = 'todo-app__empty';
        emptyMsg.textContent = 'No tasks to do. Add one above!';
        incompleteTaskHolder.appendChild(emptyMsg);
    }

    if (completedEmpty) {
        const emptyMsg = document.createElement('li');
        emptyMsg.className = 'todo-app__empty';
        emptyMsg.textContent = 'No completed tasks yet.';
        completedTasksHolder.appendChild(emptyMsg);
    }
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function createNewTaskElement(taskString, id) {
    const listItem = document.createElement("li");
    listItem.className = "todo-app__item";
    listItem.dataset.taskId = id || Date.now();

    const checkBox = document.createElement("input");
    const label = document.createElement("label");
    const editInput = document.createElement("input");
    const editButton = document.createElement("button");
    const deleteButton = document.createElement("button");
    const deleteButtonImg = document.createElement("img");

    label.textContent = taskString;
    label.className = "todo-app__task-label";

    checkBox.type = "checkbox";
    checkBox.className = "todo-app__checkbox";
    editInput.type = "text";
    editInput.className = "todo-app__task-input";

    editButton.textContent = "Edit";
    editButton.className = "todo-app__button todo-app__button_edit";

    deleteButton.className = "todo-app__button todo-app__button_delete";
    deleteButtonImg.src = "./remove.svg";
    deleteButtonImg.className = "todo-app__delete-icon";
    deleteButtonImg.alt = "Remove";
    deleteButton.appendChild(deleteButtonImg);

    listItem.appendChild(checkBox);
    listItem.appendChild(label);
    listItem.appendChild(editInput);
    listItem.appendChild(editButton);
    listItem.appendChild(deleteButton);

    return listItem;
}

function addTask() {
    if (!taskInput.value.trim()) {
        showNotification("Please enter a task", "error");
        taskInput.focus();
        return;
    }

    const taskText = taskInput.value.trim();
    const listItem = createNewTaskElement(taskText);

    incompleteTaskHolder.appendChild(listItem);
    bindTaskEvents(listItem, taskCompleted);

    tasks.incomplete.push(taskText);
    saveTasks();

    taskInput.value = "";
    showNotification("Task added successfully!", "success");

    updateEmptyStates();
    applyFilter('all');

    listItem.style.animation = 'fadeIn 0.3s ease-out';
}

function editTask() {
    const listItem = this.parentNode;
    const editInput = listItem.querySelector(".todo-app__task-input");
    const label = listItem.querySelector(".todo-app__task-label");
    const editBtn = listItem.querySelector(".todo-app__button_edit");
    const isEditMode = listItem.classList.contains("todo-app__item_edit-mode");

    if (isEditMode) {
        const newText = editInput.value.trim();
        if (newText) {
            const oldText = label.textContent;
            label.textContent = newText;
            updateTaskInStorage(oldText, newText);
            showNotification("Task updated successfully!", "success");
        } else {
            showNotification("Task cannot be empty", "error");
            editInput.focus();
            return;
        }
        editBtn.textContent = "Edit";
    } else {
        editInput.value = label.textContent;
        editBtn.textContent = "Save";
        editInput.focus();
    }

    listItem.classList.toggle("todo-app__item_edit-mode");
}

function updateTaskInStorage(oldText, newText) {
    const incompleteIndex = tasks.incomplete.indexOf(oldText);
    if (incompleteIndex !== -1) {
        tasks.incomplete[incompleteIndex] = newText;
    }

    const completedIndex = tasks.completed.indexOf(oldText);
    if (completedIndex !== -1) {
        tasks.completed[completedIndex] = newText;
    }

    saveTasks();
}

function deleteTask() {
    const listItem = this.parentNode;
    const label = listItem.querySelector(".todo-app__task-label");
    const ul = listItem.parentNode;

    listItem.style.transform = 'translateX(-100%)';
    listItem.style.opacity = '0';
    listItem.style.transition = 'all 0.3s ease';

    setTimeout(() => {
        const taskText = label.textContent;
        if (ul.id === 'incomplete-tasks') {
            tasks.incomplete = tasks.incomplete.filter(task => task !== taskText);
        } else {
            tasks.completed = tasks.completed.filter(task => task !== taskText);
        }
        saveTasks();

        ul.removeChild(listItem);
        updateEmptyStates();
        showNotification("Task deleted", "info");
    }, 300);
}

function taskCompleted() {
    const listItem = this.parentNode;
    const label = listItem.querySelector(".todo-app__task-label");
    const taskText = label.textContent;

    listItem.style.transform = 'translateY(-10px)';
    listItem.style.opacity = '0.5';

    setTimeout(() => {
        label.classList.add("todo-app__task-label_completed");
        completedTasksHolder.appendChild(listItem);

        tasks.incomplete = tasks.incomplete.filter(task => task !== taskText);
        tasks.completed.push(taskText);
        saveTasks();

        listItem.style.transform = '';
        listItem.style.opacity = '';

        bindTaskEvents(listItem, taskIncomplete);
        updateEmptyStates();
        applyFilter('all');
        showNotification("Task completed! 🎉", "success");
    }, 200);
}

function taskIncomplete() {
    const listItem = this.parentNode;
    const label = listItem.querySelector(".todo-app__task-label");
    const taskText = label.textContent;

    listItem.style.transform = 'translateY(10px)';
    listItem.style.opacity = '0.5';

    setTimeout(() => {
        label.classList.remove("todo-app__task-label_completed");
        incompleteTaskHolder.appendChild(listItem);

        tasks.completed = tasks.completed.filter(task => task !== taskText);
        tasks.incomplete.push(taskText);
        saveTasks();

        listItem.style.transform = '';
        listItem.style.opacity = '';

        bindTaskEvents(listItem, taskCompleted);
        updateEmptyStates();
        applyFilter('all');
        showNotification("Task moved back to todo", "info");
    }, 200);
}

function applyFilter(filterType) {
    const allItems = document.querySelectorAll('.todo-app__item:not(.todo-app__empty)');

    filterButtons.forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.querySelector(`[data-filter="${filterType}"]`);
    if (activeBtn) activeBtn.classList.add('active');

    allItems.forEach(function (item) {
        const isCompleted = item.querySelector('.todo-app__task-label_completed');
        const parentId = item.parentNode.id;

        switch (filterType) {
            case 'all':
                item.style.display = 'flex';
                break;
            case 'completed':
                item.style.display = isCompleted ? 'flex' : 'none';
                break;
            case 'incomplete':
                item.style.display = !isCompleted ? 'flex' : 'none';
                break;
        }
    });

    const emptyMessages = document.querySelectorAll('.todo-app__empty');
    emptyMessages.forEach(msg => {
        msg.style.display = filterType === 'all' ? 'block' : 'none';
    });
}

function toggleBurgerMenu() {
    navBurger.classList.toggle('active');
    navMenu.classList.toggle('active');
    menuOverlay.classList.toggle('active');
    body.classList.toggle('menu-open');

    if (body.classList.contains('menu-open')) {
        body.style.overflow = 'hidden';
    } else {
        body.style.overflow = '';
    }
}

function closeMenuOnClickOutside(event) {
    if (window.innerWidth <= 768) {
        if (navMenu.classList.contains('active') &&
            !navMenu.contains(event.target) &&
            !navBurger.contains(event.target)) {
            toggleBurgerMenu();
        }
    }
}

function closeMenu() {
    if (window.innerWidth <= 768 && navMenu.classList.contains('active')) {
        toggleBurgerMenu();
    }
}

function setupSmoothScrolling() {
    document.querySelectorAll('.nav__link').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const headerHeight = document.querySelector('.nav').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                closeMenu();
            }
        });
    });
}

function bindTaskEvents(taskListItem, checkBoxEventHandler) {
    const checkBox = taskListItem.querySelector(".todo-app__checkbox");
    const editButton = taskListItem.querySelector(".todo-app__button_edit");
    const deleteButton = taskListItem.querySelector(".todo-app__button_delete");
    const label = taskListItem.querySelector(".todo-app__task-label");

    editButton.onclick = editTask;
    deleteButton.onclick = deleteTask;
    checkBox.onchange = checkBoxEventHandler;

    label.addEventListener('click', function () {
        checkBox.checked = !checkBox.checked;
        checkBox.dispatchEvent(new Event('change'));
    });

    const editInput = taskListItem.querySelector(".todo-app__task-input");
    editInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            editButton.click();
        }
    });
}

function setupEventListeners() {
    addButton.onclick = addTask;
    taskInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') addTask();
    });

    filterButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            applyFilter(this.dataset.filter);
        });
    });

    navBurger.addEventListener('click', toggleBurgerMenu);
    menuOverlay.addEventListener('click', toggleBurgerMenu);
    document.addEventListener('click', closeMenuOnClickOutside);
    document.addEventListener('touchstart', closeMenuOnClickOutside);
    window.addEventListener('resize', function () {
        if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
            toggleBurgerMenu();
        }

        const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
        applyFilter(activeFilter);
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            toggleBurgerMenu();
        }
    });
}

function showNotification(message, type = 'info') {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 2000;
        animation: slideIn 0.3s ease-out;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;

    const colors = {
        success: '#28a745',
        error: '#dc3545',
        info: '#17a2b8',
        warning: '#ffc107'
    };

    notification.style.backgroundColor = colors[type] || colors.info;

    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        notification.style.opacity = '0';
        notification.style.transition = 'all 0.3s ease';

        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

document.addEventListener('DOMContentLoaded', init);