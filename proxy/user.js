var model = require('../models');
var User = model.User;

exports.addUser = function(loginname, password, email, active, cb){
  var user = new User();

  user.loginname = loginname;
  user.password = password;
  user.email = email;
  user.active = active || false;

  user.save(cb);

}

exports.getUserById = function(id, cb){
  User.findOne({_id: id}, cb);
}

exports.getUserByQuery = function(query, opt, cb){
  User.find(query, '', opt, cb);
}

exports.getUserByName = function(name, cb){
  User.findOne({loginname: name}, cb);
}

exports.getUserByEmail = function(email, cb){
  User.findOne({email: email}, cb);
}











