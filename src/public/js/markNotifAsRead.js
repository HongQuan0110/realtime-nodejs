function markNotificationAsRead(targetUsers){
    $.ajax({
        url: "/notification/mark-all-as-read",
        type: "put",
        data: { targetUsers },
        success: function(result){
            if(result){
                targetUsers.forEach(uid => {
                    $(`.noti_content div.notif-readed-false[data-uid = ${uid}]`).removeClass("notif-readed-false");
                    $("ul.list-notifications").find(`li>div[data-uid = ${uid}]`).removeClass("notif-readed-false");
                });
                decreaseNumberNotification("noti_counter", targetUsers.length);
            }
        },
        error: function(error){
            console.log(error);
        }
    })
}

$(document).ready(function(){
    $("#popup-mark-notif-as-read").bind("click", function(){
        let targetUsers = [];
        $(".noti_content").find("div.notif-readed-false").each(function(index, notification){
            targetUsers.push($(notification).data("uid"));
        })
        if(!targetUsers.length){
            alertify.notify("Your haven't unread notifications", "error", 5);
            return;
        }
        markNotificationAsRead(targetUsers);
    })

    $("#modal-mark-notif-as-read").bind("click", function(){
        let targetUsers = [];
        $("ul.list-notifications").find("li>div.notif-readed-false").each(function(index, notification){
            targetUsers.push($(notification).data("uid"));
        })
        if(!targetUsers.length){
            alertify.notify("Your haven't unread notifications", "error", 5);
            return;
        }
        markNotificationAsRead(targetUsers);
    })
})
