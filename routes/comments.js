var express = require("express");
var router  = express.Router({mergeParams: true});
var Profile = require("../models/profile");
var Comment = require("../models/comment")
var middleware = require("../middleware")

// Comment creation page
router.get("/new", middleware.isLoggedIn, function(req, res){
  Profile.findById(req.params.id, function(err, profile){
    if(err){
      console.log(req.params.id)
    } else {
      res.render("comments/new", {profile: profile, team:""});
      console.log(typeof profile)
    }
  })
});

// Comment post route

router.post("/", middleware.isLoggedIn, function(req, res){
  Profile.findById(req.params.id, function(err, profile){
    if(err){
      console.log(err)
      res.redirect("/profiles")
    } else {
      Comment.create(req.body.comment, function(err, comment){
        if(err){
          console.log(err)
        } else {
          // identify the author of comment
          comment.author.id = req.user._id
          comment.author.username = req.user.username
          // saving the comment
          comment.save()
          profile.comments.push(comment)
          profile.save()
          console.log(comment)
          req.flash("success", "Added comment.");
          res.redirect('/profiles/' + profile._id);
        }
      })
    }
  })
})

module.exports = router