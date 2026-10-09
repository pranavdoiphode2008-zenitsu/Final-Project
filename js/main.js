/* =========================================================
   DAILYROUTINE MAIN JAVASCRIPT
========================================================= */


document.addEventListener("DOMContentLoaded", function () {


    /* =====================================================
       PAGE LOADER
    ===================================================== */

    const loader =
        document.getElementById("pageLoader");

    setTimeout(function () {

        if (loader) {

            loader.classList.add("hidden");

        }

    }, 700);



    /* =====================================================
       MOBILE MENU
    ===================================================== */

    const mobileButton =
        document.getElementById("mobileMenuButton");

    const mobileMenu =
        document.getElementById("mobileMenu");


    if (mobileButton) {

        mobileButton.addEventListener(
            "click",
            function () {

                mobileMenu.classList.toggle("open");

            }
        );

    }


    /* Close mobile menu */

    if (mobileMenu) {

        mobileMenu
            .querySelectorAll("a")
            .forEach(function (link) {

                link.addEventListener(
                    "click",
                    function () {

                        mobileMenu.classList.remove("open");

                    }
                );

            });

    }



    /* =====================================================
       DARK / LIGHT MODE
    ===================================================== */

    const themeButton =
        document.getElementById("themeButton");


    const savedTheme =
        localStorage.getItem("dailyRoutineTheme");


    if (savedTheme === "light") {

        document.body.classList.add("light");

        if (themeButton) {

            themeButton.textContent = "☀";

        }

    }


    if (themeButton) {

        themeButton.addEventListener(
            "click",
            function () {

                document.body.classList.toggle("light");


                const isLight =
                    document.body.classList.contains("light");


                localStorage.setItem(
                    "dailyRoutineTheme",
                    isLight ? "light" : "dark"
                );


                themeButton.textContent =
                    isLight ? "☀" : "☾";

            }
        );

    }



    /* =====================================================
       DEMO MODAL
    ===================================================== */

    const demoButton =
        document.getElementById("demoButton");

    const demoModal =
        document.getElementById("demoModal");

    const closeDemo =
        document.getElementById("closeDemo");


    if (demoButton) {

        demoButton.addEventListener(
            "click",
            function () {

                demoModal.classList.add("show");

                document.body.style.overflow =
                    "hidden";

            }
        );

    }


    function closeModal() {

        if (!demoModal) return;

        demoModal.classList.remove("show");

        document.body.style.overflow =
            "";

    }


    if (closeDemo) {

        closeDemo.addEventListener(
            "click",
            closeModal
        );

    }


    if (demoModal) {

        demoModal.addEventListener(
            "click",
            function (event) {

                if (
                    event.target === demoModal
                ) {

                    closeModal();

                }

            }
        );

    }



    /* =====================================================
       AI GENERATOR
    ===================================================== */

    const generateButton =
        document.getElementById("generatePlan");

    const aiOutput =
        document.getElementById("aiOutput");


    if (generateButton) {

        generateButton.addEventListener(
            "click",
            function () {

                generateButton.disabled = true;

                generateButton.innerHTML =
                    "Synthesizing routine...";


                aiOutput.classList.add(
                    "generating"
                );


                setTimeout(function () {

                    aiOutput.innerHTML = `

                        <div class="ai-line">
                            <span class="terminal-plus">+</span>
                            05:45 Wake, no phone · 10m
                        </div>

                        <div class="ai-line">
                            <span class="terminal-plus">+</span>
                            05:55 Cold shower + water · 15m
                        </div>

                        <div class="ai-line">
                            <span class="terminal-plus">+</span>
                            06:10 Journal top 3 goals · 15m
                        </div>

                        <div class="ai-line">
                            <span class="terminal-plus">+</span>
                            06:30 Deep work sprint · 90m
                        </div>

                        <div class="ai-line">
                            <span class="terminal-plus">+</span>
                            08:00 Workout · 45m
                        </div>

                        <div class="ai-line">
                            <span class="terminal-plus">+</span>
                            09:00 Breakfast + planning · 30m
                        </div>

                    `;


                    generateButton.disabled =
                        false;

                    generateButton.innerHTML =
                        "Generate my routine ✦";

                    aiOutput.classList.remove(
                        "generating"
                    );

                }, 1200);

            }
        );

    }



    /* =====================================================
       NAVBAR SCROLL EFFECT
    ===================================================== */

    const navbar =
        document.querySelector(".navbar");


    window.addEventListener(
        "scroll",
        function () {

            if (window.scrollY > 40) {

                navbar.classList.add(
                    "scrolled"
                );

            } else {

                navbar.classList.remove(
                    "scrolled"
                );

            }

        }
    );


});

/* =========================================================
   ROUTINE TASK INTERACTION
========================================================= */

function toggleRoutineTask(button) {

    const task =
        button.closest(".terminal-task");


    const wasCompleted =
        task.classList.contains("completed");


    if (wasCompleted) {

        task.classList.remove(
            "completed"
        );

        button.classList.remove(
            "checked"
        );

        button.innerHTML = "";


    } else {

        task.classList.add(
            "completed"
        );

        button.classList.add(
            "checked"
        );

        button.innerHTML = "✓";

    }


    updateRoutineProgress();

}



function updateRoutineProgress() {

    const tasks =
        document.querySelectorAll(
            ".terminal-task"
        );


    const completedTasks =
        document.querySelectorAll(
            ".terminal-task.completed"
        );


    const total =
        tasks.length;


    const completed =
        completedTasks.length;


    const percentage =
        Math.round(
            (completed / total) * 100
        );


    const percentElement =
        document.getElementById(
            "progressPercent"
        );


    const countElement =
        document.getElementById(
            "completedCount"
        );


    const ring =
        document.getElementById(
            "progressRing"
        );


    if (percentElement) {

        percentElement.textContent =
            percentage + "%";

    }


    if (countElement) {

        countElement.textContent =
            completed;

    }


    if (ring) {

        const circumference =
            264;


        const offset =
            circumference -
            (percentage / 100) *
            circumference;


        ring.style.strokeDashoffset =
            offset;

    }

}