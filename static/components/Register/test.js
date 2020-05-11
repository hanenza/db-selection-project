$(document).ready(function () {
    $('.registerForm').validate({
        rules: {
            username: {
                required: true,
                rangelength: [5, 20],
                remote: {
                    url: 'core/check.php',
                    type: "post",
                    data: {
                        username: function () {
                            return $("#username").val();
                        }
                    }
                }
            },
            password: {
                required: true,
                rangelength: [5, 20]
            },
            confirmpassword: {
                required: true,
                rangelength: [5, 20],
                equalTo: password
            },
            email: {
                required: true,
                remote: {
                    url: 'core/check.php',
                    type: "post",
                    data: {
                        email: function () {
                            return $("#email").val();
                        }
                    }
                }
            },
            code: {
                required: true,
                remote: {
                    url: 'core/check.php',
                    type: "post",
                    data: {
                        code: function () {
                            return $("#code").val();
                        }
                    }
                }
            }
        },
        messages: {
            username: {
                required: "Enter a username.",
                rangelength: "Username must be 5 to 20 character",
                remote: "Username have been taken"
            },
            password: {
                required: "Enter a password.",
                rangelength: "Password must be 5 to 20 character",
                remote: "Email have been taken"
            },
            confirmpassword: {
                required: "Confirm your password.",
                rangelength: "Password must be 5 to 20 character",
                equalTo: "Your password does not match"
            },
            email: {
                required: "Enter your email(NOT SPAM EMAIL).",
                remote: "This Email have been taken"
            },
            code: {
                required: "Enter your Register Code",
                remote: "Invalid code or used code"
            }
        },
        highlight: function (element) {
            $(element).closest('.form-group').removeClass('has-success').addClass('has-error').find('.col-sm-10 span').removeClass('glyphicon glyphicon-ok form-control-feedback').addClass('glyphicon glyphicon-remove form-control-feedback');
        },
        success: function (element) {
            $(element).closest('.form-group').removeClass('has-error').addClass('has-success').find('.col-sm-10 span').removeClass('glyphicon glyphicon-remove form-control-feedback').addClass('glyphicon glyphicon-ok form-control-feedback');
            
        }
    });
});