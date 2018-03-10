$(document).ready(()=>{

    const chatRef = firebase.database().ref("chat");

    $("#submit-chat").on("click", function(event){
        event.preventDefault();
        var text = $("#comment-input").val();
        chatRef.push({
            text: text
        });
        $("#comment-input").val("");
    });
    $("#clear-chat").on("click", function(event){
        event.preventDefault();
        chatRef.remove();
    });

    chatRef.on("value", function(snapshot){
        var chat = snapshot.val();
        $("#comment-display").val("");
        var text = '';
        for (var key in chat){
            if(chat.hasOwnProperty(key)){
                text += chat[key].text+'\n';
            }
        }
        $("#comment-display").val(text+"\n");
    });
});