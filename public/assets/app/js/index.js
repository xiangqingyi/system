
$(document).ready(function() {
   init();
})
function init() {
    get_all_admin_list();
}


function get_all_admin_list() {
    axio.get()
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