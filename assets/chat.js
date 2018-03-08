$(document).ready(()=>{

    chatRef = DATA.ref("chat");

    $("#submit-chat").on("click", function(event){
        event.preventDefault();
        var text = $("#comment-input").val();
        chatRef.push({
            text: text
        });
        $("#comment-input").val("");
    });

    chatRef.on("value", function(snapshot){
        var keys = snapshot.val();
        $("#comment-display").val("");
        var text = '';
        for (var key in keys){
            if(keys.hasOwnProperty(key)){
                text += keys[key].text+'\n';
            }
        }
        $("#comment-display").val(text+"\n");
    });
});