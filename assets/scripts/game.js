  var DATA = firebase.database();
  var isPlayerOne = false;
  var isPlayerTwo = false;
  var isGameStarted = false;

  $(document).ready(function () {

      $("#submit-player").on("click", function (event) {
          event.preventDefault();
          var playerName = $("#player-name").val();
          $("#player-name").val("");
          if (!isGameStarted) {
              if (playerName.length != 0) {
                  if (!isPlayerOne) {
                      DATA.ref("players/player1").set({
                          name: playerName,
                          wins: 0,
                          looses: 0,
                      });
                      isPlayerOne = true;
                  } else {
                      if (!isPlayerTwo) {
                          DATA.ref("players/player2").set({
                              name: playerName,
                              wins: 0,
                              looses: 0,
                          });
                          isPlayerTwo = true;
                      }
                  }
              } else {
                  alert("Please enter your name, before starting a game");
              }
          }
      });
//Tracks if players were choosen to deploy game buttons
      DATA.ref("players/player1").on("value", function (snap) {
          try {
              $("#player-one *").remove();
              $("#player-one").append(`<h2>${snap.val().name}</h2>`);
              $("#player-one").append("<img class = 'choice-img pone-choice' src='assets/img/rock.png' data = 'rock'>");
              $("#player-one").append("<img class = 'choice-img pone-choice' src='assets/img/paper.png' data ='paper'>");
              $("#player-one").append("<img class = 'choice-img pone-choice' src='assets/img/scissors.png' data = 'scissors'>");
              $("#player-one").append("<button class = 'dc-btn' id='pone-dc' value = 'Quit'>Quit</button>");
          } catch (e) {}
      });

      DATA.ref("players/player2").on("value", function (snap) {
          try {
              $("#player-two *").remove();
              $("#player-two").append(`<h2>${snap.val().name}</h2>`);
              $("#player-two").append("<img class = 'choice-img ptwo-choice' src='assets/img/rock.png' data = 'rock'>");
              $("#player-two").append("<img class = 'choice-img ptwo-choice' src='assets/img/paper.png' data ='paper'>");
              $("#player-two").append("<img class = 'choice-img ptwo-choice' src='assets/img/scissors.png' data = 'scissors'>");
              $("#player-two").append("<button class = 'dc-btn' id='ptwo-dc' value = 'Quit'>Quit</button>");
          } catch (e) {}
      });

      $(document).on("click", "#pone-dc", function () {
          DATA.ref("players/player1").remove();
          $("#player-one *").remove();
          $("#player-one").append("<h2>Waiting..<h2>");
          isGameStarted = false;
          isPlayerOne = false;
      });

      $(document).on("click", "#ptwo-dc", function () {
          DATA.ref("players/player2").remove();
          $("#player-two *").remove();
          $("#player-two").append("<h2>Waiting..<h2>");
          isGameStarted = false;
          isPlayerTwo = false;
      });

      DATA.ref("players").on("value", function (snapshot) {
          if (snapshot.child("player1").exists() && snapshot.child("player2").exists()) {
              $(".dialog-card p").text("Ready");
              isGameStarted = true;
              makeChoice();
              console.log("GameStarted");
          } else {
              if (snapshot.child("player1").exists()) {
                  $(".dialog-card p").text("player1 is ready");
              } else {
                  if (snapshot.child("player2").exists()) {
                      $(".dialog-card p").text("player2 is ready");
                  }

              }
          }
      });

      DATA.ref("choice").on("value", function (snap) {
          if (snap.child("player1").exists() && snap.child("player2").exists()) {
              var p1 = snap.val().player1;
              var p2 = snap.val().player2;
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
      function makeChoice() {
        $(document).on("click", ".pone-choice", function () {
            DATA.ref("choice/player1").set($(this).attr("data"));
        });
        $(document).on("click", ".ptwo-choice", function () {
            DATA.ref("choice/player2").set($(this).attr("data"));
        });
    };
  });