const bcrypt = require('bcryptjs');
const router = require("express").Router();
const UserModel = require("../models/User.model")
const mongoose = require('mongoose')
var validator = require('validator');
const { isLoggedIn, isLoggedOut } = require('../middlewares/route-guard');

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
  
});



router.get("/signup",isLoggedOut, (req, res, next) => {
  res.render('auth/signup');
  
});

router.post("/signup",isLoggedOut, async (req, res, next) => {
  
  const { username, password } = req.body;
  
  //const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!validator.isStrongPassword(password)) {
    res
      .status(500)
      .render('auth/signup', { errorMessage: 'Password needs to have at least 8 chars and must contain at least one number, one lowercase and one uppercase letter and especial caracter.' });
  }
  if(!username || !password){
    res
      .status(500)
      .render('auth/signup', { errorMessage: 'All fields are mandatory. Please provide your username and password.'});
  }
  try {

    const newUser = await UserModel.create({
        username,
        password
      })

    res.redirect('/auth/userProfile');
    
  } catch (error) {
    
    if(error instanceof mongoose.Error.ValidationError){
      res.status(500).render('auth/signup', { errorMessage: error.message });
    
    }else if(error.code === 11000){
      
      res.status(500).render('auth/signup', {
        errorMessage: 'Username need to be unique.'
     });
    }
  }  
});

router.get('/userProfile',isLoggedIn,(req,res)=>{
  console.log(req.session.currentUser)
  res.render('users/user-profile',{userInSession: req.session.currentUser})
})

router.get("/login",isLoggedOut, (req, res, next) => {
    res.render('auth/login');
    
  });


router.post("/login",isLoggedOut,async (req, res, next) => {
  
  const { username, password } = req.body;
 
  if (!username || !password) {
    res.render('auth/login', {
      errorMessage: 'Please enter both, username and password to login.'
    });
  }
 
  const user = await UserModel.findOne({ username })
    try {
      if (!user) {
        res.render('auth/login', { errorMessage: 'User is not registered.' });
      } else if (bcrypt.compareSync(password, user.password)) {
        req.session.currentUser = user;
        res.redirect('/auth/userProfile')
      } else {
        res.render('auth/login', { errorMessage: 'Incorrect password.' });
      }
    } catch (error) {
      console.log(error)
    }
    
});

router.post('/logout',isLoggedIn, (req, res, next) => {
  req.session.destroy(err => {
    if (err) next(err);
    res.redirect('/');
  });
});

module.exports = router;
