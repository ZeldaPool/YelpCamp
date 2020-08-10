var express	= require("express");
var router = express.Router();

var Campground  = 	require("../models/campgrounds")
var Comment  = 	require("../models/comment")
var Middleware = require("../middleware"); 

router.get("/campgrounds/:id/comments/new", Middleware.isLoggedIn, function(req,res){
	Campground.findById(req.params.id, function(err,campground){
		if(err){
		   console.log(err)
		   }
		else{
			res.render("comments/new", {campground:campground})
		}
	})
	
})

router.post("/campgrounds/:id/comments", Middleware.isLoggedIn, function(req,res){
	Campground.findById(req.params.id,function(err,campground){
		if(err){
			console.log(err)
			res.redirect("/campgrounds")
		}
		else{
			Comment.create(req.body.comment, function(err,comment){
				if(err){
					req.flash("error","Something went wrong");
					console.log(err)
				}
				else{
					//Add Username and ID to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					
					//Save Comment
					comment.save();
					campground.comments.push(comment);
					campground.save();
					req.flash("success","Added Comment Successfully");
					res.redirect("/campgrounds/"+campground._id);
				}
			})
		}
	})
	
})

//Edit comments
router.get("/campgrounds/:id/comments/:comment_id/edit",Middleware.checkCommentOwnership, function(req,res){
	
	Comment.findById(req.params.comment_id, function(err,foundComment){
		if(err){
		   console.log(err)
			res.redirect("back");
		   }
		else{
			
			res.render("comments/edit", {campground_id:req.params.id, comment:foundComment})
		}
	})
	
});

//Update Comment

router.put("/campgrounds/:id/comments/:comment_id",Middleware.checkCommentOwnership, function(req,res){
	
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err,updatedComment){
		if(err){
			res.redirect("back")
		}
		else{
			req.flash("success","Comment Edited");
			res.redirect("/campgrounds/"+req.params.id);
		}
	})
})

//Delete Comment

router.delete("/campgrounds/:id/comments/:comment_id",Middleware.checkCommentOwnership, function(req,res){
	//destroy
	Comment.findByIdAndRemove(req.params.comment_id,function(err){
		if(err){
			res.redirect("/campgrounds");
		}
		else{
			req.flash("error","Deleted Comment");
			res.redirect("/campgrounds/"+req.params.id);
		}
	})
	
	
});






module.exports = router;