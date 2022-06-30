const router = require("express").Router();
const { isLoggedIn, isLoggedOut } = require('../middlewares/route-guard');
/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
  
});

router.get("/private",isLoggedIn, (req, res, next) => {
  res.render("main/private",{userInSession: req.session.currentUser});
  
});

router.get("/public", (req, res, next) => {
  res.render("main/main");
  
});

module.exports = router;
