function removeContact(){
    $(".user-remove-contact").unbind("click").bind("click", function(){
        let targetId = $(this).data("uid");
        let username = $(this).parent().find("div.user-name p").text();

        Swal.fire({
            title: `Are you sure to delete ${username} from list friends ?`,
            text: "You won't be able to revert this!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#2ECC71",
            cancelButtonColor: "#ff7675",
            confirmButtonText: "Confirm",
            cancelButtonText: "Cancel"
        }).then((result) => {
            console.log(result);
            if (!result.value) {
                return;
            }
            $.ajax({
                url: "/contact/remove-contact",
                type: "delete",
                data: {uid: targetId},
                success: function(data){
                    if (data.success) {
                        $("#contacts").find(`ul li[data-uid = ${targetId}]`).remove();
                        decreaseNumberNotifyContact("count-contacts");
                        // xóa tên khỏi chức năng chat

                        socket.emit("remove-contact", {contactId: targetId})
                    }
                },
                error: function(error){
                    console.log(error);
                }
            })
        })
    })
}

socket.on("response-remove-contact", function(user){
    $("#contacts").find(`ul li[data-uid = ${user.id}]`).remove();
    decreaseNumberNotifyContact("count-contacts");

    // xóa tên khỏi chức năng chat
});

$(document).ready(function(){
    removeContact();
})
