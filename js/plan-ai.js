/* =========================================================
   DAILY ROUTINE - PLAN WITH AI JS
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const form =
        document.getElementById("aiPlanForm");

    if (!form) {
        return;
    }


    const resultContainer =
        document.getElementById("generatedPlan");

    const savedPlansContainer =
        document.getElementById("savedPlans");


    /* =====================================================
       FORM SUBMIT
    ===================================================== */

    form.addEventListener("submit", event => {

        event.preventDefault();


        const goal =
            document.getElementById("goal")?.value.trim();

        const date =
            document.getElementById("planDate")?.value;

        const availableTime =
            document.getElementById("availableTime")?.value;

        const priority =
            document.getElementById("priority")?.value;

        const additionalInfo =
            document
                .getElementById("additionalInfo")
                ?.value.trim();


        if (!goal) {

            showToast(
                "Please enter your goal.",
                "error"
            );

            return;

        }


        if (!resultContainer) {
            return;
        }


        /* LOADING */

        resultContainer.innerHTML = `

            <div class="ai-loading">

                <div class="ai-spinner"></div>

                <h3>
                    Creating your plan...
                </h3>

                <p>
                    AI is organizing your day.
                </p>

            </div>

        `;


        /* DEMO AI DELAY */

        setTimeout(() => {

            const plan =
                generatePlan(
                    goal,
                    availableTime,
                    priority,
                    additionalInfo
                );


            displayPlan(
                plan,
                goal,
                date
            );

        }, 1200);

    });


    /* =====================================================
       GENERATE PLAN
    ===================================================== */

    function generatePlan(
        goal,
        availableTime,
        priority,
        additionalInfo
    ) {

        const plan = [];


        plan.push({
            time: "06:30",
            title: "Morning Start",
            description:
                "Wake up, freshen up and prepare mentally for the day."
        });


        plan.push({
            time: "07:00",
            title: "Morning Planning",
            description:
                "Review your goals and decide the most important tasks."
        });


        plan.push({
            time: "09:00",
            title: "Focus Session",
            description:
                `Work on ${goal} with full concentration.`
        });


        plan.push({
            time: "11:00",
            title: "Short Break",
            description:
                "Take a short break and refresh your mind."
        });


        plan.push({
            time: "11:20",
            title: "Deep Work",
            description:
                `Continue working toward ${goal}.`
        });


        plan.push({
            time: "13:00",
            title: "Lunch Break",
            description:
                "Have lunch and take some time away from your work."
        });


        plan.push({
            time: "15:00",
            title: "Practice Session",
            description:
                "Review what you learned and practice important concepts."
        });


        plan.push({
            time: "18:00",
            title: "Exercise",
            description:
                "Take time for physical activity and refresh yourself."
        });


        plan.push({
            time: "19:00",
            title: "Review",
            description:
                "Check today's progress and complete unfinished work."
        });


        plan.push({
            time: "21:30",
            title: "Daily Reflection",
            description:
                "Review your achievements and prepare for tomorrow."
        });


        return plan;

    }


    /* =====================================================
       DISPLAY PLAN
    ===================================================== */

    function displayPlan(
        plan,
        goal,
        date
    ) {

        resultContainer.innerHTML = `

            <div class="generated-plan-header">

                <div>

                    <span class="ai-label">
                        ✨ AI GENERATED
                    </span>

                    <h2>
                        ${escapeHTML(goal)}
                    </h2>

                    <p>
                        Your personalized routine
                    </p>

                </div>

                <button
                    id="saveGeneratedPlan"
                    class="primary-btn"
                >
                    💾 Save Plan
                </button>

            </div>


            <div class="ai-plan-list">

                ${plan.map((item, index) => `

                    <div class="ai-plan-item">

                        <div class="ai-plan-number">
                            ${index + 1}
                        </div>

                        <div class="ai-plan-time">
                            ${item.time}
                        </div>

                        <div class="ai-plan-content">

                            <h3>
                                ${escapeHTML(item.title)}
                            </h3>

                            <p>
                                ${escapeHTML(item.description)}
                            </p>

                        </div>

                    </div>

                `).join("")}

            </div>

        `;


        const saveButton =
            document.getElementById(
                "saveGeneratedPlan"
            );


        if (saveButton) {

            saveButton.addEventListener(
                "click",
                () => {

                    savePlan(
                        goal,
                        date,
                        plan
                    );

                }
            );

        }

    }


    /* =====================================================
       SAVE PLAN
    ===================================================== */

    function savePlan(
        goal,
        date,
        plan
    ) {

        const savedPlans =
            JSON.parse(
                localStorage.getItem(
                    "aiSavedPlans"
                )
            ) || [];


        const newPlan = {

            id: Date.now(),

            goal: goal,

            date:
                date ||
                new Date()
                    .toISOString()
                    .split("T")[0],

            plan: plan,

            createdAt:
                new Date().toISOString()

        };


        savedPlans.unshift(newPlan);


        localStorage.setItem(
            "aiSavedPlans",
            JSON.stringify(savedPlans)
        );


        showToast(
            "AI plan saved successfully!",
            "success"
        );


        renderSavedPlans();

    }


    /* =====================================================
       SAVED PLANS
    ===================================================== */

    function renderSavedPlans() {

        if (!savedPlansContainer) {
            return;
        }


        const savedPlans =
            JSON.parse(
                localStorage.getItem(
                    "aiSavedPlans"
                )
            ) || [];


        if (savedPlans.length === 0) {

            savedPlansContainer.innerHTML = `

                <div class="empty-state">

                    <div class="empty-icon">
                        🤖
                    </div>

                    <h3>
                        No saved plans
                    </h3>

                    <p>
                        Generate and save your first AI plan.
                    </p>

                </div>

            `;

            return;

        }


        savedPlansContainer.innerHTML =
            savedPlans.map(plan => `

                <div class="saved-plan-card">

                    <div>

                        <span>
                            ${escapeHTML(plan.date)}
                        </span>

                        <h3>
                            ${escapeHTML(plan.goal)}
                        </h3>

                    </div>

                    <button
                        class="delete-plan"
                        data-plan-id="${plan.id}"
                    >
                        🗑️
                    </button>

                </div>

            `).join("");


        savedPlansContainer
            .querySelectorAll(
                "[data-plan-id]"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        const id =
                            Number(
                                button.dataset.planId
                            );


                        const updated =
                            savedPlans.filter(
                                plan =>
                                    plan.id !== id
                            );


                        localStorage.setItem(
                            "aiSavedPlans",
                            JSON.stringify(updated)
                        );


                        renderSavedPlans();


                        showToast(
                            "Plan deleted.",
                            "success"
                        );

                    }
                );

            });

    }


    renderSavedPlans();

});