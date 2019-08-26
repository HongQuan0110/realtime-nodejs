function removeRequestContact(){
    $(".user-remove-request-contact").bind("click", function(){
        let targetId = $(this).data("uid");

        $.ajax({
            url: "/contact/remove-request-contact",
            type: "delete",
            data: {uid: targetId},
            success: function(data){
                if(data.success){
                    $("#find-user").find(`div.user-remove-request-contact[data-uid = ${targetId}]`).hide();
                    $(`div.user-add-new-contact[data-uid = ${targetId}]`).css("display", "inline-block");
                    decreaseNumberNotifyContact("count-request-contact-sent");

                    // Xóa ở modal tab đang chờ xác nhận
                    $("#request-contact-sent").find(`ul li[data-uid = ${targetId}]`).remove();

                    socket.emit("remove-request-contact", {contactId: targetId});
                }
            },
            error: function(error){
                console.log(error);
            }
        })
    })
}

socket.on("response-remove-request-contact", function(user){
    $(".noti_content").find(`div[data-uid = ${user.id}]`).remove(); // popup notification
    $("ul.list-notifications").find(`li>div[data-uid = ${user.id}]`).parent().remove(); // modal notification

    decreaseNumberNotifyContact("count-request-contact-received");
    decreaseNumberNotification("noti_contact_counter", 1);
    decreaseNumberNotification("noti_counter", 1);

    // Xóa ở modal tab yêu cầu xác nhận
    $("#request-contact-received").find(`ul li[data-uid = ${user.id}]`).remove();
})
