
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstname:{
    type:String,
    required:[true, 'First name is required']
  },
  lastname: String, 
  email:{
    type:String,
    required:[true, 'Email is required'],
    unique:true
  },
  password:{
    type:String,
    required:[true, 'Password is required']
  },
  userType:{
    type:String,
    enum:['guest','host'],
    default:'guest'
  },
  favourites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Home'
  }]
});

module.exports = mongoose.model('User', userSchema);
























// module.exports = class Home {
//   constructor(houseName, pricePerNight, location, rating, photo, description, _id) {
//     this.houseName = houseName;
//       this.pricePerNight = pricePerNight;
//       this.location = location;
//       this.rating = rating;
//       this.photo = photo;
//       this.description = description;
//       if(_id){
//         this._id = _id;
//       }
//   }

//   save() {
//    const db = getDB();

   
//    if(this._id){
//     const updateFields = {
//     houseName : this.houseName,
//     pricePerNight : this.pricePerNight,
//     location : this.location,
//     rating : this.rating,
//     photo : this.photo,
//     description : this.description,
//    }
//     return db.collection('homes').updateOne({_id:new ObjectId(String(this._id))}, {$set: updateFields});
//    }
//    else{
//     return db.collection('homes').insertOne(this);
//    }
   
//   }

//   static find() {
//     const db = getDB();
//     return db.collection('homes').find().toArray();
//   }
  
//   static findById(homeId) {
//     const db = getDB();
//     return db.collection('homes').find({_id:new ObjectId(String(homeId))}).next();
//   }
  
//   static delete(homeId) {
//     const db = getDB();
//     return db.collection('homes').deleteOne({_id:new ObjectId(String(homeId))});
//   }
// };


