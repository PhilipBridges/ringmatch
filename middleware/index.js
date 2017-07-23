var Profile = require("../models/profile");
var User = require("../models/user");
var Team = require("../models/team");


var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
  if(req.isAuthenticated()){
      return next();
  }
  req.flash("error", "You need to be logged in to do that");
  res.redirect("/login");
}

middlewareObj.findUser = function(req, res, next) {
  if(req.isAuthenticated()){
    currentUser = req.user
    next();
  } else {
    currentUser = undefined
   next()
   }
}

middlewareObj.checkProfileOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Profile.findById(req.params.id, function(err, foundProfile){
           if(err){
               req.flash("error", "Profile not found");
               res.redirect("back");
           }  else {
               // does user own the profile?
            if(foundProfile.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("error", "You don't have permission to do that");
                res.redirect("back");
            }
           }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.checkTeamOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Team.findById(req.params.id, function(err, foundTeam){
           if(err){
               req.flash("error", "Profile not found");
               res.redirect("back");
           }  else {
               // does user own the profile?
            if(foundTeam.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("error", "You don't have permission to do that");
                res.redirect("back");
            }
           }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

module.exports = middlewareObj