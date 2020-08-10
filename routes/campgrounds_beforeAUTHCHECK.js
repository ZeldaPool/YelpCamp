var express	= require("express");
var router = express.Router();

var Campground  = 	require("../models/campgrounds")
var Comment  = 	require("../models/comment")
var User	=	require("../models/user")

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
router.post("/campgrounds",isLoggedIn, function(req,res){
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

router.get("/campgrounds/new",isLoggedIn, function(req,res){
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
router.get("/campgrounds/:id/edit", function(req,res){
	//is logged or not
	if(req.isAuthenticated())
	{
		//if yes, does he own campground?	
		Campground.findById(req.params.id, function(err,foundCampground){
			if(err){
				res.redirect("/campgrounds")
			}
			else{
				// cant use === or ==  bcoz campground.author.id is mongoose obj while user._id is string
				if(foundCampground.author.id.equals(req.user._id)){
					res.render("campgrounds/edit", {campground: foundCampground});
				}
				else{
					res.send("NO PERMISSION TO DO THAT")
				}
				
			}
		})
		
	}
	else{
		res.send("LOGIN TO DO THAT")
	}
		
	
})

//Update Routes

router.put("/campgrounds/:id", function(req,res){
	
	Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
		if(err){
			res.redirect("/campgrounds")
		}
		else{
			res.redirect("/campgrounds/"+req.params.id);
		}
	})
})


//Delete Routes

router.delete("/campgrounds/:id", function(req,res){
	//destroy
	Campground.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("/campgrounds");
		}
		else{
			res.redirect("/campgrounds");
		}
	})
	
	
});


function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next()
	}
	res.redirect("/login");
}

function checkCampgroundOwnership(req, res, next){
	//
	if(req.isAuthenticated())
	{
		//if yes, does he own campground?	
		Campground.findById(req.params.id, function(err,foundCampground){
			if(err){
				res.redirect("back")
			}
			else{
				// cant use === or ==  bcoz campground.author.id is mongoose obj while user._id is string
				if(foundCampground.author.id.equals(req.user._id)){
					next();
				}
				else{
					res.redirect("back");
				}
				
			}
		})
		
	}
	else{
		res.redirect("back");
	}
	//
}

module.exports = router;