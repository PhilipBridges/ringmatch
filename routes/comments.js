var express = require("express");
var router  = express.Router();
var Profile = require("../models/profile");
var Comment = require("../models/comment")
var middleware = require("../middleware")

// comment creation page
router.get("/new", middleware.isLoggedIn, function(req, res){
  Profile.findById(req.params.id, function(err, profile){
    if(err){
      console.log(err)
    } else {
      res.render("/comments/new", {profile: profile});
    }
  })
});

// comment posting route
router.post("/", middleware.isLoggedIn, function(req, res){
  Profile.findById(req.params.id, function(err, profile){
    if(err){
      console.log(err);
      res.redirect("/profiles");
    } else {
      Comment.create(req.body.comment, function(err, comment){
        if(err){
          console.log(err)
        } else {
        //add username and id to comment
         comment.author.id = req.user._id;
         comment.author.username = req.user.username;
         //save comment
         comment.save();
         profile.comments.push(comment);
         profile.save();
         console.log(comment);
         req.flash('success', 'Created a comment!');
         res.redirect('/profiles/' + profile._id);
         }
      });
     }
   });
});

module.exports = router