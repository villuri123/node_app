$(function () {
    var emailRegx = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const axiosInstance = axios.create({
        baseURL: '/api',
        timeout: 1000
    });
    $('#login_btn').click(function () {
        let username = $("#user_email").val();
        let password = $("#password").val();
        if (!username) {
            return showAlert("Enter email",'error')
        }
        if (!emailRegx.test(username)) {
            return showAlert("Enter valid email",'error')
        }
         if (!password) {
            return showAlert("Enter password",'error')
        }
        axiosInstance.post('/login', {
            user_name: username,
            password: password
        }).then(function (response) {
            if (response.data.success == true) {
                showAlert("Successfully loged In","success");
                if(response.data.user_role == 1 || response.data.user_role == 2){
                    setTimeout(function () {
                        window.location.href = "/admin/schools";
                    }, 1500)
                }else{
                    setTimeout(function () {
                        window.location.href = "/admin/about-us";
                    }, 1500)
                }
            }
            else{
                return showAlert(response.data.message,"error");
            }
        }).catch(function (error) {
            console.log(error);
        });
    })
    $(document).keypress(function(event){
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if(keycode == '13'){
          $('#login_btn').click();
        }
      });
    

})
