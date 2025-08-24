const  mongoose  = require('mongoose');



const  CourseImageSchema  = mongoose.Schema({

    name : String,
    description : String,
    images : [String],
    comments : String,
    singleImage : String,

});


const CourseImage  = mongoose.model('CourseImage', CourseImageSchema);


module.exports = CourseImage;
