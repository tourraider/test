
// 发邮件
$('#J_send').on('click', function(){
  $.post('/testsendMail', { mail: $('#J_mail').val() });

  setTimeout(function(){
    $.get('/test', (data) => {
      for(var i=0; i<data.length; i++){
        $('.J_emails').append(`<span>${data[i].text}，</span>`)
      }
      $('.J_emails').append('<br>');
    })
  },200);
});

//登录
$('#J_login').on('click', function(){
  var userId = $('#lg_userId').val();
  var password = $('#lg_password').val();

  $.post('/login', {
    userId:userId,
    password:password
  }, function(data){
    if(data.rt){
      $('#login span').html(data.msg).css({color:'blue'});
      setTimeout(function(){
        location.reload();
      },1000);
    }
    else{
      $('#login span').html(data.err).css({color:'red'});
    }
  })
})

// 注册
$('#J_reg').on('click', function(){
  var loginname = $('#username').val();
  var password = $('#password').val();
  var password2 = $('#password2').val();
  var email = $('#email').val();

  $.post('/reg',{
    loginname: loginname,
    password: password,
    repassword: password2,
    email: email
  }, function(data){
    if(data.rt){
      $('#reg span').html(data.msg).css({color:'blue'});
    }
    else{
      $('#reg span').html(data.err).css({color:'red'});
    }
  })
})

//个人信息效果
var _move = true;
$('#user_info_btn').on('click',function(){
  $('#user_info')[ (_move ? 'add' : 'remove') + 'Class']('move');
  $(this).html(_move ? '退下' : '居中')
  _move = !_move;
})

//弹窗修改弹窗
$('#show_user_edit').on('click', function(){
  $('#user_edit_box').addClass('show');
  setTimeout(function(){
    $('#user_info').hide();
  },1000);
})

$('#ue_save').on('click', function(){
  var loginname = $('#ue_name').val();

  $.post('/edit_user', {
    loginname: loginname
  }, function(data){
    if(data.rt){
      $('#user_edit_box').removeClass('show');
      setTimeout(function(){
        $('#user_info').show();
        !_move && $('#user_info_btn').trigger('click');
      },1000)

      $("#user_info .J_username").html(data.user.loginname)
    }
    else{
      alert(data.err);
    }
  })
})


















