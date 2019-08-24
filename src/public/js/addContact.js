function addContact(){
    $(".user-add-new-contact").bind("click", function(){
        let targetId = $(this).data("uid");
        $.post("/contact/add-new", {uid: targetId}, function(data){
            if(data.success){
                $("#find-user").find(`div.user-add-new-contact[data-uid = ${targetId}]`).hide();
                $(`.user-remove-request-contact[data-uid=${targetId}]`).css("display", "inline-block");
                increaseNumberNotifyContact("count-request-contact-sent");
                socket.emit("add-new-contact", {
                    contactId: targetId
                })
            }
        })
    })
}

socket.on("response-add-new-contact", function(user){
    let notif = `<div class="notif-readed-false" data-uid="${ user.id }">
                    <img class="avatar-small" src="/images/users/${user.avatar}" alt=""> 
                    <strong>${user.username}</strong> đã chấp nhận lời mời kết bạn của bạn!
                </div>`;
    $(".noti_content").prepend(notif); // popup notification
    $(".list-notifications").prepend(`<li>${notif}</li>`); // modal notification

    increaseNumberNotifyContact("count-request-contact-received");
    increaseNumberNotification("noti_contact_counter");
    increaseNumberNotification("noti_counter");
})