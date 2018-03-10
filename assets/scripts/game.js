const DATA = firebase.database();

$(document).ready(function () {
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
        }
    });
    //Tracks if players were choosen to display game buttons
    DATA.ref("players/player-one").on("value", function (snap) {
        try {
            $("#player-one h2").text(snap.val().name);
            $("#player-one").css("display", "block");
        } catch (e) { }
    });

    DATA.ref("players/player-two").on("value", function (snap) {
        try {
            $("#player-two h2").text(snap.val().name);
            $("#player-two").css("display", "block");
        } catch (e) { }
    });
    //starts round
    DATA.ref("players").on("value", (snap) => {
        if (snap.child("player-one").exists() && snap.child("player-two").exists()) {
            round();
        }
        
    });

    $("#pone-dc").on("click", function () {
        DATA.ref("players/player-one").remove();
        $("#player-one").css("display", "none");
        $("#player-one h2").text("Waiting..");
    });

    $(document).on("click", "#ptwo-dc", function () {
        DATA.ref("players/player-two").remove();
        $("#player-two").css("display", "none");
        $("#player-two h2").text("Waiting..");
    });

    DATA.ref("choice").on("value", (snap)=> {
        if (snap.child("player-one").exists() && snap.child("player-two").exists()) {
            compare(snap);
            DATA.ref("choice").remove();
        }
    });
    //========================================================================================
    //Functions
    //========================================================================================
    function round(){
        $(".pone-choice").on("click.choicePone", pOneClick);
        $(".ptwo-choice").on("click.choicePtwo", pTwoClick);
    };

    function pOneClick(){
        DATA.ref("choice/player-one").set($(this).attr("data"));
    };

    function pTwoClick(){
        DATA.ref("choice/player-two").set($(this).attr("data"));
    };

    function compare(snap) {
        const p1 = snap.child("player-one").val();
        const p2 = snap.child("player-two").val();
        if ((p1 == "rock" && p2 == "rock") || (p1 == "paper" && p2 == "paper") || (p1 == "scissors" && p2 == "scissors")) {
            console.log("Draw");
        } else {
            if ((p1 == "rock" && p2 == "scissors") || (p1 == "paper" && p2 == "rock") || (p1 == "scissors" && p2 == "paper")) {
                console.log("PlayerOne wins");
                DATA.ref("players/player-one/wins").transaction((wins)=>{
                    return (wins || 0) + 1;
                });
                DATA.ref("players/player-two/looses").transaction((looses)=>{
                    return (looses || 0) + 1;
                });
            } else {
                if ((p1 == "rock" && p2 == "paper") || (p1 == "paper" && p2 == "scissors") || (p1 == "scissors" && p2 == "rock")) {
                    console.log("PlayerTwo wins");
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