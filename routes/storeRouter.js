 

const path = require('path'); 
const express = require('express');
const storeRouter = express.Router();

const rootDir = require('../utils/pathUtils');
const homeController = require('../controllers/storeController');
 
storeRouter.get('/', homeController.getIndex);
storeRouter.get('/bookings', homeController.getBookings);
storeRouter.post('/bookings', homeController.postBookings);
storeRouter.get('/favourite', homeController.getFavouriteList);
storeRouter.get('/homes', homeController.getHome);
storeRouter.get('/home/:homeId', homeController.getHomeDetails);
storeRouter.post('/favourite', homeController.postAddToFavorite);

storeRouter.post('/favourite-remove', homeController.postRemoveFromFavorite);
storeRouter.post('/booking-remove', homeController.postRemoveFromBooking);

storeRouter.get('/rules/:homeId', homeController.getHouseRulesPdf);

module.exports = storeRouter;
