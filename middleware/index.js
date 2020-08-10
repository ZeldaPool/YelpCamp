var Campground  = 	require("../models/campgrounds");
var Comment  = 	require("../models/comment");

//Middlewares go HERE

var middlewareObj= {};

middlewareObj.checkCampgroundOwnership= function(req, res, next){
		//
	if(req.isAuthenticated())
	{
			//if yes, does he own campground?	
		Campground.findById(req.params.id, function(err,foundCampground){
			if(err){
				req.flash("error","Cant find in the database");
				res.redirect("back")
			}
			else{
				
				
			//Site Crashing Bug solution================
					
			// Added this block, to check if foundCampground exists, 
			//and if it doesn't to throw an error via connect-flash and send us back to the homepage     
				if (!foundCampground) {
                    req.flash("error", "Item not found.");
                    return res.redirect("back");
                }
            // If the upper condition is true this will break out of the middleware 
			//and prevent the code below to crash our application
			
			//=========================			
				
				// cant use === or ==  bcoz campground.author.id is mongoose obj while user._id is string
				if(foundCampground.author.id.equals(req.user._id)){
					next();
				}
				else{
					req.flash("error","You dont have the permission to do that");
					res.redirect("back");
				}

			}
		})

	}
	else{
		req.flash("error","You need to be Logged In to do that");
		res.redirect("back");
	}
		//
}


middlewareObj.checkCommentOwnership= function(req, res, next){
	//
	if(req.isAuthenticated())
	{
		//if yes, does he own campground?	
		Comment.findById(req.params.comment_id, function(err,foundComment){
			if(err){
				req.flash("error","You dont have permission to do that");
				res.redirect("back")
			}
			else{
				// cant use === or ==  bcoz campground.author.id is mongoose obj while user._id is string
				if(foundComment.author.id.equals(req.user._id)){
					next();
				}
				else{
					req.flash("error","You dont have permission to do that");
					res.redirect("back");
				}
				
			}
		})
		
	}
	else{
		req.flash("error","You dont have permission to do that");
		res.redirect("back");
	}
	//
	
	
}

middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next()
	}
	req.flash("error", "You need to Log in first.")
	res.redirect("/login");

}


module.exports = middlewareObj;