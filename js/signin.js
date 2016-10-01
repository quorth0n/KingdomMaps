/////    INIT
var conf = {
  apiKey: "AIzaSyAHZ9Uo4CdEEjI_L3LUKRmnn5y8BwhccNM",
  authDomain: "kingdommaps-d5aa3.firebaseapp.com",
  databaseURL: "https://kingdommaps-d5aa3.firebaseio.com",
  storageBucket: "",
  messagingSenderId: "803904209546"
};
firebase.initializeApp(conf);

////    SIGNIN
/*  Google  */
var provgoog = new firebase.auth.GoogleAuthProvider();
provgoog.addScope('https://www.googleapis.com/auth/userinfo.email');

document.getElementById("goog").addEventListener("click", goog);

function goog() {
    firebase.auth().signInWithPopup(provgoog).then(function(result) {
      var token = result.credential.accessToken;
      var user = result.user;
      console.log(user);
      setupAccount(user);
    }).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      var email = error.email;
      var credential = error.credential;
      /*    TODO describe better    */
      alert('Error has occured, see console for details.');
      console.log("Error occured on signin: " + error.code + ": " + error.message);
    });
}

/*  Github  */
var provgit = new firebase.auth.GithubAuthProvider();
provgit.addScope('user:email');

document.getElementById("git").addEventListener("click", git);

function git() {
    firebase.auth().signInWithPopup(provgit).then(function(result) {
      var token = result.credential.accessToken;
      var user = result.user;
      console.log(user);
      setupAccount(user);
    }).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      var email = error.email;
      var credential = error.credential;
      /*    TODO describe better    */
      alert('Error has occured, see console for details.');
      console.log("Error occured on signin: " + error.code + ": " + error.message);
    });
}

/*  Non-Specific  */
function setupAccount(user) {
    var db = firebase.database().ref('user/' + user.uid);
    sessionStorage.uid = user.uid;
    sessionStorage.email = user.email;
    db.once('value').then(function(snap) {
        if (snap.child('uname').exists() && snap.val().uname != "") {
            sessionStorage.uname = snap.val().uname;
            accountReady();
        } else {
            function getu() {
                var n = prompt("Enter a username. This is not changeable:");
                if (n != null && typeof n != undefined && n != "") {
                    return n;
                }  else {
                    getu();
                }
            }
            var localUname = getu();
            db.set({uname: localUname, email: user.email});
            accountReady();
        }
    })
}

function accountReady() {
    alert('Welcome. You are now signed in.');
    ((location.search).split("=")[1] != null) ? window.location.href = (location.search).split("=")[1] : window.history.back();
}
