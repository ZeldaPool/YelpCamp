var express	= require("express");
var router = express.Router();

var Campground  = 	require("../models/campgrounds");
var Comment  = 	require("../models/comment");
var User	=	require("../models/user");

//Middleware
var Middleware = require("../middleware"); 
// No need to specify index.js as its a special file name, when we require folder, the file with that name will automatically be required


router.get("/campgrounds", function(req,res){
	//Getting camps from DB
	Campground.find({}, function(err,campgrounds){
		if(err){
			console.log(err)
		}
		else{
			res.render('campgrounds/campgrounds', {campgrounds:campgrounds});
		}
	})
});

//Create
router.post("/campgrounds",Middleware.isLoggedIn, function(req,res){
	var name=req.body.name;
	var image=req.body.image;
	var desc=req.body.description;
	var author={
		id: req.user._id,
		username: req.user.username
	}
	
	var newCampground= {name: name, image:image, description:desc, author: author}
	//campgrounds.push(newCampground)
	//CREATE NEW CAMP AND SAVE TO DB!
	Campground.create(newCampground,function(err,newCMP){
		if(err){
			console.log(err)
		}
		else{
			//REDIRECT 
			
			res.redirect("/campgrounds");
		}
	})
	
	
});

router.get("/campgrounds/new",Middleware.isLoggedIn, function(req,res){
	res.render("campgrounds/new");
	
});

router.get("/campgrounds/:id", function(req,res){
	Campground.findById(req.params.id).populate("comments").exec(function(err,foundcamp){
		if(err){
			console.log(err)
		}
		else{
			res.render("campgrounds/show", {campground:foundcamp});
		}
	});
	
})

//Edit Routes
router.get("/campgrounds/:id/edit",Middleware.checkCampgroundOwnership, function(req,res){
	Campground.findById(req.params.id, function(err,foundCampground){
		res.render("campgrounds/edit", {campground: foundCampground});			
	});
});

//Update Routes

router.put("/campgrounds/:id", Middleware.checkCampgroundOwnership, function(req,res){
	
	Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
		if(err){
			res.redirect("/campgrounds")
		}
		else{
			req.flash("success","edited Campo");
			res.redirect("/campgrounds/"+req.params.id);
		}
	})
})


//Delete Routes

router.delete("/campgrounds/:id", Middleware.checkCampgroundOwnership, function(req,res){
	//destroy
	Campground.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("/campgrounds");
		}
		else{
			req.flash("error","Deleted Campground");
			res.redirect("/campgrounds");
		}
	})
	
	
});





module.exports = router;