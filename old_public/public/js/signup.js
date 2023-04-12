
const signupBtn = document.getElementById('signup-button');
const usernameField = document.getElementById('username-input');
const passwordField = document.getElementById('password-input');

signupBtn.addEventListener('click', (event) => {
  signupBtn.disabled = true;
  username = usernameField.value;
  password = passwordField.value;
  event.preventDefault(); // Needed for some reason
  fetch('/api/auth/create', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: username,
    password: password
  })
  })
  .then(response => {
    if (response.status === 200) {
      // Handle a successful response with status code 200
      console.log(response.json());
      window.location.href = '/profile.html';
    } else if (response.status === 413) {
      // Handle an unauthorized response with status code 401
      alert("username or password not there");
    } else if (response.status === 409) {
      // Handle an unauthorized response with status code 401
      alert("existing user");
    } else {
      // Handle other status codes
      throw new Error('Something went wrong');
    }
  })
  .then(data => console.log(data))
  .catch(error => console.error(error))
  .finally(() => {
    // Re-enable the button
    signupBtn.disabled = false;
  });
});



//BELOW: Navbar code
document.addEventListener('DOMContentLoaded', async () => {
  let authenticated = false;
  const userName = getCookieValue("userName");
  console.log(userName);
  if (userName) {
    document.querySelector('#playerName').textContent = userName;
    setDisplay('loginButton', 'none');
    setDisplay('signupButton', 'none');
    setDisplay('profileButton', 'block');
    setDisplay('logoutButton', 'block');
    setDisplay('greeting', 'block');
    setDisplay('maincontent', 'none');
  } else {
    setDisplay('loginButton', 'block');
    setDisplay('signupButton', 'none');
    setDisplay('profileButton', 'none');
    setDisplay('logoutButton', 'none');
    setDisplay('greeting', 'none');
    setDisplay('whylol', 'none');
  }


});

function getCookieValue(cookieName) {
  const cookies = document.cookie.split("; ");
for (let i = 0; i < cookies.length; i++) {
  const parts = cookies[i].split("=");
  if (decodeURIComponent(parts[0]) === cookieName) {
    const value = decodeURIComponent(parts[1]);
    return value;
  }
}
  return undefined;
}

function setDisplay(controlId, display) {
  const playControlEl = document.querySelector(`#${controlId}`);
  if (playControlEl) {
    playControlEl.style.display = display;
  }
}