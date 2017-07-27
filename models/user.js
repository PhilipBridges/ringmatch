var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose')
    

var UserSchema = new Schema({
  username: String,
  password: String,
  requests: [{ 
      type: mongoose.Schema.Types.ObjectId,
      ref: "TRequest"
  }],
  profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
      // validate: [arrayLimit, '{PATH} exceeds the limit of 1']
  },
  team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team"
      },
  teamname: {
    type: mongoose.Schema.Types.String,
    ref: "Team",
    default: ""
  },
  
});

// function arrayLimit(val) {
//   return val.length <= 1;
// }

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);