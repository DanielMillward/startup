const form = document.getElementById('signup-form');
const usernameInput = document.getElementById('username-input');
const passwordInput = document.getElementById('password-input');
const signupBtn = document.getElementById('signup-button');

signupBtn.addEventListener('click', (event) => {
  event.preventDefault(); // Needed for some reason

  if (usernameInput.value && passwordInput.value) {
    let users = JSON.parse(localStorage.getItem('users')) || [];
    const currentDate = new Date().toLocaleDateString();
    alreadyExists = false;
    if (users) {
        for (var i = 0; i < users.length; i++) {
            console.log(users[i].username)
            console.log(usernameInput)
        if (users[i].username == usernameInput.value) {
            alert("Username already taken. Please try another one.");
            alreadyExists = true;
        }
        }
    }
    if (!alreadyExists) {
        
        newUserData = {
            username: usernameInput.value,
            password: passwordInput.value,
            accountDate: currentDate,
            gamesPlayed: 0,
            moneyWon: 0.0,
            games: [0]
        }

        users.push(newUserData);
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currUser', usernameInput.value);
        
        window.location.href = "profile.html";
    }
    
  } else {
    alert('Please fill out both username and password fields.');
  }
});
