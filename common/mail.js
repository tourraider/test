var nodemailer = require('nodemailer');
var config = require('../config');
var SITE_ROOT_URL = `http:\/\/${config.debug ? config.dev_host : config.hostname}:${config.port}`;

var transporter = nodemailer.createTransport(`smtp:\/\/${config.mail_form}:${config.mail_pass}@smtp.qq.com`);
var from = `${config.siteName} <${config.mail_form}>`;

function _toSendMail(mailOptions){
  transporter.sendMail(mailOptions, function(error, info){
      if(error){
          return console.log(error);
      }
      console.log('Message sent: ' + info.response);
  });
}

exports.sendDefaultMail = function(to){
  _toSendMail({
    from: from,
    to: to,
    subject: 'hello 兄弟',
    html: '<div>我和你好的!</div>'
  });
}

exports.sendActiveMail = function(to, token, name){
  var subject = '账户激活';
  var html = `
    <p>您好：</p>
      <p>请点击下面的链接来激活帐户：</p>
      <a href="${SITE_ROOT_URL}/active_account?key=${token}&name=${name}">激活链接</a>`;

  _toSendMail({
    from: from,
    to: to,
    subject: subject,
    html: html
  });
}

exports.sendReChangePwd = function(to, token, name){
  var subject = '密码重置';
  var html = `
    <p>您好：${name}</p>
    <p>我们收到您在${config.name}社区重置密码的请求，请在24小时内单击下面的链接来重置密码：</p>
    <a href="${SITE_ROOT_URL}/reset_pass?key=${token}&name=${name}">重置密码链接</a>
    <p>若您没有在${config.name}社区填写过注册信息，说明有人滥用了您的电子邮箱，请删除此邮件，我们对给您造成的打扰感到抱歉。</p>
    <p>${config.name}社区 谨上。</p>`;

  _toSendMail({
    from: from,
    to: to,
    subject: subject,
    html: html
  });

}