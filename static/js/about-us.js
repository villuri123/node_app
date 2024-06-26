$(function () {
    tinymce.init(
        {
            selector: '#school_description',
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

    let aboutImage = "";
    $('#add_about_us').click(function () {
        let schoolId = $(this).attr('data-id');
        let schoolName = $("#school_name").val();
        var description = $.trim(tinymce.get('school_description').getContent());
        if (!schoolId) {
            return showAlert("Invalid request", 'error')
        }
        if (!schoolName) {
            return showAlert("Enter school name", 'error')
        }
        if (!description) {
            return showAlert("Enter description", 'error')
        }
        let formData = new FormData();
        formData.append('schoolId', schoolId);
        formData.append('schoolName', schoolName);
        formData.append('image', aboutImage);
        formData.append('description', description);
        $('.submit-button').addClass('d-none');
        $('.waiting-button').removeClass('d-none');
        $.ajax({
            type: "POST",
            url: '/admin/add-about-us',
            data: formData,
            dataType: "json",
            cache: false,
            contentType: false,
            processData: false,
            success: function (response) {
                if (response.success == true) {  
                    showAlert(response.message, "success");
                    if (response.user_role === 3) {
                        setTimeout(function () {
                            window.location.href = "/admin/about-us";
                        }, 1500)
                    } else {
                        setTimeout(function () {
                            window.location.reload();
                        }, 1500)
                    }
                }
                else {
                    $('.submit-button').removeClass('d-none');
                    $('.waiting-button').addClass('d-none');
                    return showAlert(response.message, "error");
                }
            },
        });
    })

    $('#school_image').change(function (e) {
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
                    $('#school_image_preview').html("<img title='" + filename + "' src='" + e.target.result + "' style='height:140px'>")                
                    aboutImage = file;                
                };
                reader.readAsDataURL(file);
            });
        }
    })
})