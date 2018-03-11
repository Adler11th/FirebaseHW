const DATA = firebase.database();

$(document).ready(function () {
    $("#player-one").hide();
    $("#player-two").hide();
    $("#submit-player").on("click", function (event) {
        event.preventDefault();
        var playerName = $("#player-name").val();
        if (playerName.length != 0) {
            $("#player-name").val("");
            DATA.ref("players").once("value", (snap) => {
                if (!snap.child("player-one").exists()) {
                    DATA.ref("players/player-one").set({
                        name: playerName,
                        wins: 0,
                        looses: 0
                    });
                } else {
                    if (!snap.child("player-two").exists()) {
                        DATA.ref("players/player-two").set({
                            name: playerName,
                            wins: 0,
                            looses: 0
                        });
                    } else {
                        alert("We are packed!");
                    }
                }
            });
        }else{alert("Please enter valid name");}
    });
    //Tracks if players were choosen to display game buttons
    DATA.ref("players/player-one/name").on("value", function (snap) {
        try {
            if(snap.val()!=null){
            $("#player-one h2").text(snap.val());
            $("#player-one").show();
            $(".dialog-card").text("Player1 is READY!");
            }else{
            $("#player-one").hide();
            $(".dialog-card").text("Player1 disconnected...");
            }
        } catch (e) {
            console.log(e.message);
         }
    });

    DATA.ref("players/player-two/name").on("value", function (snap) {
        try {
            if(snap.val()!=null){
                $("#player-two h2").text(snap.val());
                $("#player-two").show();
                $(".dialog-card").text("Player2 is READY!");
            }else{
            $("#player-two").hide();
            $(".dialog-card").text("Player2 disconnected...");
            }
        } catch (e) {
            console.log(e.message);
         }
    });
    //starts round
    DATA.ref("players").on("value", (snap) => {
        if (snap.child("player-one").exists() && snap.child("player-two").exists()) {
            round();
        }
    });

    $("#pone-dc").on("click", function () {
        DATA.ref("players/player-one").remove();
        DATA.ref("choice").remove();
    });

    $(document).on("click", "#ptwo-dc", function () {
        DATA.ref("players/player-two").remove();
        DATA.ref("choice").remove();
    });

    function backWards(){
    DATA.ref("choice").once("value", function(snap) {
        if(snap.child("player-one").exists()){
            $(".dialog-card").text("Player1 made his choice..");
        }
        if(snap.child("player-two").exists()){
                $(".dialog-card").text("Player2 made his choice..");
        }
        
        if (snap.child("player-one").exists() && snap.child("player-two").exists()) {
            compare(snap);
            DATA.ref("choice").off("value");
            DATA.ref("choice").remove();
        }
    });
}

    DATA.ref("players/player-one/wins").on("value", (snap)=>{
        $("#pone-wins").text(snap.val());
    });
    DATA.ref("players/player-one/looses").on("value", (snap)=>{
        $("#pone-loses").text(snap.val());
    });
    DATA.ref("players/player-two/wins").on("value", (snap)=>{
        $("#ptwo-wins").text(snap.val());
    });
    DATA.ref("players/player-two/looses").on("value", (snap)=>{
        $("#ptwo-loses").text(snap.val());
    });

    //========================================================================================
    //Functions
    //========================================================================================
    function round(){
        $(".pone-choice").on("click.choicePone", pOneClick);
        $(".ptwo-choice").on("click.choicePtwo", pTwoClick);
    };

    function pOneClick(){
        DATA.ref("choice").off("value");
        DATA.ref("choice/player-one").set($(this).attr("data"));
        backWards();
    };

    function pTwoClick(){
        DATA.ref("choice").off("value");
        DATA.ref("choice/player-two").set($(this).attr("data"));
        backWards();
    };

    function compare(snap) {
        const p1 = snap.child("player-one").val();
        const p2 = snap.child("player-two").val();
        if ((p1 == "rock" && p2 == "rock") || (p1 == "paper" && p2 == "paper") || (p1 == "scissors" && p2 == "scissors")) {
            $(".dialog-card").text("Draw");
        } else {
            if ((p1 == "rock" && p2 == "scissors") || (p1 == "paper" && p2 == "rock") || (p1 == "scissors" && p2 == "paper")) {
                $(".dialog-card").text("Player 1 wins");
                DATA.ref("players/player-one/wins").transaction((wins)=>{
                    return (wins || 0) + 1;
                });
                DATA.ref("players/player-two/looses").transaction((looses)=>{
                    return (looses || 0) + 1;
                });
            } else {
                if ((p1 == "rock" && p2 == "paper") || (p1 == "paper" && p2 == "scissors") || (p1 == "scissors" && p2 == "rock")) {
                    $(".dialog-card").text("Player 2 wins");
                    DATA.ref("players/player-two/wins").transaction((wins)=>{
                        return (wins || 0) + 1;
                    });
                    DATA.ref("players/player-one/looses").transaction((looses)=>{
                        return (looses || 0) + 1;
                    });
                }
            }
        }
    }
});