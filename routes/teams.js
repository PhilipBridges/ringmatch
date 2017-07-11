var express = require("express");
var router  = express.Router();
var Team = require("../models/team");
var middleware = require("../middleware");

router.get("/", function(req, res){
  Team.find({}, function(err, allTeams){
    if(err){
      console.log(err);
    } else {
      res.render("teams/index", {teams:allTeams});
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
    var newTeam = {name:name, game:game, bio:bio, author:author}
    Team.create(newTeam, function(err, newlyCreated){
        if(err){
            console.log(err)
        } else {
            console.log(newlyCreated)
            res.redirect("/teams")
        }
     
       
   });
});

router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("teams/new");
});

router.get("/:id", function(req, res){
    Team.findById(req.params.id).populate("comments").exec(function(err, foundTeam){
      console.log(req.body.comments)
        if(err){
            console.log(err);
        } else {
            console.log(foundTeam)
            res.render("teams/show", {team: foundTeam});
        }
    });
});



module.exports = router;