const DATA = firebase.database();
var isGameStarted = false;

$(document).ready(function () {

    $("#submit-player").on("click", function (event) {
        event.preventDefault();
        var playerName = $("#player-name").val();
        $("#player-name").val("");
        if (playerName.length != 0) {
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

    DATA.ref("players").on("value", (snap) => {
        if (snap.child("player-one").exists() && snap.child("player-two").exists()) {
            startRound();
        };
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

    DATA.ref("choice").on("value", function (snap) {
        if (snap.child("player-one").exists() && snap.child("player-two").exists()) {
            var p1 = snap.child("player-one").val();
            var p2 = snap.child("player-two").val();
            if ((p1 == "rock" && p2 == "rock") || (p1 == "paper" && p2 == "paper") || (p1 == "scissors" && p2 == "scissors")) {
                $(".dialog-card *").remove();
                $(".dialog-card").append("<h2>DRAW!</h2>");
                DATA.ref("choice").remove();
            } else {
                if ((p1 == "rock" && p2 == "scissors") || (p1 == "paper" && p2 == "rock") || (p1 == "scissors" && p2 == "paper")) {
                    $(".dialog-card *").remove();
                    $(".dialog-card").append("<h2>Player one wins!</h2>");
                    DATA.ref("choice").remove();
                } else {
                    if ((p1 == "rock" && p2 == "paper") || (p1 == "paper" && p2 == "scissors") || (p1 == "scissors" && p2 == "rock")) {
                        $(".dialog-card *").remove();
                        $(".dialog-card").append("<h2>Player two wins!</h2>");
                        DATA.ref("choice").remove();
                    }
                }
            }
        }
    });
    function startRound() {
        console.log("New Round");
        $(".pone-choice").on("click", function () {
            DATA.ref("choice/player-one").set($(this).attr("data"));
            console.log($(this).attr("data"));
            $(".pone-choice").off("click");
        });
        $(".ptwo-choice").on("click", function () {
            DATA.ref("choice/player-two").set($(this).attr("data"));
            console.log($(this).attr("data"));
            $(".ptwo-choice").off("click", ".ptwo-choice");
        });
    };
});