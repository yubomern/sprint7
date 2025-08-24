const Course = require('../models/Course');
const RatingAndReview = require('../models/RatingAndReview');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get course statistics
// @route   GET /api/courses/stats
// @access  Private/Admin
exports.getCourseStats = asyncHandler(async (req, res, next) => {
    // Total courses count
    const totalCourses = await Course.countDocuments();

    // Courses per category
    const coursesByCategory = await Course.aggregate([
        {
            $group: {
                _id: '$category',
                count: { $sum: 1 },
                avgRating: { $avg: '$rating' }
            }
        },
        {
            $sort: { count: -1 }
        }
    ]);

    // Top rated courses
    const topRatedCourses = await Course.find()
        .sort({ rating: -1 })
        .limit(5)
        .populate('instructor', 'name email');

    // Courses per month (for chart)
    const coursesPerMonth = await Course.aggregate([
        {
            $group: {
                _id: {
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' }
                },
                count: { $sum: 1 }
            }
        },
        {
            $sort: { '_id.year': 1, '_id.month': 1 }
        },
        {
            $limit: 12
        }
    ]);



    res.status(200).json({
        success: true,
        data: {
            totalCourses,
            coursesByCategory,
            topRatedCourses,
            coursesPerMonth
        }
    });
});