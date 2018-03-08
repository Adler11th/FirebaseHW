var config = {
    apiKey: "AIzaSyCKdoRoqqRKjHd30INWUj5AivbSh4LSQRI",
    authDomain: "rpsgame-e1d5a.firebaseapp.com",
    databaseURL: "https://rpsgame-e1d5a.firebaseio.com",
    projectId: "rpsgame-e1d5a",
    storageBucket: "rpsgame-e1d5a.appspot.com",
    messagingSenderId: "234254001410"
  };
  firebase.initializeApp(config);

  var DATA = firebase.database();

  $(document).ready(function(){

    $("#player-one").on("click", function(){
        DATA.ref("player1").set({
            player: "player1",
            wins: 0,
            looses: 0
        });
        $(this).html("<p>Hello player 1</p>");
        $("player-one").off("click");
    });

    $("#player-two").on("click", function(){
        DATA.ref("player2").set({
            player:"player2",
            wins: 0,
            looses: 0
        });
        $(this).html("<p>Hello player2</p>");
        $("player-one").off("click");
    });

    DATA.ref().on("value", function(snapshot){
        if(snapshot.child("player1").exists()&&snapshot.child("player2").exists()){
            $(".dialog-card").html("<p>Ready</p>");
        }else{
            if(snapshot.child("player1").exists()){
                $(".dialog-card").append("<p>player1 is ready</p>");
            }else{
                if(snapshot.child("player2").exists()){
                    $(".dialog-card").append("<p>player2 is ready</p>");
                }

            }
        }
    })


  });