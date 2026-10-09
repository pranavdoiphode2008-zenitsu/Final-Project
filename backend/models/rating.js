const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },

        feedback: {
            type: String,
            default: "",
            trim: true,
            maxlength: 1000
        }
    },
    {
        timestamps: true
    }
);

ratingSchema.index({
    user: 1
});

module.exports = mongoose.model("Rating", ratingSchema);