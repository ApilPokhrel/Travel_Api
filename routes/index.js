const router = require('express').Router();
const UserApi = require('../src/user/user.api.routes');
const Auth = require("../middleware/Authenticate");
const PlaceApi = require("../src/place/place.api.routes");

router.get("/", Auth.AuthorizeUi, (req, res, next)=>{
     res.render("index.ejs");
});

router.get("/login", (req, res, next)=>{
    res.render("login.ejs");
});


router.use("/api/v1/user", UserApi);
router.use("/api/v1/place", PlaceApi);



module.exports = router;