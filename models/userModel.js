const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  userName: String,
  gamesPlayed: Number,
  wins: Number,
  dateJoined: Date,
});

module.exports = mongoose.model("UserModel", userSchema);
