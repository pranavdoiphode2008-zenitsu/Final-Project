// ============================================================
// DAILY ROUTINE MANAGEMENT SYSTEM
// MongoDB Database Connection
// ============================================================

const mongoose = require("mongoose");


// ============================================================
// CONNECT TO MONGODB
// ============================================================

const connectDatabase = async () => {

    try {

        const connection = await mongoose.connect(
            process.env.MONGO_URI
        );

        console.log("");
        console.log("======================================");
        console.log("  MONGODB CONNECTED SUCCESSFULLY");
        console.log("======================================");
        console.log(
            `  Database Host: ${connection.connection.host}`
        );
        console.log(
            `  Database Name: ${connection.connection.name}`
        );
        console.log("======================================");
        console.log("");

    } catch (error) {

        console.error("");
        console.error("======================================");
        console.error("  MONGODB CONNECTION FAILED");
        console.error("======================================");
        console.error(error.message);
        console.error("======================================");
        console.error("");

        // Stop server if database connection fails
        process.exit(1);

    }

};


// ============================================================
// EXPORT
// ============================================================

module.exports = connectDatabase;