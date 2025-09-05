const path = require("path");
require("dotenv").config();
const env = process.env;

const express = require("express");

const storeRouter = require("./routes/storeRouter");
const { hostRouter } = require("./routes/hostRouter");
const rootDir = require("./utils/pathUtils");
const { error } = require("./controllers/error");
const { default: mongoose } = require("mongoose");
const authRouter = require("./routes/authRouter");
const session = require("express-session");
const mongooseSession = require("connect-mongodb-session")(session);
const multer = require('multer');


const DB_PATH = process.env.MONGODB_URI;


const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const store = new mongooseSession({
    uri: DB_PATH,
    collection: "sessions",
});

const randomString = (length) => {
    let result = '';
    const characters = 'abcdefghijklmnopqrstuvwxyz';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
       cb(null, randomString(10) + '-' + file.originalname);
    }
});

app.use(express.urlencoded());
app.use(multer({storage, fileFilter}).single('photo'));
app.use(express.static(path.join(rootDir, "public")));
app.use('/uploads', express.static(path.join(rootDir, "uploads")));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store
}));

app.use(['/host', '/homes', '/favourite', '/bookings', '/home', '/favourite-remove'], (req, res, next) => {
    if(!req.session.isLoggedIn){
        res.redirect('/login');
    }
    else{
        next();
    }
})

app.use(storeRouter);
app.use("/host", hostRouter);

app.use(authRouter);


app.use(error);

const PORT = process.env.PORT || 3000;

mongoose.connect(DB_PATH).then(() => {
    console.log('Connect to mongo db');
    app.listen(PORT, () => {
        console.log(`Server running on the address http://localhost:${PORT}`);
    });
}).catch((error) => {
    console.log('Error while connecting Database', error);
})


