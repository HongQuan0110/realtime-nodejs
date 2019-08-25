$(document).ready(function(){
    $("#link-read-more-notif").bind("click", function(){
        // let skipNumber = $("ul.list-notifications").find("li").length;
        let skipNumber = $("ul.list-notifications li").length;

        $(this).css("display", "none");
        $(".read-more-notif-loader").css("display", "inline-block")
        
        $.get(`/notification/read-more?skipNumber=${skipNumber}`, function(notifications){
            if(!notifications.length){
                alertify.notify("You haven't notification to read", "error", 5);
                $("#link-read-more-notif").css("display", "inline-block");
                $(".read-more-notif-loader").css("display", "none")
                return;
            }
            notifications.forEach(notification => {
                $("ul.list-notifications").append(`<li>${notification}</li>`);
            });

            $("#link-read-more-notif").css("display", "inline-block");
            $(".read-more-notif-loader").css("display", "none")
        })
    })
})