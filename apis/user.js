var config = require('../config');
var User = require('../proxy').User;
var eventproxy = require('eventproxy');
var validator = require('validator');
var mail = require('../common/mail');
var authMiddleWare = require('../middlewares/auth');
var tools = require('../common/tools');
var utility = require('utility');

exports.login = function(req, res, next){
  var userId = validator.trim(req.body.userId);
  var password = validator.trim(req.body.password);

  var ep = new eventproxy();
  ep.fail(next)

  ep.on('props_err', function(errMsg){
    return res.send({rt: 0, err: errMsg });
  })

  if(userId === '' || password === ''){
    ep.emit('props_err', '用户名密码不能为空');
  }

  if(!tools.validateId){
    ep.emit('props_err', '用户名不合法');
  }

  var getUser;
  if(userId.indexOf('@') != -1){
    getUser = User.getUserByEmail;
  }
  else{
    getUser = User.getUserByName;
  }

  getUser(userId, function(err, user){
    if(!user){
      res.send({rt:0, err: '用户名或密码错误'})
    }

    if(!user.active){
      return ep.emit('props_err', '用户未激活');
    }

    tools.bcompare(password, user.password, ep.done(function(bool){
      if(bool){
        authMiddleWare.gen_session(user, res);
        res.send({rt:1, msg: '登录成功'})
      }
      else{
        ep.emit('props_err', '用户名密码错误');
      }
    }))
  })
}

exports.reg = function(req, res, next){
  var loginname = validator.trim(req.body.loginname).toLowerCase();
  var email = validator.trim(req.body.email).toLowerCase();
  var password = validator.trim(req.body.password);
  var repassword = validator.trim(req.body.repassword);

  var ep = new eventproxy();
  ep.fail(next);
  ep.on('props_err', function(errMsg){
    return res.send({rt: 0, err: errMsg})
  })

  if([loginname, email, password, repassword].some( item => item === '')){
    return ep.emit('props_err', '信息不完整');
  }

  if(!validator.isEmail(email)){
    return ep.emit('props_err', '邮箱不合法');
  }

  if(!tools.validateId(loginname)){
    return ep.emit('props_err', '用户名不合法');
  }

  if(password !== repassword){
    return ep.emit('props_err', '两次密码不相同');
  }

  User.getUserByQuery({'$or':[
    {loginname: loginname},
    {email: email}
  ]},{}, function(err, users){
    if(err){
      return next(err);
    }

    if(users.length > 0){
      return ep.emit('props_err', '用户名或邮箱已被注册');
    }

    tools.bhash(password, ep.done(function(hashpwd){
      User.addUser(loginname, hashpwd, email, false, function(err){
        if(err){
          return next(err);
        }

        mail.sendActiveMail(email, utility.md5(email + hashpwd + config.session_secret), loginname);

        res.send({rt:1, msg:'注册成功'});
      })
    }))
  })
}


exports.activeAccount = function(req, res, next){
  var key = req.query.key;
  var name = req.query.name;

  User.getUserByName(name, function(err, user){
    if(err){
      return next(err);
    }

    if(!user){
      return res.render('notify', {error: '用户不存在，激活失败'});
    }

    console.log(key, utility.md5(user.email + user.password + config.session_secret))

    if( utility.md5(user.email + user.password + config.session_secret) !== key){
      return res.render('notify', {error: '激活码错误，激活失败'});
    }

    user.active = true;

    user.save(function(err){
      if(err){
        return next(err);
      }

      return res.render('notify', {success: '激活成功，请重新登录'});

    });

  })

}










