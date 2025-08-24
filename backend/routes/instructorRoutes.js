const express = require('express');
const router = express.Router();
const instructorController = require('../controllers/instructorController');
const { auth } = require("../middleware/auth");

router.get('/', instructorController.getAllInstructors);
router.get('/:id', instructorController.getInstructorById);
router.post('/:id/review',auth, instructorController.addReview);

module.exports = router;
