var express = require("express"),
    app = express(),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    passport = require("passport"),
    methodOverride = require("method-override"),
    flash        = require("connect-flash"),
    session = require("express-session"),
    cookieParser = require('cookie-parser'),
    LocalStrategy = require('passport-local').Strategy,
    index = require("./routes/index"),
    User = require('./models/user'),
    Profile = require("./models/profile")
    
    // Required routes
    var profileRoutes = require("./routes/profiles");
    var commentRoutes = require("./routes/comments")
    var teamRoutes = require("./routes/teams")
    
    console.log(process.env.DATABASEURL)

// var promise = mongoose.connect('mongodb://localhost/ringmatch', {
//   useMongoClient: true,
// });
mongoose.connect('mongodb://Skele:wade@ds147034.mlab.com:47034/ringmatch')
var url = process.env.databaseURL | "mongodb://localhost/ringmatch"

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(cookieParser('secret'));

// PASSPORT CONFIG
app.use(require('express-session')({
  secret: 'memes',
  resave: false,
  saveUninitialized: false
}));


app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.success = req.flash('success');
   res.locals.error = req.flash('error');
   next();
});

app.use("/", index);
app.use("/profiles", profileRoutes)
app.use("/teams", teamRoutes)
app.use("/profiles/:id/comments", commentRoutes)


app.listen(process.env.PORT, process.env.IP, function(){
  console.log("Server has started");
});

