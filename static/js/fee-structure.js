
$(function () {    
    tinymce.init(
        {
            selector: '#school_fee',
            forced_root_block: false,
            height:250,
            plugins: [
                'advlist autolink lists link image charmap print preview hr anchor pagebreak',
                'searchreplace wordcount visualblocks visualchars code fullscreen',
                'insertdatetime media nonbreaking save table contextmenu directionality',
                'emoticons template paste textcolor colorpicker textpattern imagetools codesample',
                'image code',
                'placeholder'
            ],
            menubar: true,
            statusbar: false,
            toolbar: 'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
            image_title: true,
            automatic_uploads: true,
            /* paste_as_text: true,*/
            paste_data_images: true,
            file_picker_types: 'image',
        }
    ); 
    $('#add_fee_structure').click(function () {
        let  schoolId = $(this).attr('data-id'); 
        let title = $("#title").val();        
        var fees =$.trim(tinymce.get('school_fee').getContent());
      
        if (!schoolId) {
            return showAlert("Invalid request",'error')
        }
        if (!title) {
            return showAlert("Enter title",'error')
        }
        if (!fees) {
            return showAlert("Enter fees details",'error')
        }
        let formData = new FormData();
        formData.append('schoolId', schoolId);
        formData.append('title',title);
        formData.append('fees',fees);
        $('.submit-button').addClass('d-none');
        $('.waiting-button').removeClass('d-none');
        $.ajax({
            type: "POST",
            url: '/admin/add-fee-structure',
            data: formData,
            dataType: "json",
            cache: false,
            contentType: false,
            processData: false,
            success: function (response) {
                if (response.success == true) {
                    showAlert(response.message,"success");
                    if(response.user_role===3){
                        setTimeout(function () {
                            window.location.href = "/admin/fee-structure";
                        }, 1500) 
                    }else{
                        setTimeout(function () {
                            window.location.href = "/admin/schools";
                        }, 1500)
                    }
                }
                else {
                    $('.submit-button').removeClass('d-none');
                    $('.waiting-button').addClass('d-none');
                    return showAlert(response.message,"error");
                }
            },
        });
    })

})