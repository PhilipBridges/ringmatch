var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    

var teamSchema = new Schema({
  name: String,
  game: {
        gameName: String,
        gameImg: String
  },
  bio: String,
  author: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      username: String
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }],
    players: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile"
    }]
});

module.exports = mongoose.model('Team', teamSchema);