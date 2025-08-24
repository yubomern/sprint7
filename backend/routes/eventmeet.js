// routes/events.js
const express = require("express");
const Event = require("../models/eventmeet");
const router = express.Router();

// Get all events
router.get("/", async (req, res) => {
    try {
        const events = await Event.find();
        res.json(events);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create event
router.post("/", async (req, res) => {
    try {
        const event = new Event(req.body);
        await event.save();
        res.json(event);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
