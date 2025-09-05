
const path = require('path');
const express = require('express');
const hostRouter = express.Router();

const rootDir = require('../utils/pathUtils');
const { getAddHome, postAddHome, getHostHome, getEditHome, postEditHome, deleteHome, postDeleteHome } = require('../controllers/hostController');

hostRouter.get('/add-home', getAddHome)

hostRouter.post('/add-home', postAddHome)

hostRouter.get('/home', getHostHome);

hostRouter.get('/edit-home/:homeId', getEditHome);

hostRouter.post('/edit-home', postEditHome);

hostRouter.post('/delete-home/:homeId', postDeleteHome);




exports.hostRouter = hostRouter;

