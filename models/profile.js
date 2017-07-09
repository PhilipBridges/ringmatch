var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    req = require('body-parser');
    

var profileSchema = new Schema({
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
  }
});

module.exports = mongoose.model('Profile', profileSchema);