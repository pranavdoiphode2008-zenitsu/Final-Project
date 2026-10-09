const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// ============================================================
// CREATE JWT
// ============================================================

const createToken = (userId) => {

    return jwt.sign(
        {
            userId: userId
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d"
        }
    );

};


// ============================================================
// REGISTER
// POST /api/auth/register
// ============================================================

router.post("/register", async (req, res) => {

    try {

        const {
            name,
            email,
            password
        } = req.body;


        if (
            !name ||
            !email ||
            !password
        ) {

            return res.status(400).json({
                success: false,
                message: "Name, email and password are required"
            });

        }


        if (password.length < 6) {

            return res.status(400).json({
                success: false,
                message: "Password must contain at least 6 characters"
            });

        }


        const normalizedEmail =
            email.toLowerCase().trim();


        const existingUser =
            await User.findOne({
                email: normalizedEmail
            });


        if (existingUser) {

            return res.status(409).json({
                success: false,
                message: "Email is already registered"
            });

        }


        const user =
            await User.create({
                name: name.trim(),
                email: normalizedEmail,
                password
            });


        const token =
            createToken(user._id);


        res.status(201).json({

            success: true,

            message:
                "Account created successfully",

            token,

            user

        });

    } catch (error) {

        console.error(
            "Registration error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Registration failed"
        });

    }

});


// ============================================================
// LOGIN
// POST /api/auth/login
// ============================================================

router.post("/login", async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        if (
            !email ||
            !password
        ) {

            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });

        }


        const user =
            await User.findOne({
                email: email.toLowerCase().trim()
            }).select("+password");


        if (!user) {

            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });

        }


        const passwordCorrect =
            await user.comparePassword(
                password
            );


        if (!passwordCorrect) {

            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });

        }


        const token =
            createToken(user._id);


        res.json({

            success: true,

            message:
                "Login successful",

            token,

            user

        });

    } catch (error) {

        console.error(
            "Login error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Login failed"
        });

    }

});


// ============================================================
// CURRENT USER
// GET /api/auth/me
// ============================================================

router.get(
    "/me",
    authMiddleware,
    async (req, res) => {

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
                user
            });

        } catch (error) {

            res.status(500).json({
                success: false,
                message: "Unable to fetch user"
            });

        }

    }
);


// ============================================================
// LOGOUT
// ============================================================

router.post("/logout", authMiddleware, (req, res) => {

    // JWT is stateless.
    // Frontend removes the token.

    res.json({
        success: true,
        message: "Logout successful"
    });

});


module.exports = router;