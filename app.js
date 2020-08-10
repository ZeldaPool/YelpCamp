var express 					= 	require('express'),
	app							= 	express(),
 	bodyParser  				= 	require('body-parser'),
	flash						=	require("connect-flash"),
 	mongoose 					= 	require("mongoose"),
	passport					= 	require("passport"),
	Campground  				= 	require("./models/campgrounds"),
	Comment	    				= 	require("./models/comment"),
	LocalStrategy				=	require("passport-local"),
	passportLocalMongoose		=	require("passport-local-mongoose"),
	methodOverride				= 	require("method-override"),
	seedDB						= 	require("./seeds"),
	User						=	require("./models/user"),
	commentRoutes				=	require("./routes/comments"),
	campgroundRoutes			=	require("./routes/campgrounds"),
	indexRoutes					=	require("./routes/index")

mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true });

//Express Session Config

app.use(require("express-session")({
		secret: "y u do this",
		resave: false,
		saveUninitialized: false
}));
app.use(methodOverride("_method"));

app.use(flash()); //Connect flash use... Nothing else and USE BEFORE PASSPORT CONFIG IDK WHYY

//Passport Config
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())



app.use(function (req, res, next){
	res.locals.currentUser=req.user  //this line will make it available everywhere
	res.locals.redAlert=req.flash("error");
	res.locals.greenAlert=req.flash("success");
	next();
});


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"))

//Seed the Database
//seedDB();


//Just for initial adding camp and testing, replaced by seeding the database
// Campground.create(
// 	{
// 		name: "Karma", 
// 		image: "https://cdn1.sixmorevodka.com/wp-content/uploads/2019/10/08000602/KARMA.jpg?webp=0",
// 		description: "Unbeatable at 10 mana. RITO NERF pls"
		
// 	},function(err,campground){
// 		if(err)
// 		{
// 			console.log(err);
// 		}
// 		else
// 		{
// 			console.log("NEW CAMP");
// 			console.log(campground);
// 		}
// 	}
// )

app.use(indexRoutes);
app.use(campgroundRoutes);
//Can also use ("/campgrounds" campgroundRoutes) and change all /campgrounds in js file to /
app.use(commentRoutes);
//Read about merge params = true for express router

app.listen(3000, function(){
	console.log("WOKAY PORT 3K");
});
