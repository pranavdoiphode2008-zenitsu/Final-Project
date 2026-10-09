const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        routine: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Routine",
            default: null
        },

        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 200
        },

        description: {
            type: String,
            default: "",
            trim: true
        },

        date: {
            type: Date,
            required: true
        },

        time: {
            type: String,
            default: ""
        },

        category: {
            type: String,
            enum: [
                "study",
                "work",
                "exercise",
                "personal",
                "health",
                "other"
            ],
            default: "other"
        },

        priority: {
            type: String,
            enum: [
                "low",
                "medium",
                "high"
            ],
            default: "medium"
        },

        completed: {
            type: Boolean,
            default: false
        },

        completedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

taskSchema.index({
    user: 1,
    date: 1
});

module.exports = mongoose.model("Task", taskSchema);