
const Home = require("../models/homes");
const User = require("../models/user");

const path = require('path');
const rootDir = require('../utils/pathUtils');


exports.getHome = (req, res, next) => {
    Home.find().then((registeredHomes 
    ) =>  res.render('store/home-list', {registeredHomes: registeredHomes, pageTitle: 'Home list', currentPage:'home', isLoggedIn:req.session.isLoggedIn, user: req.session.user }));
}

exports.getBookings = async (req, res, next) => {
  const userId = req.session.user._id;
  const user = await User.findById(userId).populate("bookings");
  res.render("store/bookings", {
    pageTitle: "My Bookings",
    currentPage: "bookings",
    isLoggedIn: req.session.isLoggedIn,
    user: req.session.user,
    bookedHomes: user.bookings
  });
}

exports.getFavouriteList = async (req, res, next) => {
  const userId = req.session.user._id;
  const user = await User.findById(userId).populate("favourites");
  res.render("store/favourite-list", {
    favouriteHomes: user.favourites,
    pageTitle: "My Favourite",
    currentPage: "favourite",
    isLoggedIn: req.session.isLoggedIn,
    user: req.session.user,
  });
};


exports.getIndex = (req, res, next) => {
     Home.find().then((registeredHomes
    ) =>  res.render('store/index', {registeredHomes: registeredHomes, pageTitle: 'airbnb Home', currentPage:'index', isLoggedIn:req.session.isLoggedIn, user: req.session.user }));
}

exports.getHomeDetails = (req, res, next) => {
    const homeid = req.params.homeId;
    
    Home.findById(homeid).then(home => {
        if(!home){
            res.redirect('/homes');
        }
        else{
            res.render('store/home-details', {home: home, pageTitle: 'Home Details', currentPage:'home', isLoggedIn:req.session.isLoggedIn, user: req.session.user })
        }
    })
}

exports.postAddToFavorite = async (req,res,next) => {
    const homeId = req.body.id;
    const userId = req.session.user._id;
    const user = await User.findById(userId);
    if(!user.favourites.includes(homeId)){
        user.favourites.push(homeId);
        await user.save();
    }

    res.redirect('/favourite');
}

exports.postBookings = async (req, res, next) => {
  const homeId = req.body.id;
  const userId = req.session.user._id;
  const user = await User.findById(userId);
  if (!user.bookings.includes(homeId)) {
    user.bookings.push(homeId);
    await user.save();
  }
  res.redirect('/bookings');
};

exports.postRemoveFromFavorite = async (req,res,next) => {

    const homeId = req.body.id;
    const userId = req.session.user._id;

    const user = await User.findById(userId);

    if(user.favourites.includes(homeId)){
        user.favourites = user.favourites.filter(id => id.toString() !== homeId);
        await user.save();
    }
    res.redirect('/favourite');
}

exports.postRemoveFromBooking = async (req, res, next) => {

  const homeId = req.body.id;
  const userId = req.session.user._id;

  const user = await User.findById(userId);

  if (user.bookings.includes(homeId)) {
    user.bookings = user.bookings.filter(id => id.toString() !== homeId);
    await user.save();
  }
  res.redirect('/bookings');
}

exports.getHouseRulesPdf = [
  (req, res, next) => {
    if (!req.session.isLoggedIn) {
      return res.redirect("/login");
    }
    next();
  },

  (req, res, next) => {
    const homeId = req.params.homeId;
    const rulesFileName = "home_rules.pdf";
    const filePath = path.join(rootDir, 'rules', rulesFileName);
    res.download(filePath);
  },
];