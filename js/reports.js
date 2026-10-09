/* =========================================================
   DAILY ROUTINE - REPORTS JS
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const reportPage =
        document.querySelector(".reports-page");

    if (!reportPage) {
        return;
    }


    /* =====================================================
       GET TASKS
    ===================================================== */

    const tasks =
        JSON.parse(
            localStorage.getItem("routineTasks")
        ) || [];


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


    /* =====================================================
       UPDATE CARDS
    ===================================================== */

    setText(
        "reportTotalTasks",
        total
    );

    setText(
        "reportCompletedTasks",
        completed
    );

    setText(
        "reportPendingTasks",
        pending
    );

    setText(
        "reportCompletionRate",
        `${percentage}%`
    );


    /* =====================================================
       DONUT
    ===================================================== */

    const donut =
        document.querySelector(
            "[data-completion-donut]"
        );


    if (donut) {

        donut.style.setProperty(
            "--progress",
            `${percentage}%`
        );

    }


    /* =====================================================
       PERIOD SELECTOR
    ===================================================== */

    const periodSelect =
        document.getElementById(
            "reportPeriod"
        );


    if (periodSelect) {

        periodSelect.addEventListener(
            "change",
            () => {

                const period =
                    periodSelect.value;

                showToast(
                    `Report changed to ${period}.`,
                    "success"
                );

            }
        );

    }


    /* =====================================================
       WEEKLY CHART
    ===================================================== */

    createWeeklyChart();


    /* =====================================================
       PRODUCTIVITY MESSAGE
    ===================================================== */

    const insight =
        document.getElementById(
            "productivityInsight"
        );


    if (insight) {

        if (percentage >= 80) {

            insight.textContent =
                "Excellent! You're maintaining a strong daily routine.";

        } else if (percentage >= 50) {

            insight.textContent =
                "Good progress! Stay consistent and complete a few more tasks.";

        } else {

            insight.textContent =
                "You can improve your consistency. Start with your most important task.";

        }

    }


    /* =====================================================
       WEEKLY CHART
    ===================================================== */

    function createWeeklyChart() {

        const chart =
            document.querySelector(
                "[data-weekly-chart]"
            );

        if (!chart) {
            return;
        }


        const days = [
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat",
            "Sun"
        ];


        const values = [
            65,
            82,
            58,
            91,
            75,
            88,
            percentage
        ];


        chart.innerHTML =
            days.map((day, index) => `

                <div class="chart-column">

                    <div
                        class="chart-bar"
                        style="height:${values[index]}%"
                    ></div>

                    <span>
                        ${day}
                    </span>

                </div>

            `).join("");

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