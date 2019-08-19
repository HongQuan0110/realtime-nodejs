let userAvatar = null;
let userInfo = {};
let originAvatarSrc = null;
let originUserInfo = {};
let userUpdatePassword = {};

function callLogout() {
    let timerInterval;
    Swal.fire({
        position: "top-end",
        type: "success",
        title: "Auto logout after 5 seconds",
        html: "Time: <strong></strong>",
        showConfirmButton: false,
        timer: 5000,
        onBeforeOpen: () => {
            Swal.showLoading();
            timerInterval = setInterval(() => {
                Swal.getContent().querySelector("strong").textContent = Math.ceil(Swal.getTimerLeft() / 1000);
            }, 1000);
        },
        onClose: () => {
            clearInterval(timerInterval);
        }
    }).then(result => {
        $.get("/logout", function(){
            location.reload();
        })
    })
}

function updateUserInfo() {
    $("#input-change-avatar").bind("change", function () {
        let fileData = $(this).prop("files")[0];
        console.log(fileData.type);
        let match = ["image/png", "image/jpg", "image/jpeg"];
        let limit = 1048576;

        if ($.inArray(fileData.type, match) === -1) {
            alertify.notify("File not match, allow png, jpg and jpeg", "error", 5);
            $(this).val(null);
            return false;
        }

        if (fileData.size > limit) {
            alertify.notify("Upload image limit 1MB", "error", 5);
            $(this).val(null);
            return false;
        }

        if (typeof (FileReader) != "undefined") {
            let imagePreview = $("#image-edit-profile");
            imagePreview.empty();
            let fileReader = new FileReader();
            fileReader.onload = function (element) {
                $("<img />", {
                    "src": element.target.result,
                    "class": "avatar img-circle",
                    "id": "user-modal-avatar",
                    "alt": "avatar"
                }).appendTo(imagePreview);
            }

            imagePreview.show();
            fileReader.readAsDataURL(fileData);

            let formData = new FormData();
            formData.append("avatar", fileData);

            userAvatar = formData;
        }
        else {
            alertify.notify("Your browser not support FileReader", "error", 5);
        }
    })

    $("#input-change-username").bind("change", function () {
        let username = $(this).val();
        let regex = new RegExp(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/);

        if (!regex.test(username) || username.length < 3 || username.length > 17) {
            alertify.notify("Username limit from 3-17 characters and do not contain special characters", "error", 5);
            $(this).val(originUserInfo.username);
            delete userInfo.username;
            return;
        }

        userInfo.username = username;
    })

    $("#input-change-gender-male").bind("click", function () {
        let gender = $(this).val();

        if (gender !== "male") {
            alertify.notify("Oops! Data gender have something wrong", "error", 5);
            // $(this).val(originUserInfo.gender);
            delete userInfo.gender;
            return;
        }

        userInfo.gender = gender;
    })

    $("#input-change-gender-female").bind("click", function () {
        let gender = $(this).val();

        if (gender !== "female") {
            alertify.notify("Oops! Data gender have something wrong", "error", 5);
            // $(this).val(originUserInfo.gender);
            delete userInfo.gender;
            return;
        }

        userInfo.gender = gender;
    })

    $("#input-change-address").bind("change", function () {
        let address = $(this).val();

        if (address.length < 3 || address.length > 30) {
            alertify.notify("Address limit from 3-30 characters", "error", 5);
            $(this).val(originUserInfo.address);
            delete userInfo.address;
            return;
        }

        userInfo.address = address;
    })

    $("#input-change-phone").bind("change", function () {
        let phone = $(this).val();
        let regex = new RegExp(/^(0)[0-9]{9,10}$/);

        if (!regex.test(phone)) {
            alertify.notify("Phone must begin from 0 and limit about 10-11 numbers", "error", 5);
            $(this).val(originUserInfo.phone);
            delete userInfo.phone;
            return;
        }

        userInfo.phone = phone;
    })

    $("#input-change-current-password").bind("change", function () {
        let currentPassword = $(this).val();
        let regexPassword = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/);

        if (!regexPassword.test(currentPassword)) {
            alertify.notify("Password must have least 8 characters, include capitalize, lowercase and special characters", "error", 5);
            $(this).val(null);
            delete userUpdatePassword.currentPassword;
            return;
        }

        userUpdatePassword.currentPassword = currentPassword;
    })

    $("#input-change-new-password").bind("change", function () {
        let newPassword = $(this).val();
        let regexPassword = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/);

        if (!regexPassword.test(newPassword)) {
            alertify.notify("Password must have least 8 characters, include capitalize, lowercase and special characters", "error", 5);
            $(this).val(null);
            delete userUpdatePassword.newPassword;
            return;
        }

        userUpdatePassword.newPassword = newPassword;
    })

    $("#input-change-confirm-new-password").bind("change", function () {
        let confirmPassword = $(this).val();

        if (!userUpdatePassword.newPassword) {
            alertify.notify("You have not enter new password", "error", 5);
            $(this).val(null);
            delete userUpdatePassword.confirmPassword;
            return;
        }

        if (confirmPassword !== userUpdatePassword.newPassword) {
            alertify.notify("Password do not match", "error", 5);
            $(this).val(null);
            delete userUpdatePassword.confirmPassword;
            return;
        }

        userUpdatePassword.confirmPassword = confirmPassword;
    })
}

function callUpdateUserAvatar() {
    $.ajax({
        url: "/user/update-avatar",
        type: "put",
        cache: false,
        contentType: false,
        processData: false,
        data: userAvatar,
        success: function (result) {
            // Display success
            $(".user-modal-alert-success").find("span").text(result.message);
            $(".user-modal-alert-success").css("display", "block");

            // Update avatar at navbar
            $("#navbar-avatar").attr("src", result.imageSrc);

            // Update orign avatar src
            originAvatarSrc = result.imageSrc;

            // Reset all
            $("#input-btn-cancel-update-user").click();
        },
        error: function (error) {
            // Display error
            $(".user-modal-alert-error").find("span").text(error.responseText);
            $(".user-modal-alert-error").css("display", "block");

            // Reset all
            $("#input-btn-cancel-update-user").click();
        }
    })
}

function callUpdateUserInfo() {
    $.ajax({
        url: "/user/update-info",
        type: "put",
        data: userInfo,
        success: function (result) {
            // Display success
            $(".user-modal-alert-success").find("span").textContent = result.message;
            $(".user-modal-alert-success").css("display", "block");

            // Update origin user info
            originUserInfo = Object.assign(originUserInfo, userInfo);

            // Update username at navbar
            $("#navbar-username").text(originUserInfo.username);

            // Reset all
            $("#input-btn-cancel-update-user").click();
        },
        error: function (error) {
            // Display error
            $(".user-modal-alert-error").find("span").text(error.responseText);
            $(".user-modal-alert-error").css("display", "block");

            // Reset all
            $("#input-btn-cancel-update-user").click();
        }
    })
}

function callUpdateUserPassword() {
    $.ajax({
        url: "/user/update-password",
        type: "put",
        data: userUpdatePassword,
        success: function (result) {
            // Display success
            $(".user-modal-password-alert-success").find("span").text(result.message);
            $(".user-modal-password-alert-success").css("display", "block");

            // Reset all
            $("#input-btn-cancel-update-user-password").click();

            // Logout after change password success
            callLogout();
        },
        error: function (error) {
            // Display error
            $(".user-modal-password-alert-error").find("span").text(error.responseText);
            $(".user-modal-password-alert-error").css("display", "block");

            // Reset all
            $("#input-btn-cancel-update-user-password").click();
        }
    })
}

$(document).ready(function () {
    updateUserInfo();
    originAvatarSrc = $("#user-modal-avatar").attr("src");
    originUserInfo = {
        username: $("#input-change-username").val(),
        gender: $("#input-change-gender-male").is(":checked") ? $("#input-change-gender-male").val() : $("#input-change-gender-female").val(),
        address: $("#input-change-address").val(),
        phone: $("#input-change-phone").val()
    }

    $("#input-btn-update-user").bind("click", function () {
        if ($.isEmptyObject(userInfo) && !userAvatar) {
            alertify.notify("You must change info before update", "error", 5);
            return;
        }

        if (userAvatar) {
            callUpdateUserAvatar();
        }

        if (!$.isEmptyObject(userInfo)) {
            callUpdateUserInfo();
        }
        // console.log(userAvatar);
        // console.log(userInfo);
    })

    $("#input-btn-cancel-update-user").bind("click", function () {
        userAvatar = null;
        userInfo = {};
        $("#input-change-avatar").val(null);
        $("#user-modal-avatar").attr("src", originAvatarSrc);

        $("#input-change-username").val(originUserInfo.username);
        originUserInfo.gender === "male" ? $("#input-change-gender-male").click() : $("#input-change-gender-female").click();
        $("#input-change-address").val(originUserInfo.address);
        $("#input-change-phone").val(originUserInfo.phone);
    })

    $("#input-btn-update-user-password").bind("click", function () {
        if (!userUpdatePassword.currentPassword || !userUpdatePassword.newPassword || !userUpdatePassword.confirmPassword) {
            alertify.notify("You must change info before update", "error", 5);
            return;
        }

        Swal.fire({
            title: "Are you sure to change password ?",
            text: "You won't be able to revert this!",
            type: "info",
            showCancelButton: true,
            confirmButtonColor: "#2ECC71",
            cancelButtonColor: "#ff7675",
            confirmButtonText: "Confirm",
            cancelButtonText: "Cancel"
        }).then((result) => {
            console.log(result);
            if (!result.value) {
                $("#input-btn-cancel-update-user-password").click();
                return;
            }
            callUpdateUserPassword();
        })
    })

    $("#input-btn-cancel-update-user-password").bind("click", function () {
        $("#input-change-current-password").val(null);
        $("#input-change-new-password").val(null);
        $("#input-change-confirm-new-password").val(null);
    })
})
