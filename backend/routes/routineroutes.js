const express = require("express");
const Routine = require("../models/Routine");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);


// ============================================================
// GET USER ROUTINES
// GET /api/routines
// ============================================================

router.get("/", async (req, res) => {

    try {

        const routines =
            await Routine.find({
                user: req.userId
            }).sort({
                date: -1
            });


        res.json({
            success: true,
            routines
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Unable to fetch routines"
        });

    }

});


// ============================================================
// CREATE ROUTINE
// POST /api/routines
// ============================================================

router.post("/", async (req, res) => {

    try {

        const {
            date,
            title,
            description
        } = req.body;


        const routine =
            await Routine.create({

                user: req.userId,

                date:
                    date || new Date(),

                title,

                description:
                    description || ""

            });


        res.status(201).json({
            success: true,
            routine
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Unable to create routine"
        });

    }

});


// ============================================================
// UPDATE ROUTINE
// PUT /api/routines/:id
// ============================================================

router.put("/:id", async (req, res) => {

    try {

        const routine =
            await Routine.findOneAndUpdate(

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


        if (!routine) {

            return res.status(404).json({
                success: false,
                message: "Routine not found"
            });

        }


        res.json({
            success: true,
            routine
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Unable to update routine"
        });

    }

});


// ============================================================
// DELETE ROUTINE
// DELETE /api/routines/:id
// ============================================================

router.delete("/:id", async (req, res) => {

    try {

        const routine =
            await Routine.findOneAndDelete({

                _id: req.params.id,

                user: req.userId

            });


        if (!routine) {

            return res.status(404).json({
                success: false,
                message: "Routine not found"
            });

        }


        res.json({
            success: true,
            message: "Routine deleted"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Unable to delete routine"
        });

    }

});


module.exports = router;