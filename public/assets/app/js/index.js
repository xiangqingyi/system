
$(document).ready(function() {
   init();
})
function init() {
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
    axios.post('/.......',signData)
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
    axios.post('/........',registerData)
       .then((response) => {

       }).catch((error) => {
           console.log(error);
       })
}

function Admin_List_Show() {
    axio.get('/........')
    .then((response) => {
        if(response.data.success) {
            $('#list-tab a').remove();
            $('#nav-tabContent .tab-pane').remove();
            response.data.adminList.forEach(element => {
                $('#list-tab').append('<a id="'+element._id+'" class="list-group-item list-group-item-action"'
                    + 'data-toggle="list" href="#'+element._id+'" role="tab" >'+element.realname +'')
                $('#nav-tabContent').append('<div id = "'+element._id+'" class="tab-pane fade" role="tabpanel">'+element.description+'</div>')
            })
            $('#nav-tabContent a').click(modal_notification_show);
        }
    })
}
// 显示notificationModal  
function modal_notification_show() {
    const realname = $(this)[0].text();
    const adminId= $(this)[0].id;
    $('#recipient_realname').val(realname);
    $('#adminId').val(adminId);
    $('#notificationModal').modal('show');
}

// sendNotification click 
function sendnotification() {
    const adminId = $('#adminId').val();
    const content = $('#content_text').val();
    const notificationData = {
        adminId: adminId,
        content: content
    }
    axio.post('/.............',notificationData)
          .then()
}