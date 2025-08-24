const mongoose = require('mongoose');

// schema 
const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category:{
    type:String,
    require:true
  },
  matiere:{
    type:  String , 
    require:false 
  },
  pdf:{
    type:  String , 
    require:false 
  },
  
  
  
  img: {
    type: String,
    default: "null",
  },
  file: [
    {
      title: {
        type: String,
      },
      link: {
        type: String,
      },
    },
  ],
  links: [
    {
      title: {
        type: String,
      },
      link: {
        type: String,
      },
    },
  ],
  user_id: {
    type: String,
    required: true,
  },
  price:{
    type:Number,
    require:true,
  }
  ,
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  
});

//  course
const courseModel = mongoose.model('lecture', courseSchema);

module.exports = courseModel;
