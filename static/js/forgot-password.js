$(function(){
    const axiosInstance = axios.create({
        baseURL: '/api',
        timeout: 1000
    });
    $(document).ready(function(){        
        $('#forgot_password').click(function(){        
            let email = $("#user_email").val();               
            if (!email) {
                return showAlert("Enter your email","error")
            }  
            $("#forgot_password").attr("data-id","0");
            axiosInstance.post('/forgot-password', {
                email: email,           
            }).then(function (response) {   
                if (response.data.success == true) {                
                    $("#forgot_password").attr("data-id",response.data.user_id);
                    showAlert("OTP sent to email successfully","success"); 
                    setTimeout(function () {
                        $('.forgot_section').addClass('d-none');
                        $('.verify_otp_section').removeClass('d-none');
                    }, 1500)          
                   
                }else{
                    return showAlert(response.data.message,"error");
                }
            }).catch(function (error) {
                console.log(error);
            });
         })
         $('#verify_btn').click(function(){
            let otp = $("#user_otp").val(); 
            var userId =$("#forgot_password").attr("data-id");            
            if (!otp) {
                return showAlert("Enter your OTP","error")
            }    
            if (userId=="") {
                return showAlert("Invalid request","error")
            }       
            axiosInstance.post('/verify-otp', {
                otp: otp, 
                userId: userId,             
            }).then(function (response) {
                if (response.data.success == true) { 
                    localStorage.setItem("userId", response.data.userId);                              
                    showAlert("OTP verified successfully","success"); 
                    setTimeout(function () {
                        window.location.href = "/reset-password";
                    }, 1500)   
                }else{
                    return showAlert(response.data.message,"error");
                }
            }).catch(function (error) {
                console.log(error);
            });
         })         
      });
})

