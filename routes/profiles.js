var express = require("express");
var router  = express.Router();
var Profile = require("../models/profile");
var middleware = require("../middleware")


// profile index
router.get("/", function(req, res){
    Profile.find({}, function(err, allProfiles){ 
        if(err){
            console.log(err);
        } else {
            res.render("profiles/index",{profiles:allProfiles});
        }
    });
});

// Create new profile
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data to post to index
    var name = req.body.name;
    var game = {
        gameName: req.body.game,
        gameImg: req.body.game
    }
    console.log(game)
    var bio = req.body.bio;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newProfile = {name:name, game:game, bio:bio, author:author}
    Profile.create(newProfile, function(err, newlyCreated){
        if(err){
            console.log(err)
        } else {
            console.log(newlyCreated)
            res.redirect("/profiles")
        }
     
       
   });
});


// new profile form
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("profiles/new");
});

// profile show page
router.get("/:id", function(req, res){
    Profile.findById(req.params.id).populate("comments").exec(function(err, foundProfile){
      console.log(req.body.comments)
        if(err){
            console.log(err);
        } else {
            console.log(foundProfile)
            res.render("profiles/show", {profile: foundProfile});
        }
    });
});

// EDIT ROUTE
router.get("/:id/edit", middleware.checkOwnership, function(req, res){
    Profile.findById(req.params.id, function(err, foundProfile){
        res.render("profiles/edit", {profile: foundProfile});
    });
});

// UPDATE ROUTE
router.put("/:id", middleware.checkOwnership, function(req, res){
    // find and update the correct profile
    Profile.findByIdAndUpdate(req.params.id, req.body.profile, function(err, updatedProfile){
       if(err){
           res.redirect("/profiles");
       } else {
           res.redirect("/profiles/" + req.params.id);
           console.log(updatedProfile)
       }
    });
});

router.delete("/:id",middleware.checkOwnership, function(req, res){
   Profile.findByIdAndRemove(req.params.id, function(err){
      if(err){
        res.redirect("/profiles");
      } else {
        res.redirect("/profiles");
      }
   });
});

module.exports = router;