const express = require("express");
const Task = require("../models/Task");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);


// ============================================================
// GET TASKS
// GET /api/tasks
// ============================================================

router.get("/", async (req, res) => {

    try {

        const filter = {
            user: req.userId
        };


        if (req.query.date) {

            const start =
                new Date(req.query.date);

            const end =
                new Date(req.query.date);

            end.setDate(
                end.getDate() + 1
            );


            filter.date = {
                $gte: start,
                $lt: end
            };

        }


        const tasks =
            await Task.find(filter)
                .sort({
                    date: 1,
                    time: 1
                });


        res.json({
            success: true,
            tasks
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Unable to fetch tasks"
        });

    }

});


// ============================================================
// CREATE TASK
// POST /api/tasks
// ============================================================

router.post("/", async (req, res) => {

    try {

        const task =
            await Task.create({

                user: req.userId,

                routine:
                    req.body.routine || null,

                title:
                    req.body.title,

                description:
                    req.body.description || "",

                date:
                    req.body.date || new Date(),

                time:
                    req.body.time || "",

                category:
                    req.body.category || "other",

                priority:
                    req.body.priority || "medium"

            });


        res.status(201).json({
            success: true,
            task
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: "Unable to create task"
        });

    }

});


// ============================================================
// UPDATE TASK
// PUT /api/tasks/:id
// ============================================================

router.put("/:id", async (req, res) => {

    try {

        const updateData = {
            ...req.body
        };


        if (
            typeof req.body.completed !==
            "undefined"
        ) {

            updateData.completedAt =
                req.body.completed
                    ? new Date()
                    : null;

        }


        const task =
            await Task.findOneAndUpdate(

                {
                    _id: req.params.id,
                    user: req.userId
                },

                updateData,

                {
                    new: true,
                    runValidators: true
                }

            );


        if (!task) {

            return res.status(404).json({
                success: false,
                message: "Task not found"
            });

        }


        res.json({
            success: true,
            task
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: "Unable to update task"
        });

    }

});


// ============================================================
// DELETE TASK
// DELETE /api/tasks/:id
// ============================================================

router.delete("/:id", async (req, res) => {

    try {

        const task =
            await Task.findOneAndDelete({

                _id: req.params.id,

                user: req.userId

            });


        if (!task) {

            return res.status(404).json({
                success: false,
                message: "Task not found"
            });

        }


        res.json({
            success: true,
            message: "Task deleted"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Unable to delete task"
        });

    }

});


module.exports = router;