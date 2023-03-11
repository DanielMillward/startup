const form = document.getElementById('login-form');
const usernameInput = document.getElementById('username-input');
const passwordInput = document.getElementById('password-input');
const loginBtn = document.getElementById('login-button');




loginBtn.addEventListener('click', (event) => {
  event.preventDefault(); // Needed for some reason
  if (usernameInput.value && passwordInput.value) {
    var users = JSON.parse(localStorage.getItem("users"));
    var username = document.getElementById("username-input").value;
    var password = document.getElementById("password-input").value;
    var found = false;
    if (users) {
      for (var i = 0; i < users.length; i++) {
        if (users[i].username == username && users[i].password == password) {
          found = true;
          break;
        }
      }
    } else {
      alert("No users found.");
    }
    if (found) {
        localStorage.setItem('currUser', usernameInput.value);
        window.location.href = "profile.html";
    } else {
      if (users) {
        alert("Incorrect username or password.");
      }
    }
  } else {
    alert('Please fill out both username and password fields.');
  }
});