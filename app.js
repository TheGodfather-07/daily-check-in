let data = JSON.parse(localStorage.getItem("habitData")) || {
    habits: [],
    streak: 0,
    longest: 0,
    history: {},
    lastDate: null
};

const today = new Date().toISOString().split("T")[0];

const quotes = [
    "Discipline builds empires.",
    "Consistency beats motivation.",
    "Small wins compound.",
    "Momentum rising.",
    "Execution > excuses.",
    "You’re becoming unstoppable."
];

if (data.lastDate !== today) {
    data.habits.forEach(h => h.done = false);

    if (data.lastDate) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yString = yesterday.toISOString().split("T")[0];

        if (!data.history[yString]) {
            data.streak = 0;
        }
    }

    data.lastDate = today;
}

function save() {
    localStorage.setItem("habitData", JSON.stringify(data));
}

function addHabit() {
    const input = document.getElementById("habitInput");
    if (!input.value) return;
    data.habits.push({ name: input.value, done: false });
    input.value = "";
    save();
    render();
}

function toggleHabit(i) {
    data.habits[i].done = !data.habits[i].done;
    updateProgress();
    save();
    render();
}

function updateProgress() {
    const completed = data.habits.filter(h => h.done).length;
    const percent = data.habits.length ? 
        Math.round((completed / data.habits.length) * 100) : 0;

    document.getElementById("progressFill").style.width = percent + "%";
    document.getElementById("progressText").innerText = percent + "%";

    if (percent === 100 && !data.history[today]) {
        data.history[today] = 1;
        data.streak++;
        if (data.streak > data.longest) data.longest = data.streak;
        showQuote();
    }

    document.getElementById("streak").innerText = data.streak;
    document.getElementById("longest").innerText = data.longest;
}

function showQuote() {
    const box = document.getElementById("quoteBox");
    const text = document.getElementById("quoteText");
    const random = quotes[Math.floor(Math.random() * quotes.length)];
    text.innerText = random;
    box.classList.remove("hidden");
}

function render() {
    const list = document.getElementById("habitList");
    list.innerHTML = "";
    data.habits.forEach((h, i) => {
        const li = document.createElement("li");
        li.innerHTML = `
            ${h.name}
            <input type="checkbox" ${h.done ? "checked" : ""}
            onclick="toggleHabit(${i})">
        `;
        list.appendChild(li);
    });
    updateProgress();
    renderHeatmap();
}

function renderHeatmap() {
    const heatmap = document.getElementById("heatmap");
    heatmap.innerHTML = "";
    const days = Object.keys(data.history).slice(-30);
    days.forEach(d => {
        const cell = document.createElement("div");
        cell.className = "cell";
        if (data.history[d]) cell.style.background = "#00f5ff";
        heatmap.appendChild(cell);
    });
}

function exportData() {
    const blob = new Blob([JSON.stringify(data)], {type: "application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "habit-backup.json";
    a.click();
}

function importData(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        data = JSON.parse(e.target.result);
        save();
        render();
    };
    reader.readAsText(file);
}

function toggleTheme() {
    document.body.classList.toggle("light");
}

render();
save();
