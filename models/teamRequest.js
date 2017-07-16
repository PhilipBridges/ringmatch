var mongoose = require("mongoose");
var moment = require('moment');
var i = new Date;
var date = i.toDateString();
var time = i.toLocaleTimeString();

var tRequestSchema = mongoose.Schema({
    text: String,
    date : {type: String, default: date},
    time: {type: String, default: time},
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String,    
    }
});

module.exports = mongoose.model("TRequest", tRequestSchema);