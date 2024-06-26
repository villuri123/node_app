$(function () {
    var schoolId = "";
    var type = "";
    $(document).ready(function(){
    $('#myTable').DataTable({
        paging: true, // enable pagination
        pageLength: 10// set number of rows per page
      });
    })
    $('.delete-school').click(function () {
        schoolId = $(this).attr('data-id');
        if (!schoolId) {
            return showAlert("Invalid request","error")
        }
        $("#delete-school").modal('toggle');
    })
    $('#delete_school').click(function () {
        let formData = new FormData();
        formData.append('schoolId', schoolId);
        $("#delete-school").modal('toggle');
        $.ajax({
            type: "POST",
            url: '/admin/delete-school',
            data: formData,
            dataType: "json",
            cache: false,
            contentType: false,
            processData: false,
            success: function (response) {
                if (response.success == true) {
                    showAlert("School deleted successfully","success");
                    setTimeout(function () {
                        window.location.reload();
                    }, 1500)
                }
                else {
                    return showAlert(response.message);
                }
            },
        }).catch(function (error) {
            return showAlert(error.message);
        });
    })
    $('.accept_id').click(function () {
       schoolId = $(this).attr('data-id');
        type = 2;
        if (!schoolId) {
            return showAlert("Invalid school id","error")
        }
        if (!type) {
            return showAlert("Invalid status","error")
        }
        $("#accept-school").modal('toggle');
    })
    $('#accept_school').click(function () {
        let formData = new FormData();
        formData.append('schoolId', schoolId);
        formData.append('type', type);
        $("#accept-school").modal('toggle');
        $.ajax({
            type: "POST",
            url: '/admin/school-status',
            data: formData,
            dataType: "json",
            cache: false,
            contentType: false,
            processData: false,
            success: function (response) {
                if (response.success == true) {
                    showAlert("School accepted successfully","success");
                    setTimeout(function () {
                        window.location.reload();
                    }, 1500)
                }
                else {
                    return showAlert(response.message,"error");
                }
            },
        });
    });
    $('.reject_id').click(function () {
        schoolId = $(this).data('id');
        type = 3;
        if (!schoolId) {
            return showAlert("Invalid school id","error")
        }
        if (!type) {
            return showAlert("Invalid status","error")
        }
        $("#reject-school").modal('toggle');
    })
    $('#reject_school').click(function () {
        let formData = new FormData();
        formData.append('schoolId', schoolId);
        formData.append('type', type);
        $("#reject-school").modal('toggle');
        $.ajax({
            type: "POST",
            url: '/admin/school-status',
            data: formData,
            dataType: "json",
            cache: false,
            contentType: false,
            processData: false,
            success: function (response) {
                if (response.success == true) {
                    showAlert("School rejected successfully","success");
                    setTimeout(function () {
                        window.location.reload();
                    }, 1500)
                }
                else {
                    return showAlert(response.message,"error");
                }
            },
        });
    })

    $('.school_details').click(function () {
        let schoolId = $(this).attr('data-id');
        if (!schoolId) {
            return showAlert("Invalid request","error")
        }
        let formData = new FormData();
        formData.append('schoolId', schoolId);
        $.ajax({
            type: "POST",
            url: '/admin/get-schools',
            data: formData,
            dataType: "json",
            cache: false,
            contentType: false,
            processData: false,
            success: function (response) {
                if (response) {
                    $("#school_name").text(response.school_name)
                    $("#school_address").text(response.address)
                    $("#email").text(response.email)
                    $("#phone").text(response.phone)
                    $("#hostel").text(response.hostel)
                    $("#principle_name").text(response.principle_name)
                    $("#no_of_students").text(response.no_of_students)
                    $("#no_of_teachers").text(response.no_of_teachers)
                    $("#education_type").text(response.education_type)
                    $("#education_level").text(response.education_level)
                    $("#established_date").text(response.established_date)
                    $("#website").text(response.website)
                    $("#description").text(response.description)
                }
                else {
                    return showAlert("Something went wrong,plase check");
                }
            },
        }).catch(function (error) {
            return showAlert(error.message);
        });
    })


});


