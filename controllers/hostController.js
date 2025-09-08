const Home = require("../models/homes");
const User = require("../models/user");
const fs = require('fs');

exports.getAddHome = (req, res, next) => {
    res.render('host/edit-home', {pageTitle: 'Add Home To airbnb', currentPage: 'addHome', editing:false, isLoggedIn:req.session.isLoggedIn, user: req.session.user });
}

exports.getEditHome = (req, res, next) => {
    const homeId = req.params.homeId;
    const editing = req.query.editing === 'true';

    Home.findById(homeId).then(home => {

        if(!home){
            console.log('Home not found for editing');
            return res.redirect('/host/home');
        }

        res.render('host/edit-home', {pageTitle: 'Edit your Home', currentPage: 'host-home', editing:editing,
        home:home, isLoggedIn:req.session.isLoggedIn, user: req.session.user });

    })

    
}

exports.postAddHome = (req, res, next) => {

    const {houseName, pricePerNight, location, rating, description} = req.body;

    if(!req.file){
        return res.status(400).send('No file uploaded');
    }

    const photo = req.file.path;

    const home = new Home({houseName,pricePerNight,location,rating,photo, description});
    home.save().then(() => {
        console.log('Home save successfully');
    });

    res.redirect('/host/home');
} 

exports.postEditHome = (req, res, next) => {

    const {houseName, pricePerNight, location, rating, description, id} = req.body;
    Home.findById(id).then((home) => {
        home.houseName = houseName;
        home.pricePerNight = pricePerNight;
        home.location = location;
        home.rating = rating;
        home.description = description;

        if(req.file){
            fs.unlink(home.photo, (err) => {
                if (err) {
                    console.error('Error deleting old photo:', err);
                }
            });
            home.photo = req.file.path;
        }

        home.save().then((result) => {
            console.log('Home added successfully', result);
        }).catch((error) => {
            console.log('Error while updating home', error);
        }).finally(() => {
            res.redirect('/host/home');
        })
    }).catch((error) => {
        console.log('Error while finding home', error);
    })
} 

exports.getHostHome = (req, res, next) => {
  Home.find().then((registeredHomes) => {
    res.render("host/host-home-list", {
      registeredHomes: registeredHomes,
      pageTitle: "Host Home list",
      currentPage: "host-home",
      isLoggedIn: req.session.isLoggedIn,
      user: req.session.user,
    });
  });
};


exports.postDeleteHome = async (req, res, next) => {
  const homeId = req.params.homeId;

  const home = await Home.findById(homeId);

  fs.unlink(home.photo, (err) => {
    if (err) {
      console.error("Error deleting old photo:", err);
    }
  });

  await Home.findByIdAndDelete(homeId);

  await User.updateMany(
    { favourites: homeId }, // find users who have this homeId in favourites
    { $pull: { favourites: homeId } } // remove it from the array
  );

  await User.updateMany(
    { bookings: homeId }, // find users who have this homeId in bookings
    { $pull: { bookings: homeId } } // remove it from the array
  );

  console.log("Home deleted successfully");
  res.redirect("/host/home");
};
