import firebase from "firebase"
const config = {
    apiKey: "AIzaSyCKdoRoqqRKjHd30INWUj5AivbSh4LSQRI",
    authDomain: "rpsgame-e1d5a.firebaseapp.com",
    databaseURL: "https://rpsgame-e1d5a.firebaseio.com",
    projectId: "rpsgame-e1d5a",
    storageBucket: "",
    messagingSenderId: "234254001410"
  };
  firebase.initializeApp(config);

export default firebase;