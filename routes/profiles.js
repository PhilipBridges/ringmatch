var express = require("express");
var router  = express.Router({mergeParams: true});
var Profile = require("../models/profile");
var middleware = require("../middleware")
var TRequest = require("../models/teamRequest")
var User = require("../models/user")


// profile index
router.get("/", middleware.findUser, function(req, res){
    Profile.find({}, function(err, allProfiles){ 
        if(err){
            console.log(err);
        } else {
            res.render("profiles/index",{profiles:allProfiles, user: currentUser});
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
    var user = User.findById(req.user.id)
    var bio = req.body.bio;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newProfile = {name:name, game:game, bio:bio, author:author}
    Profile.create(newProfile, function(err, profile){
        if(err){
            console.log(err)
            req.flash("error", "You already have a profile")
        } else {
          User.findById(req.user.id).populate("profile").exec
          console.log(profile)
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
        if(err){
            console.log(err);
        } else {
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

// ADD PLAYER PAGE
router.get("/:id/add", middleware.isLoggedIn, function(req, res){
  Profile.findById(req.params.id, function(err, profile){
    if(err){
      console.log(req.params.id)
    } else {
      res.render("profiles/add", {profile: profile});
    }
  })
});

// add player post
router.post("/:id/add", middleware.isLoggedIn, function(req, res){
  User.findById(req.user.id, function(err, user){
    if(err){
      console.log("INIT" + err)
      res.redirect("/profiles")
    } else {
      TRequest.create(req.body.request, function(err, request){
        if(err){
          console.log("CREATE" + err)
        } else {
          request.author.id = req.user.id
          request.author.username = req.user.username
          request.save()
          user.requests.push(request)
          user.save()
          req.flash("success", "Request sent.");
          res.redirect('/profiles/');
        }
      })
    }
  })
})

module.exports = router;