$(function () { 
    tinymce.init(
        {
            selector: '#description',
            forced_root_block: false,
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
    let profile = "";  
    $('#add_testimonials').click(function () {
        let  schoolId = $(this).attr('data-id');
        let name=$("#name").val();
        let designation = $("#designation").val();
        var description = $.trim(tinymce.get('description').getContent());
        if (!schoolId) {
            return showAlert("Invalid",'error')
        }
        if (!name) {
            return showAlert("Enter name",'error')
        }
        if (!profile) {
            return showAlert("Upload profile",'error')
        }
         if (!designation) {
            return showAlert("Enter designation",'error')
        }
        if (!description) {
            return showAlert("Enter description",'error')
        }
        let formData = new FormData();
        formData.append('schoolId', schoolId);
        formData.append('name', name);
        formData.append('profile',profile);
        formData.append('designation',designation);
        formData.append('description', description);
        $('.submit-button').addClass('d-none');
        $('.waiting-button').removeClass('d-none');
        $.ajax({
            type: "POST",
            url: '/admin/add-testimonials',
            data: formData,
            dataType: "json",
            cache: false,
            contentType: false,
            processData: false,
            success: function (response) {
                if (response.success == true) {
                    showAlert("Testimonials added successfully","success");
                    setTimeout(function () {
                        window.location.href = "/admin/testimonials";
                    }, 1500)
                }
                else {
                    $('.submit-button').removeClass('d-none');
                    $('.waiting-button').addClass('d-none');
                    return showAlert(response.data.message,"error");
                
                }
            },
        });

  
    })

    $('#testimonials_profile').change(function (e) {
        var files = e.target.files;
        if ($(this).get(0).files.length != 0) {
            $.each(files, function (i, file) {
                var FileType = files[i].type;
                var filename = files[i].name;              
                var reader = new FileReader();
                reader.onload = function (e) {
                    var fileExtension = FileType.substr((FileType.lastIndexOf('/') + 1));
                    var Extension = fileExtension.toLowerCase();                   
                    if ($.inArray(Extension, ["png", "jpg", "jpeg"]) === -1) {
                        return;
                    }  
                    $('#testimonials_profile_preview').html("<img title='"+filename+"' src='"+e.target.result+"' style='height:140px'>")
                    profile = file;
                };
                reader.readAsDataURL(file);
            });
        }
    })


// delete the testimonials
$('.delete-testimonials').click(function () { 
    testimonialId = $(this).attr('data-id');  
    if (!testimonialId) {
        return showAlert("Invalid request","error")
    }
    $("#delete-testimonials").modal('toggle');
})
$('#delete_testimonials').click(function () {
    let formData=new FormData(); 
    formData.append('testimonialId',testimonialId); 
    $("#delete-testimonials").modal('toggle');
    $.ajax({
        type: "POST",
        url: '/admin/delete-testimonials',           
        data: formData,
        dataType: "json",
        cache: false,
        contentType: false,
        processData: false,
        success: function (response) { 
            if (response.success == true) {
                showAlert("Testimonial deleted successfully","success");   
                setTimeout(function(){                                  
                    window.location.reload();   
                },1500) 
            }
            else {
                return showAlert(response.message,"error");
           } 
        },
    }).catch(function (error) {
        return showAlert(error.message);
    });
})

})