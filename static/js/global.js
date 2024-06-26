function showAlert(message, type) { 
    $('#alert-container-txt').html(message);
    if (type === "success") {
        if ($('#alter-container').hasClass('alert-danger')) {
            $('#alter-container').removeClass('alert-danger').addClass('alert-success');
        }
    } else if (type === "error") {
        if ($('#alter-container').hasClass('alert-success')) {
            $('#alter-container').removeClass('alert-success').addClass('alert-danger');
        }
    }
    $('#alter-container').removeClass('d-none');
    setTimeout(function () {
        $('#alter-container').addClass('d-none');
    }, 1500);
}