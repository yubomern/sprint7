const Course = require('../models/course');
const User = require('../models/user');
const CourseProgress = require('../models/courseProgress');
const mongoose = require('mongoose');

// ================== Free Enrollment Controller ==================
exports.enrollFreeCourse = async (req, res) => {
  const { courseId } = req.body;
  const userId = req.user.id;

  if (!courseId || !userId) {
    return res.status(400).json({
      success: false,
      message: 'Course ID or User ID is missing',
    });
  }

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    const isAlreadyEnrolled = course.studentsEnrolled.includes(userId);
    if (isAlreadyEnrolled) {
      return res.status(400).json({
        success: false,
        message: 'User already enrolled in the course',
      });
    }

    // Enroll student
    course.studentsEnrolled.push(userId);
    await course.save();

    // Create course progress
    const courseProgress = await CourseProgress.create({
      courseID: courseId,
      userId: userId,
      completedVideos: [],
    });

    // Add course and progress to user
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          courses: courseId,
          courseProgress: courseProgress._id,
        },
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'User successfully enrolled in the course',
      course,
      user,
    });
  } catch (error) {
    console.error('Enrollment error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};
