// ===============================
// Global Variables
// ===============================

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];    
let quickLinks = JSON.parse(localStorage.getItem("quickLinks")) || [
    {
        name: "Google",
        url: "https://www.google.com"
    },
    {
        name: "GitHub",
        url: "https://github.com"
    },
    {
        name: "Gmail",
        url: "https://mail.google.com"
    },
    {
        name: "Dicoding",
        url: "https://www.dicoding.com"
    }
];
let timer;
let timeLeft = 25 * 60;
let isRunning = false;

// ===============================
// Date & Time
// ===============================

function updateDateTime() {
    const now = new Date();

    document.getElementById("clock").textContent =
        now.toLocaleTimeString("en-US", {
            hour12: false
        });

    document.getElementById("current-date").textContent =
        now.toLocaleDateString("en-US", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });
}

updateDateTime();
setInterval(updateDateTime, 1000);

// ===============================
// Greeting
// ===============================

function updateGreeting() {

    let userName = localStorage.getItem("userName");

    if (!userName) {

        userName = prompt("Enter your name");

        if (!userName || userName.trim() === "") {
            userName = "User";
        }

        localStorage.setItem("userName", userName);
    }

    const hour = new Date().getHours();

    let greeting = "";

    if (hour < 12) {
        greeting = "Good Morning";
    }
    else if (hour < 18) {
        greeting = "Good Afternoon";
    }
    else {
        greeting = "Good Evening";
    }

    document.getElementById("greeting").textContent =
        `${greeting}, ${userName}`;

}

updateGreeting();

// ===============================
// Change Name
// ===============================

function changeUserName() {

    const currentName = localStorage.getItem("userName");

    const newName = prompt("Edit your name", currentName);

    if (newName && newName.trim() !== "") {

        localStorage.setItem("userName", newName.trim());

        updateGreeting();
    }

}

// ===============================
// Dark Mode
// ===============================

function loadTheme(){

    const theme = localStorage.getItem("theme");

    if(theme === "dark"){

        document.body.classList.add("dark");

        document.getElementById("theme-btn").textContent="☀️";

    }

}

function toggleTheme(){

    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){

        localStorage.setItem("theme","dark");

        document.getElementById("theme-btn").textContent="☀️";

    }else{

        localStorage.setItem("theme","light");

        document.getElementById("theme-btn").textContent="🌙";

    }

}

// ===============================
// Focus Timer
// ===============================

function updateTimerDisplay() {

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    document.getElementById("timer-display").textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

}

function startTimer() {

    if (isRunning) return;

    isRunning = true;

    timer = setInterval(() => {

        if (timeLeft > 0) {

            timeLeft--;

            updateTimerDisplay();

        } else {

            clearInterval(timer);

            isRunning = false;

            alert("Time's up!");

        }

    }, 1000);

}

function stopTimer() {

    clearInterval(timer);

    isRunning = false;

}

function resetTimer() {

    clearInterval(timer);

    isRunning = false;

    timeLeft = 25 * 60;

    updateTimerDisplay();

}

// ===============================
// Todo List
// ===============================

function saveTasks() {

    localStorage.setItem("tasks", JSON.stringify(tasks));

}

function renderTasks() {

    const taskList = document.getElementById("task-list");

    taskList.innerHTML = "";

    tasks.forEach((task, index) => {

        const li = document.createElement("li");

        li.innerHTML = `

            <div class="task-left">

                <input
                    type="checkbox"
                    ${task.completed ? "checked" : ""}
                >

                <span
                    style="
                    text-decoration:${task.completed ? "line-through" : "none"};
                    ">
                    ${task.text}
                </span>

            </div>

            <div class="task-right">

                <button onclick="editTask(${index})">
                    Edit
                </button>

                <button onclick="deleteTask(${index})">
                    Delete
                </button>

            </div>

        `;

        li.querySelector("input").addEventListener("change", () => {

            task.completed = !task.completed;

            saveTasks();

            renderTasks();

        });

        taskList.appendChild(li);

    });

}

function addTask() {

    const input = document.getElementById("task-input");

    const text = input.value.trim();

    if (text === "") {

        alert("Please enter a task.");

        return;

    }

    const duplicate = tasks.some(task =>
        task.text.toLowerCase() === text.toLowerCase()
    );

    if (duplicate) {

        alert("Task already exists.");

        return;

    }

    tasks.push({

        text: text,

        completed: false

    });

    saveTasks();

    renderTasks();

    input.value = "";

}

function editTask(index) {

    const newTask = prompt(
        "Edit task",
        tasks[index].text
    );

    if (newTask && newTask.trim() !== "") {

        tasks[index].text = newTask.trim();

        saveTasks();

        renderTasks();

    }

}

function deleteTask(index) {

    tasks.splice(index, 1);

    saveTasks();

    renderTasks();

}

// ===============================
// Quick Links
// ===============================

function saveLinks() {

    localStorage.setItem(
        "quickLinks",
        JSON.stringify(quickLinks)
    );

}

function renderLinks() {

    const container = document.getElementById("quick-links");

    container.innerHTML = "";

    quickLinks.forEach((link, index) => {

        const div = document.createElement("div");

        div.className = "quick-link-item";

        div.innerHTML = `
            <a href="${link.url}" target="_blank">
                🌐 ${link.name}
            </a>

            <button onclick="deleteLink(${index})">
                🗑️
            </button>
        `;

        container.appendChild(div);

    });

}

function addLink() {

    const name =
        document.getElementById("link-name");

    const url =
        document.getElementById("link-url");

    const linkName = name.value.trim();

    const linkUrl = url.value.trim();

    if (linkName === "" || linkUrl === "") {

        alert("Please fill in all fields.");

        return;

    }

    quickLinks.push({

        name: linkName,

        url: linkUrl

    });

    saveLinks();

    renderLinks();

    name.value = "";

    url.value = "";

}

function deleteLink(index) {

    if (confirm("Delete this link?")) {

        quickLinks.splice(index, 1);

        saveLinks();

        renderLinks();

    }

}

// ===============================
// Event
// ===============================

document
    .getElementById("add-task-btn")
    .addEventListener("click", addTask);

document
    .getElementById("change-name-btn")
    .addEventListener("click", changeUserName);

document
    .getElementById("start-btn")
    .addEventListener("click", startTimer);

document
    .getElementById("stop-btn")
    .addEventListener("click", stopTimer);

document
    .getElementById("reset-btn")
    .addEventListener("click", resetTimer);

document
    .getElementById("add-link-btn")
    .addEventListener("click", addLink);

document
    .getElementById("theme-btn")
    .addEventListener("click",toggleTheme);

document
    .getElementById("task-input")
    .addEventListener("keypress", function (event) {

        if (event.key === "Enter") {
            addTask();
        }

    });

document
    .getElementById("link-url")
    .addEventListener("keypress", function (event) {

        if (event.key === "Enter") {
            addLink();
        }

    });

renderTasks();
renderLinks();
updateTimerDisplay();
loadTheme();    