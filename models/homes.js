
const mongoose = require('mongoose');

const homeSchema = new mongoose.Schema({
  houseName:{
    type: String,
    required:true
  },
  pricePerNight:{
    type: Number, 
    required:true
  },
  location:{
    type: String,
    required:true
  },
  rating:{
    type: Number,
    required:true
  },
  photo:String,
  description:String,
});


module.exports = mongoose.model('Home', homeSchema);
