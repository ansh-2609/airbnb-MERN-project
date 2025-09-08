const { check, validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt = require('bcryptjs');



exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Login",
    currentPage: "Login",
    isLoggedIn: false,
    errorMessages: [],
    oldInput: { email: "" },
    user: {}
  });
};

exports.postLogin = async (req, res, next) => {

  const {email, password} = req.body;
  const user = await User.findOne({email:email});

  if(!user){
    return res.status(401).render("auth/login", {
      pageTitle: "Login",
      currentPage: "Login",
      isLoggedIn: false,
      errorMessages: ["Invalid email or password"],
      oldInput: { email: email},
      user: {}
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).render("auth/login", {
      pageTitle: "Login",
      currentPage: "Login",
      isLoggedIn: false,
      errorMessages: ["Invalid email or password"],
      oldInput: { email: email },
      user: {}
    });
  }

  req.session.isLoggedIn = true;
  req.session.user = user;
  await req.session.save();
  res.redirect("/");
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    pageTitle: "Signup",
    currentPage: "Signup",
    isLoggedIn: false,
    errorMessages: [],
    oldInput: { firstname: "", lastname: "", email: "", userType: "" },
    user: {}
  });
};


exports.postSignup = [

  check("firstname")
    .trim()
    .isLength({ min: 2 })
    .withMessage("First name must be at least 2 characters long")
    .matches(/^[a-zA-Z]+$/)
    .withMessage("First name must contain only letters"),

  check("lastname")
    .matches(/^[a-zA-Z]+$/)
    .withMessage("Last name must contain only letters"),

  check("email")
    .isEmail()
    .withMessage("Please enter a valid email address")
    .normalizeEmail(),

  check("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number")
    .matches(/[!@#$%^&*]/)
    .withMessage("Password must contain at least one special character")
    .trim(),

  check("confirmpassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match");
    }
    return true;
  }),

  check("userType")
    .notEmpty()
    .withMessage("Please select a user type")
    .isIn(["guest", "host"])
    .withMessage("Invalid user type"),

  check("terms")
    .notEmpty()
    .withMessage("You must accept the terms and conditions")
    .custom((value, { req }) => {
      if (!value) {
        throw new Error("You must accept the terms and conditions");
      }
      return true;
    }),

  (req, res, next) => {
    const { firstname, lastname, email, password, userType } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).render("auth/signup", {
        pageTitle: "Signup",
        currentPage: "Signup",
        isLoggedIn: false,
        errorMessages: errors.array().map((err) => err.msg),
        oldInput: {
          firstname,
          lastname,
          email,
          password,
          userType,
        },
        user: {}
      });
    }

    bcrypt.hash(password, 12)
    .then(hashedPassword => {
      const user = new User({
        firstname,
        lastname,
        email,
        password: hashedPassword,
        userType,
      });
      return user.save();
    }).then(() => {
        res.redirect("/login");
      }).catch((err) => {
        console.error(err);
        return res.status(422).render("auth/signup", {
          pageTitle: "Signup",
          currentPage: "Signup",
          isLoggedIn: false,
          errorMessages: [err],
          oldInput: {
            firstname,
            lastname,
            email,
            password,
            userType,
          },
          user: {}
        });
    });
  }
]
