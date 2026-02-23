let data = JSON.parse(localStorage.getItem("habitData")) || {
    habits: [],
    streak: 0,
    longest: 0,
    history: {}
};

const today = new Date().toISOString().split('T')[0];

if (!data.history[today]) {
    data.habits.forEach(h => h.done = false);
    data.history[today] = 0;
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

function toggleHabit(index) {
    data.habits[index].done = !data.habits[index].done;
    updateProgress();
    save();
    render();
}

function updateProgress() {
    const completed = data.habits.filter(h => h.done).length;
    const percent = data.habits.length === 0 ? 0 : 
        Math.round((completed / data.habits.length) * 100);

    document.getElementById("progressFill").style.width = percent + "%";
    document.getElementById("progressText").innerText = percent + "% Complete";

    if (percent === 100 && data.history[today] === 0) {
        data.streak++;
        data.longest = Math.max(data.longest, data.streak);
        data.history[today] = 1;
    }

    document.getElementById("globalStreak").innerText = data.streak;
    document.getElementById("longestStreak").innerText = data.longest;
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
    const grid = document.getElementById("heatmapGrid");
    grid.innerHTML = "";
    Object.keys(data.history).slice(-30).forEach(date => {
        const cell = document.createElement("div");
        cell.className = "heatmap-cell";
        if (data.history[date] === 1)
            cell.style.background = "#00f5ff";
        grid.appendChild(cell);
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

render();
