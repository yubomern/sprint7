const User = require('../models/User');
const Review = require('../models/Review');

// 📌 Get all instructors
exports.getAllInstructors = async (req, res) => {
    try {
        const instructors = await User.find({ accountType: 'Instructor' })
            .select('-email')
            .populate('reviews');
        res.json(instructors);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 📌 Get instructor by ID
exports.getInstructorById = async (req, res) => {
    try {
        const instructor = await User.findById(req.params.id)
            .select('-email')
            .populate({
                path: 'reviews',
                populate: { path: 'user', select: 'firstName lastName image ' }
            });

        if (!instructor) return res.status(404).json({ error: 'Instructor not found' });
        res.json(instructor);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 📌 Add review to instructor
exports.addReview = async (req, res) => {
    try {
        const {  rating, comment } = req.body;
        const instructorId = req.params.id;
        const userId = req.user.id; // ✅ From auth middleware
        console.log(userId);

        const review = new Review({

            instructor: instructorId,
            user: userId,
            rating,
            comment
        });
        await review.save();

        // Push review to instructor
        const instructor = await User.findById(instructorId);
        console.table(instructor);

        instructor.reviews.push(review._id);

        // Update instructor's average rating
        const reviews = await Review.find({ instructor: instructorId });
        instructor.rating =
            reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

        await instructor.save();

        res.json({ message: 'Review added', review });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
