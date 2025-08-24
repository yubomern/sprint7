const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({
    courseName: {
        type: String
    },
    courseDescription: {
        type: String
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    whatYouWillLearn: {
        type: String
    },
    rating: { type: Number, default: 0 },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    courseContent: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Section'
        }
    ],
    ratingAndReviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'RatingAndReview'
        }
    ],
    price: {
        type: Number
    },
    thumbnail: {
        type: String
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },

    matiere:{
        type:  String ,
        require:false
    },

    pdf:{
        type:  String,
        require:false
    },

    tag: {
        type: [String],
        required: true
    },
    studentsEnrolled: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    ],
    instructions: {
        type: [String]
    },
    status: {
        type: String,
        enum: ['Draft', 'Published']
    },
    createdAt: {
        type: Date,
    }
    ,
    updatedAt: {
        type: Date,
    }

});

module.exports = mongoose.models.Course ||  mongoose.model('Course', courseSchema);