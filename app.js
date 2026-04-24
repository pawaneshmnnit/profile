// ---------------- CONFIG ----------------
const state = {
    lang: localStorage.getItem("lang") || "en"
};

// ---------------- THEME ----------------
const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
};

// ---------------- LANGUAGE ----------------
const translations = {
    en: { name: "Pawanesh Kumar Vishwakarma" },
    hi: { name: "पवनेश कुमार विश्वकर्मा" }
};

function applyLanguage() {
    document.querySelectorAll("[data-key]").forEach(el => {
        const key = el.dataset.key;
        el.textContent = translations[state.lang][key] || key;
    });
}

// ---------------- NAV ----------------
document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        document.querySelectorAll(".section").forEach(sec => {
            sec.classList.add("hidden");
        });

        document.getElementById(btn.dataset.target).classList.remove("hidden");
    });
});

// ---------------- DROPDOWN ----------------
const langBtn = document.getElementById("lang-btn");
const langMenu = document.getElementById("lang-menu");

langBtn.addEventListener("click", () => {
    langMenu.classList.toggle("open");
});

document.querySelectorAll("[data-lang]").forEach(btn => {
    btn.addEventListener("click", (e) => {
        state.lang = e.target.dataset.lang;
        localStorage.setItem("lang", state.lang);
        applyLanguage();
        langMenu.classList.remove("open");
    });
});

// ---------------- THEME ----------------
document.getElementById("theme-toggle").addEventListener("click", toggleTheme);

// ---------------- DATA LOADER ----------------
async function loadData() {
    try {
        const res = await fetch("site-data.json");

        if (!res.ok) throw new Error("Failed to load JSON");

        const data = await res.json();

        // ABOUT
        document.getElementById("about-text").textContent =
            data.about[state.lang] || "No data";

        // SKILLS
        const skillsDiv = document.getElementById("skills-container");
        skillsDiv.innerHTML = "";

        data.skills.forEach(s => {
            const el = document.createElement("span");
            el.textContent = s;
            el.className = "bg-blue-100 px-2 py-1 rounded m-1 inline-block";
            skillsDiv.appendChild(el);
        });

        // PUBLICATIONS
        const pubDiv = document.getElementById("pub-container");
        pubDiv.innerHTML = "";

        data.publications.forEach(p => {
            const el = document.createElement("div");
            el.textContent = p;
            el.className = "border p-2 rounded mb-2";
            pubDiv.appendChild(el);
        });

    } catch (err) {
        console.error(err);

        document.querySelectorAll(".loader").forEach(el => {
            el.textContent = "Failed to load data";
        });
    }
}

// ---------------- INIT ----------------
applyLanguage();
loadData();
