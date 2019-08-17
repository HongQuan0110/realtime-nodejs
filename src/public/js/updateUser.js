let userAvatar = null;
let userInfo = {};
let originAvatarSrc = null;

function updateUserInfo(){
    $("#input-change-avatar").bind("change", function() {
        let fileData = $(this).prop("files")[0];
        console.log(fileData.type);
        let match = ["image/png", "image/jpg", "image/jpeg"];
        let limit = 1048576;

        // if($.inArray(fileData.type, match) === -1){
        //     alertify.notify("File not match, allow png, jpg and jpeg", "error", 5);
        //     $(this).val(null);
        //     return false;
        // }

        // if(fileData.size > limit){
        //     alertify.notify("Upload image limit 1MB", "error", 5);
        //     $(this).val(null);
        //     return false;
        // }

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
        userInfo.username = $(this).val();
    })

    $("#input-change-gender-male").bind("click", function(){
        userInfo.gender = $(this).val();
    })

    $("#input-change-gender-female").bind("click", function(){
        userInfo.gender = $(this).val();
    })

    $("#input-change-address").bind("change", function(){
        userInfo.address = $(this).val();
    })

    $("#input-change-phone").bind("change", function(){
        userInfo.phone = $(this).val();
    })
}

$(document).ready(function(){
    updateUserInfo();
    originAvatarSrc = $("#user-modal-avatar").attr("src");

    $("#input-btn-update-user").bind("click", function(){
        if($.isEmptyObject(userInfo) && !userAvatar){
            alertify.notify("You must change info before update", "error", 5);
            return;
        }

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
        // console.log(userAvatar);
        // console.log(userInfo);
    })

    $("#input-btn-cancel-update-user").bind("click", function(){
        userAvatar = null;
        userInfo = {};
        $("#user-modal-avatar").attr("src", originAvatarSrc);
    })
})