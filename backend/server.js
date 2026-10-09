// ============================================================
// DAILY ROUTINE MANAGEMENT SYSTEM
// Backend Server
// Node.js + Express + MongoDB
// ============================================================

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Database connection
const connectDatabase = require("./config/database");

// Route files
const authRoutes = require("./routes/authRoutes");
const routineRoutes = require("./routes/routineRoutes");
const taskRoutes = require("./routes/taskRoutes");
const planRoutes = require("./routes/planRoutes");
const reportRoutes = require("./routes/reportRoutes");
const settingsRoutes = require("./routes/settingsRoutes");

// Create Express application
const app = express();


// ============================================================
// DATABASE
// ============================================================

connectDatabase();


// ============================================================
// MIDDLEWARE
// ============================================================

// Allow frontend to communicate with backend
app.use(
    cors({
        origin: true,
        credentials: true
    })
);

// Read JSON data sent by frontend
app.use(express.json());

// Read form data
app.use(express.urlencoded({ extended: true }));


// ============================================================
// BASIC TEST ROUTE
// ============================================================

app.get("/", (req, res) => {

    res.json({
        success: true,
        message: "Daily Routine API is running 🚀"
    });

});


// ============================================================
// API ROUTES
// ============================================================

app.use("/api/auth", authRoutes);

app.use("/api/routines", routineRoutes);

app.use("/api/tasks", taskRoutes);

app.use("/api/plans", planRoutes);

app.use("/api/reports", reportRoutes);

app.use("/api/settings", settingsRoutes);


// ============================================================
// 404 ROUTE
// ============================================================

app.use((req, res) => {

    res.status(404).json({
        success: false,
        message: "API route not found"
    });

});


// ============================================================
// ERROR HANDLER
// ============================================================

app.use((err, req, res, next) => {

    console.error("Server Error:", err);

    res.status(500).json({
        success: false,
        message: "Internal server error"
    });

});


// ============================================================
// START SERVER
// ============================================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log("");
    console.log("======================================");
    console.log("  DAILY ROUTINE BACKEND");
    console.log("======================================");
    console.log(`  Server running on port ${PORT}`);
    console.log(`  http://localhost:${PORT}`);
    console.log("======================================");
    console.log("");

});




