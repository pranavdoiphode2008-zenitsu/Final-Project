const express = require("express");
const Task = require("../models/Task");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);


// ============================================================
// REPORT SUMMARY
// GET /api/reports/summary
// ============================================================

router.get("/summary", async (req, res) => {

    try {

        const userId =
            req.userId;


        const tasks =
            await Task.find({
                user: userId
            });


        const total =
            tasks.length;


        const completed =
            tasks.filter(
                task => task.completed
            ).length;


        const pending =
            total - completed;


        const completionRate =
            total === 0
                ? 0
                : Math.round(
                    (completed / total) * 100
                );


        const categoryStats = {};


        tasks.forEach(task => {

            const category =
                task.category || "other";


            if (!categoryStats[category]) {

                categoryStats[category] = {
                    total: 0,
                    completed: 0
                };

            }


            categoryStats[category].total++;


            if (task.completed) {

                categoryStats[category].completed++;

            }

        });


        res.json({

            success: true,

            summary: {

                total,

                completed,

                pending,

                completionRate,

                categoryStats

            }

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Unable to generate report"
        });

    }

});


// ============================================================
// WEEKLY REPORT
// GET /api/reports/weekly
// ============================================================

router.get("/weekly", async (req, res) => {

    try {

        const today =
            new Date();


        const startDate =
            new Date(today);


        startDate.setDate(
            today.getDate() - 6
        );


        startDate.setHours(
            0, 0, 0, 0
        );


        const tasks =
            await Task.find({

                user: req.userId,

                date: {
                    $gte: startDate,
                    $lte: today
                }

            });


        const days = [];


        for (
            let i = 0;
            i < 7;
            i++
        ) {

            const date =
                new Date(startDate);


            date.setDate(
                startDate.getDate() + i
            );


            const dateString =
                date.toISOString()
                    .split("T")[0];


            const dayTasks =
                tasks.filter(task =>
                    new Date(task.date)
                        .toISOString()
                        .split("T")[0] ===
                    dateString
                );


            const completed =
                dayTasks.filter(
                    task => task.completed
                ).length;


            days.push({

                date: dateString,

                total: dayTasks.length,

                completed,

                percentage:
                    dayTasks.length === 0
                        ? 0
                        : Math.round(
                            completed /
                            dayTasks.length *
                            100
                        )

            });

        }


        res.json({

            success: true,

            days

        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Unable to generate weekly report"
        });

    }

});


module.exports = router;