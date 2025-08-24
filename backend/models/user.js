const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true
        },
        lastName: {
            type: String,
            required: true,
            trim: true
        },
        Name: {
            type: String,
            required: false,
            default: 'name-0lms',
            trim: true
        },
        UserName: {
            type: String,
            required: false,
            trim: true
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
        email: {
            type: String,
            required: true,
            trim: true
        },
        password: {
            type: String,
            required: true
        },
        accountType: {
            type: String,
            enum: ['Admin', 'Instructor', 'Student'],
            reuired: true
        },
        walletBalance: { type: Number, default: 0 },
        balance: { type: Number, default: 0 },
        phoneNumber: {
            type: String,
          },
        
          totalEarnings: {
            type: Number,
            default: 0,
          },
        active: {
            type: Boolean,
            default: true,
        },
        approved: {
            type: Boolean,
            default: true,
        },
        additionalDetails: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Profile',
            required: true
        },
        courses: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Course'
            }
        ],
        image: {
            type: String,
            required: true
        },
        notification:{type:String,default:"" , required:false},
        score: { type: Number, default: 0 },
        reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
        rating: { type: Number, default: 0 },
        token: {
            type: String
        },
        resetPasswordTokenExpires: {
            type: Date
        },
        followers: [{ type: mongoose.Schema.Types.ObjectId, ref:'User' }],
        following: [{ type: mongoose.Schema.Types.ObjectId, ref:'User' }],
        courseProgress: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'CourseProgress'

            }
        ]
    },// Add timestamps for when the document is created and last modified
    { timestamps: true }
);


module.exports = mongoose.models.User ||   mongoose.model('User', userSchema);