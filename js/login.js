const form = document.getElementById('login-form');
const usernameInput = document.getElementById('username-input');
const passwordInput = document.getElementById('password-input');
const loginBtn = document.getElementById('login-button');

loginBtn.addEventListener('click', (event) => {
  event.preventDefault(); // Needed for some reason

  if (usernameInput.value && passwordInput.value) {
    var usernames = JSON.parse(localStorage.getItem("usernames"));
    var passwords = JSON.parse(localStorage.getItem("passwords"));
    var username = document.getElementById("username-input").value;
    var password = document.getElementById("password-input").value;
    var found = false;

    for (var i = 0; i < usernames.length; i++) {
      if (usernames[i] == username && passwords[i] == password) {
        found = true;
        break;
      }
    }

    if (found) {
        localStorage.setItem('currUser', usernameInput.value);
        window.location.href = "profile.html";
    } else {
      alert("Incorrect username or password.");
    }
  } else {
    alert('Please fill out both username and password fields.');
  }
});