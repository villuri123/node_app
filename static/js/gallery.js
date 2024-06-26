$(function () {
    let image = "";
    $('#add_gallery').click(function () {
        let schoolId = $(this).attr('data-id');
        if (!schoolId) {
            return showAlert("Invalid", 'error')
        }
        if (!image) {
            return showAlert("Upload image", 'error')
        }
        let formData = new FormData();
        formData.append('schoolId', schoolId);
        formData.append('image', image);
        $('.submit-button').addClass('d-none');
        $('.waiting-button').removeClass('d-none');
        $.ajax({
            type: "POST",
            url: '/admin/add-gallery',
            data: formData,
            dataType: "json",
            cache: false,
            contentType: false,
            processData: false,
            success: function (response) {
                if (response.success == true) {
                    showAlert("Gallery added  successfully", "success");
                    setTimeout(function () {
                        window.location.href = "/admin/gallery";
                    }, 1500)
                }
                else {
                    $('.submit-button').removeClass('d-none');
                    $('.waiting-button').addClass('d-none');
                    return showAlert(response.data.message, "error");
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
                    image = file;
                };
                reader.readAsDataURL(file);
            });
        }
    })
       var galleryId=''
    $(".delete_image").click(function () {
         galleryId = $(this).attr('data-id');
        if (!galleryId) {
            return showAlert("Invalid", 'error')
        }
        $("#delete-image").modal('toggle');
    })
    $('#delete_image').click(function () {
        let formData = new FormData();
        formData.append('galleryId', galleryId);
        $("#delete-image").modal('toggle');
        $.ajax({
            type: "POST",
            url: '/admin/delete-image',
            data: formData,
            dataType: "json",
            cache: false,
            contentType: false,
            processData: false,
            success: function (response) {
                if (response.success == true) {
                    showAlert("Gallery image deleted successfully", "success");
                    if (response.user_role === 3) {
                        setTimeout(function () {
                            window.location.href = "/admin/gallery";
                        }, 1500)
                    } else {
                        setTimeout(function () {
                            window.location.reload();
                        }, 1500)
                    }
                }
                else {
                    return showAlert(response.message, "error");
                }
            },
        });
    })

})

