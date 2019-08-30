function textAndEmojiChat(divId){
    $(".emojionearea").unbind("keyup").on("keyup", function(element){
        if(element.which === 13) {
            let messageval = $(`#write-chat-${divId}`).val();
            let targetId = divId;

            if(!targetId.length || !messageval.trim().length){
                return; 
            }

            let dataTextEmojiSend = {
                uid: targetId,
                messageval,
            }

            if($(`#write-chat-${divId}`).hasClass("chat-in-group")){
                dataTextEmojiSend.isChatGroup = true;
            }

            // call send message
            $.post("/message/add-new-text-emoji", dataTextEmojiSend, function(data){

            }).fail(function(response){
                // error
                console.log(response);
            })
        }
    })
}
