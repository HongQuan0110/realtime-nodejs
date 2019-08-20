function callFindUsers(element){
    // console.log(element);
    if(element.which === 13 || element.type === "click"){
        let keyword = $("#input-find-users-contact").val();
        let regex = new RegExp(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/);
        
        if(!keyword.length){
            alertify.notify("Please enter content to search", "error", 5);
            return;
        }
        
        if(!regex.test(keyword)){
            alertify.notify("Error keyword, just allow characters, numbers and space.", "error", 5);
            return;
        }

        $.get(`/contact/find-users/${keyword}`, function(data){
            console.log(data);
            $("#find-user ul").html(data);
            addContact(); // js/addContact.js
            removeRequestContact(); // js/removeRequestContact.js
        })
    }
}

$(document).ready(function(){
    $("#input-find-users-contact").bind("keypress", callFindUsers);
    $("#btn-find-users-contact").bind("click", callFindUsers);
})