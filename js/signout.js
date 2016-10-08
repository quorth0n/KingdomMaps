"use strict";
// Initialize Firebase
var config = {
apiKey: "AIzaSyAHZ9Uo4CdEEjI_L3LUKRmnn5y8BwhccNM",
authDomain: "kingdommaps-d5aa3.firebaseapp.com",
databaseURL: "https://kingdommaps-d5aa3.firebaseio.com",
storageBucket: "kingdommaps-d5aa3.appspot.com",
messagingSenderId: "803904209546"
};
firebase.initializeApp(config);

//Sign out
firebase.auth().signOut().then(function() {
  alert('Signed out successfully');
  sessionStorage.clear();
  window.location.href="../signin/";
}, function(error) {
  console.error('Sign Out Error', error);
});
