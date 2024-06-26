$(function(){
    const axiosInstance = axios.create({
        baseURL: '/api',
        timeout: 1000
    });
    $(document).ready(function(){
        $('#change_password_btn').click(function(){    
            let newPassword = $("#password").val(); 
            let confirmPassword = $("#confirm_password").val();            
            var userId = localStorage.getItem("userId");
            if (!newPassword) {
                return showAlert("Enter new password","error")
            }    
            if (!confirmPassword) {
                return showAlert("Enter confirm password","error")
            } 
            if(newPassword !==confirmPassword){
                return showAlert("Passowrd does not match","error")
            }
            if(!userId){
                return showAlert("Invalid request")
            }       
            axiosInstance.post('/reset-password', {
                newPassword: newPassword, 
                confirmPassword:confirmPassword,
                userId:userId           
            }).then(function (response) {                
                if (response.data.success == true) {    
                    showAlert("Password changed successfully","success"); 
                    setTimeout(function () {
                        window.location.href = "/";
                    }, 1500)          
                   
                }else{
                    return showAlert(response.data.message,"error");
                }
            }).catch(function (error) {
                console.log(error);
            });
         })
    }
    )
})

