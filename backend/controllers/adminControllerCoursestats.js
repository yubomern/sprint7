// controllers/ratingController.js
const Course = require('../models/Course');
const RatingAndReview = require('../models/RatingAndReview');

exports.addRatingAndReview = async (req, res) => {
    try {
        const { courseId, rating, review ,userId} = req.body;
        //const userId = req.user.id; // assuming you're using middleware to get auth user

        // Check if course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        // Prevent duplicate reviews
        const alreadyReviewed = await RatingAndReview.findOne({ user: userId, course: courseId });
        if (alreadyReviewed) {
            return res.status(400).json({ message: "You have already reviewed this course" });
        }

        // Create new rating/review
        const newRating = await RatingAndReview.create({
            user: userId,
            course: courseId,
            rating,
            review
        });

        // Push to course's ratingAndReviews array
        course.ratingAndReviews.push(newRating._id);

        // Update course average rating
        const allRatings = await RatingAndReview.find({ course: courseId });
        const totalRating = allRatings.reduce((acc, item) => acc + item.rating, 0);
        const avgRating = totalRating / allRatings.length;

        course.rating = avgRating;
        await course.save();

        res.status(201).json({
            message: "Rating and review added successfully",
            data: newRating
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
