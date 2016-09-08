var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  loginname: {type: String},
  password: {type: String},
  email: {type: String},
  active: {type: Boolean, default: false},
  head: {type:String, default: '/images/default_head.png'},

  create_at: {type: Date, default: Date.now},
  update_at: {type: Date, default: Date.now}

});

mongoose.model('User', UserSchema);