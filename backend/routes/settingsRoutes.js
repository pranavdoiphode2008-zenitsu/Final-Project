const express = require("express");
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const Rating = require("../models/Rating");

const authMiddleware =
    require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);


// ============================================================
// GET SETTINGS
// GET /api/settings
// ============================================================

router.get("/", async (req, res) => {

    try {

        const user =
            await User.findById(
                req.userId
            );


        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }


        res.json({

            success: true,

            settings: {

                name: user.name,

                email: user.email,

                profileImage:
                    user.profileImage,

                darkMode:
                    user.settings.darkMode,

                notifications:
                    user.settings.notifications

            }

        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Unable to fetch settings"
        });

    }

});


// ============================================================
// UPDATE SETTINGS
// PUT /api/settings
// ============================================================

router.put("/", async (req, res) => {

    try {

        const {
            name,
            profileImage,
            darkMode,
            notifications
        } = req.body;


        const update = {};


        if (name !== undefined) {
            update.name = name.trim();
        }


        if (profileImage !== undefined) {
            update.profileImage = profileImage;
        }


        if (darkMode !== undefined) {
            update["settings.darkMode"] =
                Boolean(darkMode);
        }


        if (notifications !== undefined) {
            update["settings.notifications"] =
                Boolean(notifications);
        }


        const user =
            await User.findByIdAndUpdate(

                req.userId,

                {
                    $set: update
                },

                {
                    new: true,
                    runValidators: true
                }

            );


        res.json({

            success: true,

            message:
                "Settings updated successfully",

            user

        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: "Unable to update settings"
        });

    }

});


// ============================================================
// CHANGE PASSWORD
// PUT /api/settings/password
// ============================================================

router.put(
    "/password",
    async (req, res) => {

        try {

            const {
                currentPassword,
                newPassword
            } = req.body;


            if (
                !currentPassword ||
                !newPassword
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Current and new passwords are required"
                });

            }


            if (
                newPassword.length < 6
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        "New password must contain at least 6 characters"
                });

            }


            const user =
                await User.findById(
                    req.userId
                ).select("+password");


            const correct =
                await bcrypt.compare(

                    currentPassword,

                    user.password

                );


            if (!correct) {

                return res.status(401).json({
                    success: false,
                    message:
                        "Current password is incorrect"
                });

            }


            user.password =
                newPassword;


            await user.save();


            res.json({

                success: true,

                message:
                    "Password changed successfully"

            });

        } catch (error) {

            res.status(500).json({
                success: false,
                message:
                    "Unable to change password"
            });

        }

    }
);


// ============================================================
// SUBMIT RATING
// POST /api/settings/rating
// ============================================================

router.post(
    "/rating",
    async (req, res) => {

        try {

            const {
                rating,
                feedback
            } = req.body;


            if (
                !rating ||
                rating < 1 ||
                rating > 5
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Rating must be between 1 and 5"
                });

            }


            const newRating =
                await Rating.create({

                    user: req.userId,

                    rating,

                    feedback:
                        feedback || ""

                });


            res.status(201).json({

                success: true,

                message:
                    "Thank you for your rating!",

                rating: newRating

            });

        } catch (error) {

            res.status(500).json({
                success: false,
                message:
                    "Unable to save rating"
            });

        }

    }
);


module.exports = router;