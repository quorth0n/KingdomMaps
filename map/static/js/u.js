"use strict";
////  INIT
var config = {
  apiKey: "AIzaSyAHZ9Uo4CdEEjI_L3LUKRmnn5y8BwhccNM",
  authDomain: "kingdommaps-d5aa3.firebaseapp.com",
  databaseURL: "https://kingdommaps-d5aa3.firebaseio.com",
  storageBucket: "kingdommaps-d5aa3.appspot.com",
  messagingSenderId: "803904209546"
};
firebase.initializeApp(config);

function param(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

var u = param('uid');
var user = firebase.auth().currentUser;
var emailHidden;
var email;
var about;

////  UPDATE CONTENT
$(document).ready(function () {
    if (u == sessionStorage.uid) {
        $('#edit').prop('style', '');
    }
    firebase.database().ref('user/' + u).on('value', function (s) {
        $('#err').hide();
        $('#uid').text('User:'+u);
        if (!s.child('uname').exists()) {
            $('#user').html('Name: <i>none</i>');
        } else {
            $('#user').text('Name: '+(s.child('uname').val()).trim());
        }
        about = s.child('about').val();
        if (s.child('about').exists()) {
            $('#about').html('About: '+(new showdown.Converter()).makeHtml((s.child('about').val()).replace('\\n', '<br>')));
        }
        email = s.child('email').val();
        if (s.child('showEmail').val() == true) {
            $('#email').text('Email: ' + email);
            emailHidden = false;
        } else {
            $('#email').html('Email: <i>[hidden]</i>');
            emailHidden = true;
        }
        if (param('edit') == 'true') {
            $('#edit').trigger('click');
        }
    });
});

$('#edit').click(function ()  {
    $(".tools").prop('style', '');
    $('#user').html('Name: <input type="text" id="uname" value="' + (($('#user').text()).split(':')[1]).trim() + '">');
    $('#about').html('About: (<a href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet" target="_blank">markdown</a> supported)<br><textarea id="about_text">');
    if (about != null) {
      $('#about_text').val(about.replace('\\n', '\n'));
    }
    $('#email').hide();
    $('#_email').prepend('<label><input type="checkbox" id="showEmail">Hide email?</label><br>Email: <input type="text" id="email_text" value="' + email + '">');
    if (emailHidden) {
        $('#showEmail').attr('checked', 'checked');
    }
});

$('#cancel').click(function () {
    window.location.replace(document.URL.split('&')[0]);
});

$('#save').click(function () {
    firebase.database().ref('user/' + u).set({
        uname: ($('#uname').val()).trim(),
        //FIXME vulnerable to XSS (<img src="")
        about: ($('#about_text').val()).replace('\n', '\\n').replace(/<(?:.|\n)*?>/gm, ''),
        showEmail: !$("#showEmail").is(':checked'),
        email: ($('#email_text').val()).trim()
    });
    alert('Saved!');
    window.location.replace(document.URL.split('&')[0]);
});
