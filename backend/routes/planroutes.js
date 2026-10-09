const express = require("express");
const Plan = require("../models/Plan");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);


// ============================================================
// GET SAVED PLANS
// GET /api/plans
// ============================================================

router.get("/", async (req, res) => {

    try {

        const plans =
            await Plan.find({
                user: req.userId
            }).sort({
                createdAt: -1
            });


        res.json({
            success: true,
            plans
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Unable to fetch plans"
        });

    }

});


// ============================================================
// CREATE PLAN
// POST /api/plans
// ============================================================

router.post("/", async (req, res) => {

    try {

        const {
            goal,
            date,
            availableTime,
            priority,
            additionalInfo,
            items
        } = req.body;


        if (!goal) {

            return res.status(400).json({
                success: false,
                message: "Goal is required"
            });

        }


        const plan =
            await Plan.create({

                user: req.userId,

                goal,

                date:
                    date || new Date(),

                availableTime:
                    availableTime || "",

                priority:
                    priority || "medium",

                additionalInfo:
                    additionalInfo || "",

                items:
                    items || []

            });


        res.status(201).json({
            success: true,
            plan
        });

    } catch (error) {

        console.error(error);

        res.status(400).json({
            success: false,
            message: "Unable to create plan"
        });

    }

});


// ============================================================
// UPDATE PLAN
// PUT /api/plans/:id
// ============================================================

router.put("/:id", async (req, res) => {

    try {

        const plan =
            await Plan.findOneAndUpdate(

                {
                    _id: req.params.id,
                    user: req.userId
                },

                req.body,

                {
                    new: true,
                    runValidators: true
                }

            );


        if (!plan) {

            return res.status(404).json({
                success: false,
                message: "Plan not found"
            });

        }


        res.json({
            success: true,
            plan
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: "Unable to update plan"
        });

    }

});


// ============================================================
// DELETE PLAN
// DELETE /api/plans/:id
// ============================================================

router.delete("/:id", async (req, res) => {

    try {

        const plan =
            await Plan.findOneAndDelete({

                _id: req.params.id,

                user: req.userId

            });


        if (!plan) {

            return res.status(404).json({
                success: false,
                message: "Plan not found"
            });

        }


        res.json({
            success: true,
            message: "Plan deleted"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Unable to delete plan"
        });

    }

});


module.exports = router;