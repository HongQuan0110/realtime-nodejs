let userAvatar = null;
let userInfo = {};
let originAvatarSrc = null;
let originUserInfo = {};

function updateUserInfo(){
    $("#input-change-avatar").bind("change", function() {
        let fileData = $(this).prop("files")[0];
        console.log(fileData.type);
        let match = ["image/png", "image/jpg", "image/jpeg"];
        let limit = 1048576;

        if($.inArray(fileData.type, match) === -1){
            alertify.notify("File not match, allow png, jpg and jpeg", "error", 5);
            $(this).val(null);
            return false;
        }

        if(fileData.size > limit){
            alertify.notify("Upload image limit 1MB", "error", 5);
            $(this).val(null);
            return false;
        }

        if(typeof(FileReader) != "undefined"){
            let imagePreview = $("#image-edit-profile");
            imagePreview.empty();
            let fileReader = new FileReader();
            fileReader.onload = function(element){
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
        else{
            alertify.notify("Your browser not support FileReader", "error", 5);
        }
    })

    $("#input-change-username").bind("change", function(){
        let username = $(this).val();
        let regex = new RegExp("^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$");

        if(!regex.test(username) || username.length < 3 || username.length > 17){
            alertify.notify("Username limit from 3-17 characters and do not contain special characters", "error", 5);
            $(this).val(originUserInfo.username);
            delete userInfo.username;
            return;
        }

        userInfo.username = username;
    })

    $("#input-change-gender-male").bind("click", function(){
        let gender = $(this).val();

        if(gender !== "male"){
            alertify.notify("Oops! Data gender have something wrong", "error", 5);
            // $(this).val(originUserInfo.gender);
            delete userInfo.gender;
            return;
        }

        userInfo.gender = gender;
    })

    $("#input-change-gender-female").bind("click", function(){
        let gender = $(this).val();

        if(gender !== "female"){
            alertify.notify("Oops! Data gender have something wrong", "error", 5);
            // $(this).val(originUserInfo.gender);
            delete userInfo.gender;
            return;
        }

        userInfo.gender = gender;
    })

    $("#input-change-address").bind("change", function(){
        let address = $(this).val();

        if(address.length < 3 || address.length > 30){
            alertify.notify("Address limit from 3-30 characters", "error", 5);
            $(this).val(originUserInfo.address);
            delete userInfo.address;
            return;
        }

        userInfo.address = address;
    })

    $("#input-change-phone").bind("change", function(){
        let phone = $(this).val();
        let regex = new RegExp("^(0)[0-9]{9,10}$");

        if(!regex.test(phone)){
            alertify.notify("Phone must begin from 0 and limit about 10-11 numbers", "error", 5);
            $(this).val(originUserInfo.phone);
            delete userInfo.phone;
            return;
        }

        userInfo.phone = phone;
    })
}

function callUpdateUserAvatar(){
    $.ajax({
        url: "/user/update-avatar",
        type: "put",
        cache: false,
        contentType: false,
        processData: false,
        data: userAvatar,
        success: function(result){
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
        error: function(error){
            // Display error
            $(".user-modal-alert-error").find("span").text(error.responseText);
            $(".user-modal-alert-error").css("display", "block");

            // Reset all
            $("#input-btn-cancel-update-user").click();
        }
    })
}

function callUpdateUserInfo(){
    $.ajax({
        url: "/user/update-info",
        type: "put",
        data: userInfo,
        success: function(result){
            // Display success
            $(".user-modal-alert-success").find("span").text(result.message);
            $(".user-modal-alert-success").css("display", "block");

            // Update origin user info
            originUserInfo = Object.assign(originUserInfo, userInfo);

            // Update username at navbar
            $("#navbar-username").text(originUserInfo.username);

            // Reset all
            $("#input-btn-cancel-update-user").click();
        },
        error: function(error){
            // Display error
            $(".user-modal-alert-error").find("span").text(error.responseText);
            $(".user-modal-alert-error").css("display", "block");

            // Reset all
            $("#input-btn-cancel-update-user").click();
        }
    })
}

$(document).ready(function(){
    updateUserInfo();
    originAvatarSrc = $("#user-modal-avatar").attr("src");
    originUserInfo = {
        username: $("#input-change-username").val(),
        gender: $("#input-change-gender-male").is(":checked") ? $("#input-change-gender-male").val() : $("#input-change-gender-female").val(),
        address: $("#input-change-address").val(),
        phone: $("#input-change-phone").val()
    }

    $("#input-btn-update-user").bind("click", function(){
        if($.isEmptyObject(userInfo) && !userAvatar){
            alertify.notify("You must change info before update", "error", 5);
            return;
        }

        if(userAvatar){
            callUpdateUserAvatar();
        }

        if(!$.isEmptyObject(userInfo)){
            callUpdateUserInfo();
        }
        // console.log(userAvatar);
        // console.log(userInfo);
    })

    $("#input-btn-cancel-update-user").bind("click", function(){
        userAvatar = null;
        userInfo = {};
        $("#input-change-avatar").val(null);
        $("#user-modal-avatar").attr("src", originAvatarSrc);

        $("#input-change-username").val(originUserInfo.username);
        originUserInfo.gender === "male" ? $("#input-change-gender-male").click() : $("#input-change-gender-female").click();
        $("#input-change-address").val(originUserInfo.address);
        $("#input-change-phone").val(originUserInfo.phone);
    })
})
