const newTaskInput = document.getElementById("new-task-input");
const addTaskBtn = document.getElementById("add-task-btn");
const taskList = document.getElementById("task-list");

const deleteConfirmModal = document.getElementById("deleteConfirmModal");
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");

let currentDeleteIndex = -1; // To store the index of the task to be deleted

let tasks = [];

function loadTasks() {
  try {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      tasks = JSON.parse(storedTasks);
    } else {
      tasks = [];
    }
  } catch (e) {
    console.error("Error loading tasks from localStorage:", e);
    tasks = []; // Fallback to empty array on error
  }
}

function saveTasks() {
  try {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  } catch (e) {
    console.error("Error saving tasks to localStorage:", e);
  }
}

function renderTasks() {
  taskList.innerHTML = "";

  if (tasks.length === 0) {
    taskList.innerHTML =
      '<p class="text-center text-muted mt-3 mb-0 fs-5">No tasks yet! Add one above.</p>';
    return;
  }

  tasks.forEach((task, index) => {
    const taskItem = document.createElement("li");
    taskItem.className = `list-group-item d-flex align-items-center justify-content-between ${
      task.completed ? "completed" : ""
    }`;
    taskItem.dataset.index = index;

    // Create task text span
    const taskText = document.createElement("span");
    taskText.className = "task-text";
    taskText.textContent = task.text;

    // Create actions div for buttons
    const taskActions = document.createElement("div");
    taskActions.className = "task-actions d-flex align-items-center";

    // Create complete button
    const completeBtn = document.createElement("button");
    completeBtn.className = `btn btn-sm ${
      task.completed ? "btn-warning" : "btn-success"
    }`;
    completeBtn.textContent = task.completed ? "Unmark" : "Complete";
    completeBtn.addEventListener("click", () => toggleTaskComplete(index));

    // Create delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn btn-sm btn-danger ms-2";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => showDeleteConfirmation(index));

    // Append elements
    taskActions.appendChild(completeBtn);
    taskActions.appendChild(deleteBtn);
    taskItem.appendChild(taskText);
    taskItem.appendChild(taskActions);
    taskList.appendChild(taskItem);
  });
}

function addTask() {
  const taskText = newTaskInput.value.trim();

  if (taskText !== "") {
    tasks.push({ text: taskText, completed: false });
    newTaskInput.value = "";
    saveTasks();
    renderTasks();
  }
}

function toggleTaskComplete(index) {
  if (index >= 0 && index < tasks.length) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
  }
}

function showDeleteConfirmation(index) {
  currentDeleteIndex = index;
  deleteConfirmModal.classList.add("show");
}

function hideDeleteConfirmation() {
  deleteConfirmModal.classList.remove("show");
  currentDeleteIndex = -1;
}

function confirmAndDeleteTask() {
  if (
    currentDeleteIndex !== -1 &&
    currentDeleteIndex >= 0 &&
    currentDeleteIndex < tasks.length
  ) {
    tasks.splice(currentDeleteIndex, 1);
    saveTasks();
    renderTasks();
  }
  hideDeleteConfirmation(); // Always hide the modal after action
}

// Event Listeners
addTaskBtn.addEventListener("click", addTask);
newTaskInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    addTask();
  }
});

// Modal button event listeners
confirmDeleteBtn.addEventListener("click", confirmAndDeleteTask);
cancelDeleteBtn.addEventListener("click", hideDeleteConfirmation);

// Initialize the app when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  loadTasks();
  renderTasks();
});
