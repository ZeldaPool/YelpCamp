var express	= require("express");
var router = express.Router();


var Campground  = 	require("../models/campgrounds")
var Comment  = 	require("../models/comment")
var User	=	require("../models/user")

var passport					= 	require("passport"),
	LocalStrategy				=	require("passport-local"),
	passportLocalMongoose		=	require("passport-local-mongoose")

//========================
//ROUTES
//=======================

router.get("/", function(req,res){
	res.render('landing');
});


//Camp Routes


//Comment Routes


//Authentication ROUTES

//Show REG form
router.get("/register", function(req,res){
	res.render("register")
})

//Handling signup
router.post("/register", function(req,res){
	var newUser= new User({username: req.body.username});
	//req.body.password not using var for password to keep it as a hash
	User.register(newUser, req.body.password, function(err,user){
		if(err){
			console.log(err)
			req.flash("error",err.message);
			return res.redirect("/register")
		}
		passport.authenticate("local")(req, res, function(){
			req.flash("success","You have succesfully created an account "+user.username);
			res.redirect("/campgrounds")
		});
	});
});

//LOGIN Routes

router.get("/login", function(req, res){
	res.render("login")
})

router.post("/login", passport.authenticate("local", 
	{
		successRedirect: "/campgrounds",
		failureRedirect: "/login"
	}), function(req, res){
	
});


//LOGOUT Routes

router.get("/logout", function(req, res){
	req.logout();
	req.flash("success","Successfully Logged Out");
	res.redirect("/");
	
})


//middleware

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next()
	}
	res.redirect("/login");
}

module.exports = router;
