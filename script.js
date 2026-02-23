let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let streak = localStorage.getItem("streak") || 0;

function saveData() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("streak", streak);
}

function renderTasks() {
    const list = document.getElementById("taskList");
    list.innerHTML = "";

    tasks.forEach((task, index) => {
        let li = document.createElement("li");
        li.textContent = task.text;

        if (task.completed) {
            li.classList.add("completed");
        }

        li.onclick = () => {
            tasks[index].completed = !tasks[index].completed;
            checkStreak();
            saveData();
            renderTasks();
        };

        list.appendChild(li);
    });

    document.getElementById("streakDisplay").textContent = 
        "Streak: " + streak + " days";
}

function addTask() {
    const input = document.getElementById("taskInput");
    if (input.value === "") return;

    tasks.push({ text: input.value, completed: false });
    input.value = "";
    saveData();
    renderTasks();
}

function checkStreak() {
    if (tasks.every(task => task.completed)) {
        streak++;
    }
}

renderTasks();