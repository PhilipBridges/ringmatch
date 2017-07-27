var express = require("express");
var router = express.Router({mergeParams: true});
var passport = require('passport');
var User = require('../models/user.js');
var middleware = require("../middleware")
var Team = require("../models/team")
var TRequest = require("../models/teamRequest")

router.get("/", function(req, res){
  res.render("landing");
});

router.get("/about", function(req, res){
    res.render("about");
});

router.get("/register", function(req, res, next){
    if(req.isAuthenticated()){
    req.flash("error", "You are already logged in");
    res.redirect("/");
    } else {
    res.render("register");
    }
});

router.get("/login", function(req,res){
    res.render("login");
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"}),
    function(req, res){
});

router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
           res.render("profiles/new", {user: newUser }); 
        });
    });
});

router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "LOGGED YOU OUT!");
   res.redirect("/");
});

router.get("/:id/account", middleware.isLoggedIn, function(req, res){
  if(req.isAuthenticated){
    User.findById(req.user.id).populate("requests team").exec(function(err, foundUser){
      if(err){
        console.log(err);
      } else {
        res.render("account", {user: foundUser})
      }
    })
  } else {
    req.flash("error", "You need to log in")
  }
})

router.post("/:id/account/confirm/:request", middleware.isLoggedIn, function(req, res){
  User.findById(req.params.id, function(err, user){
    var reqTeam = req.body.confirm
    if(err){
      console.log(err)
    } else {
      TRequest.findById(req.params.request, function(err, foundRequest){
        if(err){
          console.log(err)
        } else {
          user.update({ $set: { team: foundRequest.team.id, teamname: foundRequest.team.name }}).exec();
          user.requests.pull(req.params.request)
          user.save()
          Team.findById(req.user.team, function(err, newTeam){
            if(err){
              console.log(err)
            } else {
            newTeam.players.push(req.user)
            newTeam.save() 
            }
          })
        }
      }) 
    }
    res.redirect("back")
  })
})

router.delete("/:id/account/confirm/:request", middleware.isLoggedIn, function(req, res){
  User.findById(req.params.id, function(err, user){
    console.log(req.params.request)
      if(err){
          console.log("PROBLEM!");
      } else {
        user.requests.pull(req.params.request)
        user.save()
        res.render("back")
      }
    })
});

module.exports = router