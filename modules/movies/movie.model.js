

// const { required } = require("joi");
const { Schema, model } = require("mongoose");

const movieSchema = new Schema(
    {
        title: { type: String, required: true, unique: true },
        slug: { type: String, required: true },
        duration: { type: String, required: true },
        synopsis: { type: String },
        poster: { type: String, required: true },
        releaseDate: { type: Date, required: true, default: Date.now },
        endDate: { type: Date, required: true },
        Seats: { type: Number, required: true, default: 0 },

        //todo
        //createdBy:{}
    },
    {
        timestamps: true,
    }
);

module.exports = model("movie", movieSchema);