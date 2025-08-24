const Event = require("../models/meet");

// Get all events
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// Add new event
exports.createEvent = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      start_date,
      finish_date,
      status,
      tags,
      originalPrice,
      discountPrice,
      stock,
      images,
      CourseID,
      course,
      sold_out,
    } = req.body;

    if (!start_date || !finish_date || !CourseID || !course) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newEvent = new Event({
      name,
      description,
      category,
      start_date,
      finish_date,
      status,
      tags,
      originalPrice,
      discountPrice,
      stock,
      images,
      CourseID,
      course,
      sold_out,
    });

    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
