const Course = require("../models/course");
const path = require("path");

// GET all courses
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET course by ID
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: "Course not found" });
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE new course
exports.createCourse = async (req, res) => {
  try {
    const data = req.body;
    if (req.file) {
      data.pdf = `/uploads/${req.file.filename}`;
     // data.file[0].link =   `/uploads/${req.file.filename}` ;
     // data.file[0].title = req.file.filename;  
    }
    const course = await Course.create(data);
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE course by ID
exports.updateCourse = async (req, res) => {
  try {
    const data = req.body;
    if (req.file) {
      data.file = `/uploads/${req.file.filename}`;
    }
    const updatedCourse = await Course.findByIdAndUpdate(req.params.id, data, {
      new: true,
    });
    if (!updatedCourse)
      return res.status(404).json({ error: "Course not found" });
    res.json(updatedCourse);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE course by ID
exports.deleteCourse = async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
