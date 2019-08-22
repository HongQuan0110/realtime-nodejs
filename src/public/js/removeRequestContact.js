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
    $(".noti_content").find(`span[data-uid = ${user.id}]`).remove();

    decreaseNumberNotifyContact("count-request-contact-received");
    decreaseNumberNotification("noti_contact_counter");
    decreaseNumberNotification("noti_counter");
})
