var express = require("express");
var router  = express.Router({mergeParams: true});
var Team = require("../models/team");
var middleware = require("../middleware");
var User = require("../models/user")
var Comment = require("../models/comment")

router.get("/", function(req, res){
  Team.find({}, function(err, allTeams){
    if(err){
      console.log(err);
    } else {
      res.render("teams/index", {teams:allTeams});
    }
  });
});

// NEW TEAM FORM
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("teams/new");
});

// Create new team
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data to post team
    var name = req.body.name;
    var game = {
        gameName: req.body.game,
        gameImg: req.body.game
    }
    var bio = req.body.bio;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newTeam = {name:name, game:game, bio:bio, author:author}
    Team.create(newTeam, function(err, team){
        if(err){
            console.log(err)
        } else {
          team.players.id = req.user._id
          team.players.username = req.user.username
          team.save()
          team.players.push(team)
          console.log(team)
          res.redirect("/teams")
        }
   });
});



// TEAM SHOW PAGE
router.get("/:id", function(req, res){
  Team.findById(req.params.id).populate("players comments").exec(function(err, foundTeam){
    if(err){
      console.log(err);
    } else {
      res.render("teams/show", {team: foundTeam});
    }
  });
});

// COMMENT ON TEAM PAGE
router.get("/:id/comments/new", middleware.isLoggedIn, function(req, res){
  Team.findById(req.params.id, function(err, foundTeam){
    if(err){
      console.log(err)
    } else {
      res.render("comments/new", {profile: "", team: foundTeam})
    }
  })
})

// TEAM COMMENT POST ROUTE
router.post("/:id/comments", middleware.isLoggedIn, function(req, res){
  Team.findById(req.params.id, function(err, team){
    if(err){
      console.log(err)
      res.redirect("/teams")
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
          team.comments.push(comment)
          team.save()
          console.log(comment)
          req.flash("success", "Added comment.");
          res.redirect('/teams/' + team._id);
        }
      })
    }
  })
})






module.exports = router;