// models/EventModel.js
const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    name: { type: String, required: true },
    start_date: { type: Date, required: true },
    finish_date: { type: Date, required: true },
    CourseID: { type: String },
    course: { type: String },
    meet_link: { type: String }, // NEW
    course_image: { type: String } // NEW (store URL or base64)
});

module.exports = mongoose.model("Eventlecture", eventSchema);
