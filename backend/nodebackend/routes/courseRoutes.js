const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");
const multer = require("multer");
const path = require("path");

// Multer setup for PDF uploads
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) =>
    cb(null, Date.now() + "_" + file.originalname),
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") return cb(null, false);
    cb(null, true);
  },
});

// Routes
router.get("/", courseController.getCourses);
router.get("/:id", courseController.getCourseById);
router.post("/", upload.single("pdf"), courseController.createCourse);
router.put("/:id", upload.single("pdf"), courseController.updateCourse);
router.delete("/:id", courseController.deleteCourse);

module.exports = router;
