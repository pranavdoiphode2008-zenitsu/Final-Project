/* =========================================================
   DAILY ROUTINE - ROUTINE JS
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const taskContainer =
        document.getElementById("taskList");

    if (!taskContainer) {
        return;
    }


    /* =====================================================
       LOAD TASKS
    ===================================================== */

    let tasks = JSON.parse(
        localStorage.getItem("routineTasks")
    ) || [];


    /* =====================================================
       ADD DEFAULT TASKS IF EMPTY
    ===================================================== */

    if (tasks.length === 0) {

        tasks = [

            {
                id: Date.now() + 1,
                title: "Wake Up",
                time: "06:30",
                description: "",
                completed: false
            },

            {
                id: Date.now() + 2,
                title: "Breakfast",
                time: "08:00",
                description: "",
                completed: false
            },

            {
                id: Date.now() + 3,
                title: "College / School",
                time: "09:00",
                description: "",
                completed: false
            },

            {
                id: Date.now() + 4,
                title: "Lunch",
                time: "13:00",
                description: "",
                completed: false
            },

            {
                id: Date.now() + 5,
                title: "Study",
                time: "16:00",
                description: "",
                completed: false
            },

            {
                id: Date.now() + 6,
                title: "Exercise",
                time: "18:00",
                description: "",
                completed: false
            },

            {
                id: Date.now() + 7,
                title: "Homework",
                time: "19:30",
                description: "",
                completed: false
            },

            {
                id: Date.now() + 8,
                title: "Dinner",
                time: "21:00",
                description: "",
                completed: false
            },

            {
                id: Date.now() + 9,
                title: "Sleep",
                time: "22:30",
                description: "",
                completed: false
            }

        ];

        saveTasks();

    }


    let currentFilter = "all";


    renderTasks();
    updateStats();


    /* =====================================================
       ADD TASK BUTTON
    ===================================================== */

    const addTaskButton =
        document.getElementById("addTaskButton");

    const addTaskModal =
        document.getElementById("addTaskModal");


    if (addTaskButton && addTaskModal) {

        addTaskButton.addEventListener("click", () => {

            addTaskModal.classList.add("active");

        });

    }


    /* =====================================================
       CLOSE MODAL
    ===================================================== */

    document
        .querySelectorAll("[data-close-modal]")
        .forEach(button => {

            button.addEventListener("click", () => {

                addTaskModal?.classList.remove("active");

            });

        });


    /* =====================================================
       ADD TASK FORM
    ===================================================== */

    const addTaskForm =
        document.getElementById("addTaskForm");

    if (addTaskForm) {

        addTaskForm.addEventListener("submit", event => {

            event.preventDefault();


            const title =
                document.getElementById("taskTitle")?.value.trim();

            const time =
                document.getElementById("taskTime")?.value;

            const description =
                document
                    .getElementById("taskDescription")
                    ?.value.trim();


            if (!title) {

                showToast(
                    "Please enter a task name.",
                    "error"
                );

                return;

            }


            const newTask = {

                id: Date.now(),

                title: title,

                time: time || "Anytime",

                description: description || "",

                completed: false

            };


            tasks.push(newTask);

            saveTasks();

            renderTasks();

            updateStats();

            addTaskForm.reset();

            addTaskModal?.classList.remove("active");


            showToast(
                "Task added successfully!",
                "success"
            );

        });

    }


    /* =====================================================
       FILTER BUTTONS
    ===================================================== */

    document
        .querySelectorAll("[data-filter]")
        .forEach(button => {

            button.addEventListener("click", () => {

                document
                    .querySelectorAll("[data-filter]")
                    .forEach(btn =>
                        btn.classList.remove("active")
                    );

                button.classList.add("active");

                currentFilter =
                    button.dataset.filter;

                renderTasks();

            });

        });


    /* =====================================================
       RENDER TASKS
    ===================================================== */

    function renderTasks() {

        taskContainer.innerHTML = "";


        let filteredTasks = tasks;


        if (currentFilter === "pending") {

            filteredTasks =
                tasks.filter(task =>
                    !task.completed
                );

        }


        if (currentFilter === "completed") {

            filteredTasks =
                tasks.filter(task =>
                    task.completed
                );

        }


        if (filteredTasks.length === 0) {

            taskContainer.innerHTML = `

                <div class="empty-state">

                    <div class="empty-icon">
                        📋
                    </div>

                    <h3>
                        No tasks found
                    </h3>

                    <p>
                        Add a task to start planning your day.
                    </p>

                </div>

            `;

            return;

        }


        filteredTasks.forEach(task => {

            const item =
                document.createElement("div");

            item.className =
                `routine-task ${
                    task.completed ? "completed" : ""
                }`;


            item.innerHTML = `

                <div class="task-left">

                    <label class="task-check">

                        <input
                            type="checkbox"
                            data-task-id="${task.id}"
                            ${task.completed ? "checked" : ""}
                        >

                        <span class="custom-checkbox"></span>

                    </label>

                    <div class="routine-task-info">

                        <h3>
                            ${escapeHTML(task.title)}
                        </h3>

                        <span class="task-time">
                            🕐 ${escapeHTML(task.time)}
                        </span>

                        ${
                            task.description
                                ? `<p>${escapeHTML(
                                    task.description
                                )}</p>`
                                : ""
                        }

                    </div>

                </div>


                <button
                    class="delete-task"
                    data-delete-id="${task.id}"
                    title="Delete task"
                >
                    🗑️
                </button>

            `;


            taskContainer.appendChild(item);

        });


        /* =================================================
           CHECKBOX EVENTS
        ================================================= */

        taskContainer
            .querySelectorAll(
                "input[type='checkbox']"
            )
            .forEach(input => {

                input.addEventListener("change", () => {

                    const id =
                        Number(input.dataset.taskId);

                    const task =
                        tasks.find(
                            task => task.id === id
                        );

                    if (task) {

                        task.completed =
                            input.checked;

                    }

                    saveTasks();

                    renderTasks();

                    updateStats();

                });

            });


        /* =================================================
           DELETE EVENTS
        ================================================= */

        taskContainer
            .querySelectorAll("[data-delete-id]")
            .forEach(button => {

                button.addEventListener("click", () => {

                    const id =
                        Number(button.dataset.deleteId);


                    const confirmed =
                        confirm(
                            "Delete this task?"
                        );


                    if (!confirmed) {
                        return;
                    }


                    tasks =
                        tasks.filter(
                            task => task.id !== id
                        );


                    saveTasks();

                    renderTasks();

                    updateStats();


                    showToast(
                        "Task deleted.",
                        "success"
                    );

                });

            });

    }


    /* =====================================================
       STATISTICS
    ===================================================== */

    function updateStats() {

        const total =
            tasks.length;

        const completed =
            tasks.filter(
                task => task.completed
            ).length;

        const pending =
            total - completed;


        const percentage =
            total === 0
                ? 0
                : Math.round(
                    completed / total * 100
                );


        setText(
            "totalTasks",
            total
        );

        setText(
            "completedTasks",
            completed
        );

        setText(
            "pendingTasks",
            pending
        );

        setText(
            "completionPercentage",
            `${percentage}%`
        );

    }


    /* =====================================================
       SAVE
    ===================================================== */

    function saveTasks() {

        localStorage.setItem(
            "routineTasks",
            JSON.stringify(tasks)
        );

    }


    /* =====================================================
       SET TEXT
    ===================================================== */

    function setText(id, value) {

        const element =
            document.getElementById(id);

        if (element) {
            element.textContent = value;
        }

    }

});