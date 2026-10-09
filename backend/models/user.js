// ============================================================
// DAILY ROUTINE MANAGEMENT SYSTEM
// USER MODEL
// MongoDB + Mongoose
// ============================================================

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");


// ============================================================
// USER SCHEMA
// ============================================================

const userSchema = new mongoose.Schema(
    {

        // ----------------------------------------------------
        // USER NAME
        // ----------------------------------------------------

        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            minlength: 2,
            maxlength: 100
        },


        // ----------------------------------------------------
        // EMAIL
        // ----------------------------------------------------

        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true
        },


        // ----------------------------------------------------
        // PASSWORD
        // ----------------------------------------------------

        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: 6,
            select: false
        },


        // ----------------------------------------------------
        // PROFILE
        // ----------------------------------------------------

        profileImage: {
            type: String,
            default: ""
        },


        // ----------------------------------------------------
        // SETTINGS
        // ----------------------------------------------------

        settings: {

            darkMode: {
                type: Boolean,
                default: false
            },

            notifications: {
                type: Boolean,
                default: true
            }

        },


        // ----------------------------------------------------
        // STREAK
        // ----------------------------------------------------

        streak: {
            type: Number,
            default: 0,
            min: 0
        },


        // ----------------------------------------------------
        // LAST ACTIVE DATE
        // ----------------------------------------------------

        lastActiveDate: {
            type: Date,
            default: null
        }

    },
    {

        timestamps: true

    }
);


// ============================================================
// HASH PASSWORD BEFORE SAVING
// ============================================================

userSchema.pre("save", async function (next) {

    // If password has not changed,
    // don't hash it again.
    if (!this.isModified("password")) {
        return next();
    }

    try {

        const salt = await bcrypt.genSalt(10);

        this.password =
            await bcrypt.hash(
                this.password,
                salt
            );

        next();

    } catch (error) {

        next(error);

    }

});


// ============================================================
// CHECK PASSWORD
// ============================================================

userSchema.methods.comparePassword =
    async function (enteredPassword) {

        return await bcrypt.compare(
            enteredPassword,
            this.password
        );

    };


// ============================================================
// REMOVE PASSWORD FROM JSON RESPONSE
// ============================================================

userSchema.methods.toJSON =
    function () {

        const user =
            this.toObject();

        delete user.password;

        return user;

    };


// ============================================================
// EXPORT MODEL
// ============================================================

module.exports =
    mongoose.model(
        "User",
        userSchema
    );