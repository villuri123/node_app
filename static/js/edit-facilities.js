$(function () {
    
    tinymce.init(
        {
        selector: '#facilities_description',
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
   let image="";
    $('#edit_facilities').click(function () {
        let  facilityId = $(this).attr('data-id');
        let name = $("#facility_name").val();
        var description =$.trim(tinymce.get('facilities_description').getContent());
        let location = $("#location").val();
        let capacity = $("#capacity").val();
        if (!facilityId) {
            return showAlert("Invalid request",'error')
        }
        if (!name) {
            return showAlert("Enter facility name",'error')
        }
        if (!description) {
            return showAlert("Enter description",'error')
        }
        if (!location) {
            return showAlert("Enter location",'error')
        }
        if (!capacity) {
            return showAlert("Enter capacity",'error')
        }
        let formData = new FormData();
        formData.append('facilityId', facilityId);
        formData.append('name',name);
        formData.append('image',image);
        formData.append('description', description);  
        formData.append('location',location);
        formData.append('capacity', capacity);    
        $('.submit-button').addClass('d-none');
        $('.waiting-button').removeClass('d-none');
        $.ajax({
            type: "POST",
            url: '/admin/edit-facilities',
            data: formData,
            dataType: "json",
            cache: false,
            contentType: false,
            processData: false,
            success: function (response) {
                if (response.success == true) {
                    showAlert("Facility updated successfully",'success');
                    if(response.user_role===3){
                        setTimeout(function () {
                            window.location.href = "/admin/facilities";
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

    $('#facilities_image').change(function (e) {
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
                    $('#facilites_image_preview').html("<img title='"+filename+"' src='"+e.target.result+"' style='height:140px'>")
                    image = file;
                };
                reader.readAsDataURL(file);
            });
        }
    })
})