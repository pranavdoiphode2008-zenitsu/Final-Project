const mongoose = require("mongoose");

const planItemSchema = new mongoose.Schema(
    {
        time: {
            type: String,
            required: true
        },

        title: {
            type: String,
            required: true
        },

        description: {
            type: String,
            default: ""
        },

        completed: {
            type: Boolean,
            default: false
        }
    },
    {
        _id: false
    }
);


const planSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        goal: {
            type: String,
            required: true,
            trim: true
        },

        date: {
            type: Date,
            required: true
        },

        availableTime: {
            type: String,
            default: ""
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

        additionalInfo: {
            type: String,
            default: ""
        },

        items: {
            type: [planItemSchema],
            default: []
        },

        isSaved: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

planSchema.index({
    user: 1,
    date: 1
});

module.exports = mongoose.model("Plan", planSchema);