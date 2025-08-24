const User = require('../models/user');
const Course = require('../models/course');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get student statistics
// @route   GET /api/students/stats
// @access  Private/Admin
exports.getStudentStats = asyncHandler(async (req, res, next) => {
    // Total students count
    const totalStudents = await User.countDocuments({ role: 'student' });

    // Students per month (for chart)
    const studentsPerMonth = await User.aggregate([
        {
            $match: {
                role: 'student',
                createdAt: { $exists: true }
            }
        },
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

    // Students with most courses
    const activeStudents = await User.aggregate([
        {
            $match: { role: 'student' }
        },
        {
            $project: {
                name: 1,
                email: 1,
                courseCount: { $size: '$purchasedCourses' }
            }
        },
        {
            $sort: { courseCount: -1 }
        },
        {
            $limit: 5
        }
    ]);

    res.status(200).json({
        success: true,
        data: {
            totalStudents,
            studentsPerMonth,
            activeStudents
        }
    });
});