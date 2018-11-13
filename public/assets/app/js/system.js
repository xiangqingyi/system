
$(document).ready(function() {
   init();
})
function init() {
    // $('#notification_receive_realname').click(show_admin_realname)
    Admin_List_Show();
}


function Sign_Click() {
    const nick = $('#sign_nick_input').val();
    const password = $('#sign_pwd_input').val();
    const signData = {
        nick: nick,
        password: password
    }
    if(nick.length === 0) {
        alert("nick cannot empty");
        return;
    } 
    if(password.length === 0) {
        alert("passwrod cannot empty");
        return;
    }
    axios.post('/system/login',signData)
        .then((response) => {

        }).catch((error) => {
            console.log(error);
        })
}

function Register_Click() {
    const nick = $('#register_nick_input').val();
    const password = $('#register_pwd_input').val();
    const repassword = $('#register_repwd_input').val();
    const realname = $('#register_realname_input').val();
    if (nick.length === 0) {
        alert("nick cannot empty") ;
    }
    if (password != repassword) {
        alert("The password entered twice is different")
    }
    if (realname.length === 0) {
        alert("realname cannot empty");
    }
    const registerData = {
        nick: nick,
        realname:realname,
        password: password,
        repassword: repassword
    }
    axios.post('/system/register',registerData)
       .then((response) => {
           if (response.data.success) {
               alert(response.data.message)
           } else {
               alert(response.data.message)
           }
       }).catch((error) => {
           console.log(error);
       })
}

function Admin_List_Show() {
    axios.get('/system/api/v1/adminAll')
    .then((response) => {
        if(response.data.success) {
            $('#list-tab a').remove();
            $('#nav-tabContent .tab-pane').remove();
            response.data.adminList.forEach(element => {
                $('#list-tab').append('<a id="'+element._id+'" class="list-group-item list-group-item-action"'
                    + 'data-toggle="list" href="#'+element._id+'" role="tab" >'+element.realname +'')
                $('#nav-tabContent').append('<div id = "'+element._id+'" class="tab-pane fade" role="tabpanel">'+element.description+'</div>')
            })
            $('#list-tab a').click(modal_notification_show);
        }
    })
}
// 显示notificationModal  
function modal_notification_show() {
    show_admin_realname();
    $('#nav-tabContent div').removeClass('active show');
    const realname = $(this)[0].innerHTML;
    const adminId= $(this)[0].id;
    $('#nav-tabContent').find('div[id="'+adminId+'"]').addClass('active show')
    console.log(realname);
    console.log(adminId)
    $('#receive_realname').val(realname);
    $('#content_text').val('');
    $('#adminId').val(adminId);
    $('#notificationModal').modal('show');
}
// 获取并显示adminlist到select2插件中
function show_admin_realname() {
    $('.select2').select2();
    $('#notification_receive_realname').val(''); // Select the option with a value of '1'
    $('#notification_receive_realname').trigger('change'); // Notify any JS components that the value changed
    axios.get('/system/api/v1/adminAll')
      .then((response) => {
          if (response.data.success){
              $('#notification_receive_realname option').remove();
              for (let i = 0 ; i < response.data.adminList.length ; i++){
                  $('#notification_receive_realname').append(new Option(response.data.adminList[i].realname,response.data.adminList[i]._id));

              }
          }
      })
}
// sendNotification click 
function send_notification() {
    const adminId = $('#adminId').val();
    const userid = $('#userid_input').val();
    const content = $('#content_text').val();
    const receive = $('#notification_receive_realname').val();
    const notificationData = {
        adminId: adminId,
        content: content,
        receive: receive,

    }
    axios.post('/system/api/v1/notification/'+userid,notificationData)
          .then((response) => {
              if (response.data.success) {
                  alert(response.data.message);
                  $('#notificationModal').modal('hide');
              } else {
                  alert(response.data.message)
              }
          }).catch((error) => {
              console.log(error);
          })
}

