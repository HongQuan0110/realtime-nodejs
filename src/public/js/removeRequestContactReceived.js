function removeRequestContactReceived(){
    $(".user-remove-request-contact-received").unbind("click").on("click", function(){
        let targetId = $(this).data("uid");

        $.ajax({
            url: "/contact/remove-request-contact-received",
            type: "delete",
            data: {uid: targetId},
            success: function(data){
                if(data.success){
                    // Chức năng này chưa muốn làm
                    // $(".noti_content").find(`div[data-uid = ${user.id}]`).remove(); // popup notification
                    // $("ul.list-notifications").find(`li>div[data-uid = ${user.id}]`).parent().remove(); // modal notification
                    // decreaseNumberNotification("noti_counter", 1);
                    
                    decreaseNumberNotifyContact("count-request-contact-received");
                    
                    decreaseNumberNotification("noti_contact_counter", 1);
                    
                    // Xóa ở modal tab yêu cầu xác nhận
                    $("#request-contact-received").find(`ul li[data-uid = ${targetId}]`).remove();

                    socket.emit("remove-request-contact-received", {contactId: targetId});
                }
            },
            error: function(error){
                console.log(error);
            }
        })
    })
}

socket.on("response-remove-request-contact-received", function(user){
    $("#find-user").find(`div.user-remove-request-contact-sent[data-uid = ${user.id}]`).hide();
    $(`div.user-add-new-contact[data-uid = ${user.id}]`).css("display", "inline-block");

    decreaseNumberNotifyContact("count-request-contact-sent");

    decreaseNumberNotification("noti_contact_counter", 1);
    

    // Xóa ở modal tab đang chờ xác nhận
    $("#request-contact-sent").find(`ul li[data-uid = ${user.id}]`).remove();

})

$(document).ready(function(){
    removeRequestContactReceived();
})
