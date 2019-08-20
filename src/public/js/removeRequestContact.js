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
                }
            },
            error: function(error){
                console.log(error);
            }
        })
    })
}
