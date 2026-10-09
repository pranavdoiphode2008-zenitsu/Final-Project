/* =====================================================
   DAILYROUTINE DASHBOARD
===================================================== */


/* ================= DATA ================= */

const DEFAULT_DATA = {

    tasks: [
        {
            id: 1,
            title: "Wake up & hydrate",
            category: "health",
            start: "06:30",
            end: "06:45",
            notes: "500ml water, open blinds",
            completed: false
        },

        {
            id: 2,
            title: "Morning workout",
            category: "health",
            start: "06:45",
            end: "07:30",
            notes: "Strength or 5k run",
            completed: false
        },

        {
            id: 3,
            title: "Deep work block",
            category: "work",
            start: "08:00",
            end: "09:30",
            notes: "Phone in another room",
            completed: false
        },

        {
            id: 4,
            title: "Standup & inbox zero",
            category: "work",
            start: "09:45",
            end: "10:15",
            notes: "",
            completed: false
        },

        {
            id: 5,
            title: "Lunch & walk",
            category: "health",
            start: "12:30",
            end: "13:15",
            notes: "",
            completed: false
        },

        {
            id: 6,
            title: "Algorithm practice",
            category: "learning",
            start: "14:00",
            end: "15:00",
            notes: "2 problems, 1 review",
            completed: false
        },

        {
            id: 7,
            title: "Read / Study",
            category: "learning",
            start: "18:00",
            end: "19:00",
            notes: "MPSC preparation",
            completed: false
        },

        {
            id: 8,
            title: "Plan tomorrow",
            category: "personal",
            start: "21:30",
            end: "21:45",
            notes: "Prepare tomorrow's priorities",
            completed: false
        }
    ],

    habits: [
        {
            id: 1,
            name: "Drink 3L water",
            streak: 4,
            completed: false
        },

        {
            id: 2,
            name: "Meditate 10 min",
            streak: 7,
            completed: false
        },

        {
            id: 3,
            name: "Read 20 pages",
            streak: 3,
            completed: false
        },

        {
            id: 4,
            name: "No phone before 8 AM",
            streak: 2,
            completed: false
        }
    ],

    focusMinutes: 0,
    focusSessions: 0,
    streak: 0
};


let data = loadData();


/* ================= DOM ================= */

const timeline = document.getElementById("timeline");
const habitList = document.getElementById("habitList");

const progressRing = document.getElementById("progressRing");
const completionPercent = document.getElementById("completionPercent");
const completedBlocks = document.getElementById("completedBlocks");
const miniProgress = document.getElementById("miniProgress");

const plannedHours = document.getElementById("plannedHours");

const addBlockBtn = document.getElementById("addBlockBtn");
const addBlockModal = document.getElementById("addBlockModal");
const closeModal = document.getElementById("closeModal");

const addBlockForm = document.getElementById("addBlockForm");

const focusBtn = document.getElementById("focusBtn");
const focusNav = document.getElementById("focusNav");

const focusModal = document.getElementById("focusModal");
const closeFocusModal = document.getElementById("closeFocusModal");

const startFocus = document.getElementById("startFocus");
const resetFocus = document.getElementById("resetFocus");

const focusTimer = document.getElementById("focusTimer");

const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toastMessage");

const themeToggle = document.getElementById("themeToggle");

const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const sidebar = document.getElementById("sidebar");
const mobileOverlay = document.getElementById("mobileOverlay");

const logoutBtn = document.getElementById("logoutBtn");


/* ================= INIT ================= */

document.addEventListener("DOMContentLoaded", () => {

    loadUser();

    updateDate();

    updateClock();

    setInterval(updateClock, 1000);

    renderTasks();

    renderHabits();

    updateProgress();

    loadTheme();

});


/* =====================================================
   LOCAL STORAGE
===================================================== */

function loadData() {

    const saved = localStorage.getItem("dailyRoutineDashboard");

    if (saved) {

        try {

            return JSON.parse(saved);

        } catch (error) {

            console.log("Could not read saved data.");

        }

    }

    return structuredClone(DEFAULT_DATA);
}


function saveData() {

    localStorage.setItem(
        "dailyRoutineDashboard",
        JSON.stringify(data)
    );

}


/* =====================================================
   USER
===================================================== */

function loadUser() {

    let user = null;

    try {

        user = JSON.parse(
            localStorage.getItem("dr_user")
        );

    } catch (error) {

        user = null;

    }


    const name =
        user?.name ||
        user?.fullName ||
        "Alex Morgan";

    const email =
        user?.email ||
        "alex@example.com";


    const firstName =
        name.split(" ")[0];


    document.getElementById(
        "mainUserName"
    ).textContent = firstName;


    document.getElementById(
        "sidebarUserName"
    ).textContent = name;


    document.getElementById(
        "sidebarUserEmail"
    ).textContent = email;


    document.getElementById(
        "userAvatar"
    ).textContent =
        firstName.charAt(0).toUpperCase();

}


/* =====================================================
   DATE
===================================================== */

function updateDate() {

    const date = new Date();

    const options = {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric"
    };

    let formatted =
        date.toLocaleDateString(
            "en-US",
            options
        );

    formatted =
        formatted.toUpperCase();

    formatted =
        formatted.replace(",", " ·");

    document.getElementById(
        "currentDate"
    ).textContent = formatted;

}


/* =====================================================
   CLOCK
===================================================== */

function updateClock() {

    const now = new Date();

    const hours =
        String(now.getHours()).padStart(2, "0");

    const minutes =
        String(now.getMinutes()).padStart(2, "0");

    const seconds =
        String(now.getSeconds()).padStart(2, "0");


    document.getElementById(
        "liveClock"
    ).textContent =
        `${hours}:${minutes}:${seconds}`;

}


/* =====================================================
   GREETING
===================================================== */

function getGreeting() {

    const hour = new Date().getHours();

    if (hour < 12) {
        return "Good morning";
    }

    if (hour < 17) {
        return "Good afternoon";
    }

    return "Good evening";
}


function updateGreeting() {

    const greeting =
        getGreeting();

    const name =
        document.getElementById(
            "mainUserName"
        ).textContent;

    document.querySelector(
        ".page-header h1"
    ).innerHTML =
        `${greeting}, <span>${name}</span>`;

}

updateGreeting();


/* =====================================================
   TASKS
===================================================== */

function renderTasks() {

    timeline.innerHTML = "";

    const sortedTasks =
        [...data.tasks].sort(
            (a, b) =>
                timeToMinutes(a.start) -
                timeToMinutes(b.start)
        );


    sortedTasks.forEach(task => {

        const row =
            document.createElement("div");

        row.className =
            `timeline-row ${
                task.completed
                    ? "completed"
                    : ""
            }`;

        row.dataset.id = task.id;


        const duration =
            calculateDuration(
                task.start,
                task.end
            );


        row.innerHTML = `

            <div class="timeline-time">
                ${formatTime(task.start)}
            </div>


            <div class="timeline-content">

                <div
                    class="timeline-dot"
                ></div>

                <div class="timeline-title">
                    ${escapeHTML(task.title)}
                </div>

                <div class="timeline-meta">

                    <span
                        class="category-dot category-${task.category}"
                    ></span>

                    ${capitalize(task.category)}

                    <span>·</span>

                    ${formatTime(task.start)}
                    -
                    ${formatTime(task.end)}

                </div>

                ${
                    task.notes
                    ? `
                    <div class="timeline-note">
                        ${escapeHTML(task.notes)}
                    </div>
                    `
                    : ""
                }

                <button
                    class="timeline-check"
                    onclick="toggleTask(${task.id})"
                    title="Complete task"
                >
                    ✓
                </button>

            </div>


            <div class="timeline-duration">
                ${duration}m
            </div>

        `;


        timeline.appendChild(row);

    });


    updatePlannedHours();

}


/* =====================================================
   TOGGLE TASK
===================================================== */

function toggleTask(id) {

    const task =
        data.tasks.find(
            item => item.id === id
        );

    if (!task) return;

    task.completed =
        !task.completed;


    saveData();

    renderTasks();

    updateProgress();


    if (task.completed) {

        showToast(
            `"${task.title}" completed ✓`
        );

    }

}


/* =====================================================
   PROGRESS
===================================================== */

function updateProgress() {

    const total =
        data.tasks.length;

    const completed =
        data.tasks.filter(
            task => task.completed
        ).length;


    const percentage =
        total === 0
            ? 0
            : Math.round(
                (completed / total) * 100
            );


    completionPercent.textContent =
        `${percentage}%`;


    completedBlocks.textContent =
        `${completed} / ${total}`;


    miniProgress.style.width =
        `${percentage}%`;


    progressRing.style.setProperty(
        "--progress",
        `${percentage}%`
    );

}


/* =====================================================
   PLANNED HOURS
===================================================== */

function updatePlannedHours() {

    let totalMinutes = 0;

    data.tasks.forEach(task => {

        totalMinutes +=
            calculateDuration(
                task.start,
                task.end
            );

    });


    const hours =
        totalMinutes / 60;


    plannedHours.textContent =
        `${hours.toFixed(1)}h`;

}


/* =====================================================
   HABITS
===================================================== */

function renderHabits() {

    habitList.innerHTML = "";


    data.habits.forEach(habit => {

        const row =
            document.createElement("div");

        row.className =
            `habit-row ${
                habit.completed
                    ? "done"
                    : ""
            }`;


        row.innerHTML = `

            <button
                class="habit-check"
                onclick="toggleHabit(${habit.id})"
            >
                ✓
            </button>

            <span class="habit-name">
                ${escapeHTML(habit.name)}
            </span>

            <span class="habit-streak">
                ${habit.streak}d
            </span>

        `;


        habitList.appendChild(row);

    });

}


function toggleHabit(id) {

    const habit =
        data.habits.find(
            item => item.id === id
        );

    if (!habit) return;


    habit.completed =
        !habit.completed;


    if (habit.completed) {

        habit.streak++;

        showToast(
            `${habit.name} checked in ✓`
        );

    } else {

        habit.streak =
            Math.max(
                0,
                habit.streak - 1
            );

    }


    saveData();

    renderHabits();

}


/* =====================================================
   ADD BLOCK
===================================================== */

addBlockBtn.addEventListener(
    "click",
    () => {

        addBlockModal.classList.add(
            "show"
        );

    }
);


closeModal.addEventListener(
    "click",
    () => {

        addBlockModal.classList.remove(
            "show"
        );

    }
);


addBlockModal.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            addBlockModal
        ) {

            addBlockModal.classList.remove(
                "show"
            );

        }

    }
);


addBlockForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        const title =
            document.getElementById(
                "taskName"
            ).value.trim();


        const start =
            document.getElementById(
                "taskStart"
            ).value;


        const end =
            document.getElementById(
                "taskEnd"
            ).value;


        const category =
            document.getElementById(
                "taskCategory"
            ).value;


        const notes =
            document.getElementById(
                "taskNotes"
            ).value.trim();


        if (
            timeToMinutes(end) <=
            timeToMinutes(start)
        ) {

            showToast(
                "End time must be after start time."
            );

            return;

        }


        const newTask = {

            id: Date.now(),

            title,

            category,

            start,

            end,

            notes,

            completed: false

        };


        data.tasks.push(
            newTask
        );


        saveData();

        renderTasks();

        updateProgress();


        addBlockForm.reset();

        addBlockModal.classList.remove(
            "show"
        );


        showToast(
            "New block added ✓"
        );

    }
);


/* =====================================================
   FOCUS TIMER
===================================================== */

let focusSeconds = 25 * 60;

let focusInterval = null;

let focusRunning = false;


function updateFocusDisplay() {

    const minutes =
        Math.floor(
            focusSeconds / 60
        );

    const seconds =
        focusSeconds % 60;


    focusTimer.textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

}


function openFocus() {

    focusModal.classList.add(
        "show"
    );

}


focusBtn.addEventListener(
    "click",
    openFocus
);


focusNav.addEventListener(
    "click",
    openFocus
);


closeFocusModal.addEventListener(
    "click",
    () => {

        focusModal.classList.remove(
            "show"
        );

    }
);


startFocus.addEventListener(
    "click",
    () => {

        if (focusRunning) {

            clearInterval(
                focusInterval
            );

            focusRunning = false;

            startFocus.textContent =
                "Resume";

            return;

        }


        focusRunning = true;

        startFocus.textContent =
            "Pause";


        focusInterval =
            setInterval(() => {

                focusSeconds--;

                updateFocusDisplay();


                if (
                    focusSeconds <= 0
                ) {

                    clearInterval(
                        focusInterval
                    );

                    focusRunning =
                        false;

                    data.focusMinutes += 25;

                    data.focusSessions++;

                    saveData();

                    document.getElementById(
                        "focusMinutes"
                    ).textContent =
                        `${data.focusMinutes}m`;

                    document.getElementById(
                        "focusSessions"
                    ).textContent =
                        `${data.focusSessions} sessions`;

                    showToast(
                        "Focus session completed! 🎉"
                    );

                    resetFocusTimer();

                }

            }, 1000);

    }
);


resetFocus.addEventListener(
    "click",
    resetFocusTimer
);


function resetFocusTimer() {

    clearInterval(
        focusInterval
    );

    focusSeconds =
        25 * 60;

    focusRunning = false;

    startFocus.textContent =
        "Start";

    updateFocusDisplay();

}


updateFocusDisplay();


/* =====================================================
   THEME
===================================================== */

function loadTheme() {

    const theme =
        localStorage.getItem(
            "dailyRoutineTheme"
        );


    if (theme === "light") {

        document.body.classList.add(
            "light"
        );

        themeToggle.textContent =
            "☀";

    }

}


themeToggle.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "light"
        );


        const light =
            document.body.classList.contains(
                "light"
            );


        localStorage.setItem(
            "dailyRoutineTheme",
            light
                ? "light"
                : "dark"
        );


        themeToggle.textContent =
            light ? "☀" : "☾";

    }
);


/* =====================================================
   MOBILE MENU
===================================================== */

mobileMenuBtn.addEventListener(
    "click",
    () => {

        sidebar.classList.add(
            "open"
        );

        mobileOverlay.classList.add(
            "show"
        );

    }
);


mobileOverlay.addEventListener(
    "click",
    closeMobileMenu
);


function closeMobileMenu() {

    sidebar.classList.remove(
        "open"
    );

    mobileOverlay.classList.remove(
        "show"
    );

}


/* =====================================================
   LOGOUT
===================================================== */

logoutBtn.addEventListener(
    "click",
    () => {

        localStorage.removeItem(
            "dr_user"
        );

        localStorage.removeItem(
            "token"
        );

        window.location.href =
            "login.html";

    }
);


/* =====================================================
   HELPERS
===================================================== */

function timeToMinutes(time) {

    const [hours, minutes] =
        time.split(":").map(Number);

    return (
        hours * 60 +
        minutes
    );

}


function calculateDuration(
    start,
    end
) {

    return (
        timeToMinutes(end) -
        timeToMinutes(start)
    );

}


function formatTime(time) {

    const [hours, minutes] =
        time.split(":").map(Number);


    const suffix =
        hours >= 12
            ? "PM"
            : "AM";


    const h =
        hours % 12 || 12;


    return `${h}:${String(minutes).padStart(2, "0")} ${suffix}`;

}


function capitalize(value) {

    return value.charAt(0).toUpperCase() +
        value.slice(1);

}


function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value;

    return div.innerHTML;

}


/* =====================================================
   TOAST
===================================================== */

let toastTimeout;


function showToast(message) {

    toastMessage.textContent =
        message;

    toast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimeout
    );


    toastTimeout =
        setTimeout(() => {

            toast.classList.remove(
                "show"
            );

        }, 2500);

}


/* =====================================================
   INITIAL FOCUS DATA
===================================================== */

document.getElementById(
    "focusMinutes"
).textContent =
    `${data.focusMinutes}m`;


document.getElementById(
    "focusSessions"
).textContent =
    `${data.focusSessions} sessions`;


document.getElementById(
    "streakNumber"
).textContent =
    data.streak;