document.body.classList.add("loaded");

let games = JSON.parse(localStorage.getItem("games")) || [];
let currentFilter = "all";

const grid = document.getElementById("gamesGrid");
const empty = document.getElementById("emptyState");
const modal = document.getElementById("addGameModal");

document.getElementById("openModalBtn").onclick = () => modal.classList.add("active");
document.getElementById("closeModalBtn").onclick = () => modal.classList.remove("active");

document.getElementById("addGameForm").onsubmit = e => {
    e.preventDefault();
    const f = new FormData(e.target);

    const game = {
        id: Date.now(),
        title: f.get("title"),
        genre: f.get("genre"),
        platform: f.get("platform"),
        status: f.get("status"),
        hours: Number(f.get("hours") || 0),
        rating: Number(f.get("rating") || 0)
    };

    games.unshift(game);
    save();
    e.target.reset();
    modal.classList.remove("active");
};

document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.onclick = () => {
        document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentFilter = btn.dataset.filter;
        render();
    };
});

function save() {
    localStorage.setItem("games", JSON.stringify(games));
    render();
}

function render() {
    const list = currentFilter === "all"
        ? games
        : games.filter(g => g.status === currentFilter);

    grid.innerHTML = "";
    empty.style.display = list.length ? "none" : "block";

    list.forEach(g => {
        const card = document.createElement("div");
        card.className = "game-card";
        card.innerHTML = `
            <h3>${g.title}</h3>
            <span class="badge">${g.status}</span>
            <p>${g.genre} • ${g.platform}</p>
            <p>⏱ ${g.hours} hrs | ⭐ ${g.rating}</p>
            <button onclick="removeGame(${g.id})">Delete</button>
        `;
        grid.appendChild(card);
    });

    updateStats();
}

function removeGame(id) {
    games = games.filter(g => g.id !== id);
    save();
}

function updateStats() {
    document.getElementById("totalGames").textContent = games.length;
    document.getElementById("completedGames").textContent =
        games.filter(g => g.status === "Completed").length;
    document.getElementById("totalHours").textContent =
        games.reduce((s, g) => s + g.hours, 0);
    document.getElementById("avgRating").textContent =
        games.length
            ? (games.reduce((s, g) => s + g.rating, 0) / games.length).toFixed(1)
            : 0;
}

render();
