var lock = new Auth0Lock('ESoeNcnCBDhwGyxmJV2oRm4rowe3yzZU', 'higlass.auth0.com');
var login_link = document.getElementById('login-link');

login_link.addEventListener('click', function() {
    console.log("logging in");
    lock.show();
});



var logout = function() {
      localStorage.removeItem('id_token');
      window.location.href = "/";
};

lock.on("authenticated", function(authResult) {
  lock.getProfile(authResult.idToken, function(error, profile) {
    if (error) {
      // Handle error
      return;
    }
    localStorage.setItem('id_token', authResult.idToken);
    // Display user information
    show_profile_info(profile);
  });
});

// app.js

var retrieve_profile = function() {
  var id_token = localStorage.getItem('id_token');
  if (id_token) {
    lock.getProfile(id_token, function (err, profile) {
      if (err) {
        return alert('There was an error getting the profile: ' + err.message);
      }
      // Display user information
      show_profile_info(profile);
    });
  }
};

var show_profile_info = function(profile) {
  var avatar = document.getElementById('avatar');
  document.getElementById('nickname').textContent = profile.nickname;
  btn_login.style.display = "none";
  avatar.src = profile.picture;
  avatar.style.display = "block";
  btn_logout.style.display = "block";
};

// ...
retrieve_profile();
