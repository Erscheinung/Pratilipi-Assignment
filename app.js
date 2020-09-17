
var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose").set('debug',true),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    User = require("./models/user"),
    Story = require("./models/stories"),
    seedDB = require("./seeds")


mongoose.Promise = require('bluebird');
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://relight:samplepassword@cluster0.fotre.mongodb.net/Cluster0?retryWrites=true&w=majority";

mongoose
    .connect(uri, {useNewUrlParser: true})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err))

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
// seedDB();

// PASSPORT

app.use(require("express-session")({
    secret: "LOLOLOLOLOL",
    resave: false,
    saveUnitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next();
});

// MAIN ROUTES

app.get("/", function(req,res){
    res.render("landing");
});

// STORY ROUTES

//INDEX - show all stories
app.get("/stories", isLoggedIn,function(req,res){
    // Get all stories from DB
    Story.find({}, function(err,allStories){
       if(err){
           console.log(err);
       } else {
           res.render("stories/index", {stories:allStories, currentUser: req.user});
       }
    });
});


//SHOW - shows more info about one story
app.get("/stories/:id",isLoggedIn,function(req,res){
    //find the story with provided ID
    Story.findById(req.params.id).exec(function(err,foundStory){
       if(err){
           console.log('not found');
       } 
       else {
            var userid = ""+req.user.id;
            var articleId = ""+req.params.id;
            User.find({$and:[
                    {_id: userid},
                    {articlesViewed:articleId}
                    // check if the User has already visited this page
            ]}
            ).exec(function(err,results){
                if(err){
                    console.log(err);
                }
                else{
                    if(results==[]){
                        // if not visited
                        console.log('not visited')
                        // add article id value to User's articleId to remember that the page has been visited
                        User.update(
                            {_id:userid},
                            {$push: {articlesViewed:articleId}}
                        );
                        // increment totalViews value if new user and update in DB
                        Story.update(
                            {_id: req.params.id},
                            {totalViews:totalViews+1}
                        )    
                    }
                    else {
                        console.log('already visited')
                    }
                    Story.update(
                        {_id: req.params.id},
                        {currentViewers:currentViewers+1}
                    )                                   
                }   
            });
            res.render("stories/show", {story: foundStory});
            req.on('close', function(){
                Story.update(
                    {_id: req.params.id},
                    {currentViewers:currentViewers-1}
                )  
            });
       }
    });
});

// ============
// AUTH ROUTES
// ============

//show register form 
app.get("/register", function(req,res){
    res.render("register"); 
 });
 
 //handle sign up logic
 app.post("/register", function(req,res){
     var newUser = new User({username: req.body.username});
     User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        } else {
            passport.authenticate("local")(req,res,function(){
                res.redirect("/stories");
            });
        }
     });
 });
 
 // show login form
 app.get("/login", function(req,res){
    res.render("login"); 
 });
 //handling login logic
 app.post("/login", passport.authenticate("local",
     {
         successRedirect: "/stories",
         failureRedirect: "/login"
     }), function(req,res){
 });
 
 //logout route
 app.get("/logout", function(req,res){
    req.logout();
    res.redirect("/");
 });
 
 function isLoggedIn(req,res,next){
     if(req.isAuthenticated()){
         return next();
     }
     res.redirect("/login");
 }
 

app.listen(process.env.PORT, process.env.IP, () => 
    console.log(`Pratilipi Stories server has started!`))

