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

document.addEventListener('DOMContentLoaded', async () => {
  let authenticated = false;
  const userName = localStorage.getItem('userName');
  if (userName) {
    //const nameEl = document.querySelector('#userName');
    //nameEl.value = userName;
    const user = await getUser(userName);
    console.log("user is " + user)
    if (user !== null) {
      authenticated = true;
    }
  }

  if (authenticated) {
    console.log("authenticated");
    document.querySelector('#playerName').textContent = userName;
    setDisplay('loginButton', 'none');
    setDisplay('signupButton', 'none');
    setDisplay('profileButton', 'block');
    setDisplay('logoutButton', 'block');
    setDisplay('greeting', 'block');
  } else {
    console.log("not authenticated");
    setDisplay('loginButton', 'block');
    setDisplay('signupButton', 'block');
    setDisplay('profileButton', 'none');
    setDisplay('logoutButton', 'none');
    setDisplay('greeting', 'none');
  }
});


async function getUser(email) {
  // See if we have a user with the given email.
  const response = await fetch(`/api/user/${email}`);
  if (response.status === 200) {
    return response.json();
  }

  return null;
}

function setDisplay(controlId, display) {
  const playControlEl = document.querySelector(`#${controlId}`);
  if (playControlEl) {
    playControlEl.style.display = display;
  }
}