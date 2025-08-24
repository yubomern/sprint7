const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    title: { type: String, required: true },
    description: { type: String },
    startTime: {
        type: Date,
        required: true,
        validate: {
            validator: function(v) {
                return v instanceof Date && !isNaN(v);
            },
            message: props => `${props.value} is not a valid date!`
        }
    },
    endTime: {
        type: Date,
        required: true,
        validate: {
            validator: function(v) {
                return v instanceof Date && !isNaN(v) && v > this.startTime;
            },
            message: props => `End time must be after start time!`
        }
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",  // assuming instructor is a User
    },
    meetingId: { type: String },
    meetingPassword: { type: String },
    meetingUrl: { type: String },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    recordingUrl: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Session ||  mongoose.model('Session', SessionSchema);