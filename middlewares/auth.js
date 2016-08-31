var config = require('../config');
var mongoose = require('mongoose');
var eventproxy = require('eventproxy');
var UserProxy = require('../proxy').User;


exports.gen_session = function(user, res) {
  var auth_token = user._id + '$$$$'; // 以后可能会存储更多信息，用 $$$$ 来分隔
  var opts = {
    path: '/',
    maxAge: 1000 * 60 * 60 * 24 * 30,
    signed: true,
    httpOnly: true
  };
  res.cookie(config.auth_cookie_name, auth_token, opts); //cookie 有效期30天
}

exports.checkUserLogin = function(req, res, next){
  var ep = new eventproxy();
  ep.fail(next);

  res.locals.current_user = null;

  ep.all('get_user', function(user){
    if(!user){
      return next();
    }
    res.locals.current_user = req.session.user = user;

    next();
  })

  if(req.session.user){
    ep.emit('get_user', req.session.user);
  }
  else{
    var token = req.signedCookies[config.auth_cookie_name];
    if(!token){
      return next();
    }

    var _id = token.split('$$$$')[0];
    UserProxy.getUserById(_id, ep.done('get_user'))
  }
}