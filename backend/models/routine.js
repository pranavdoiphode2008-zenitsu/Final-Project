const mongoose = require("mongoose");

const routineSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        date: {
            type: Date,
            required: true
        },

        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            default: "",
            trim: true
        },

        completed: {
            type: Boolean,
            default: false
        },

        completionPercentage: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        }
    },
    {
        timestamps: true
    }
);

routineSchema.index({
    user: 1,
    date: 1
});

module.exports = mongoose.model("Routine", routineSchema);