const gameNameInput = document.getElementById('gameName');
const otherPlayerInput = document.getElementById('otherPlayer');
const bigBlindInput = document.getElementById('bigBlind');
const startingStackOneInput = document.getElementById('stackOne');
const startingStackTwoInput = document.getElementById('stackTwo');
const submitButton = document.getElementById('submitButton');

submitButton.addEventListener('click', (event) => {
  submitButton.disabled = true;
  let otherPlayer = otherPlayerInput.value;
  let gameName = gameNameInput.value;
  let bb = bigBlindInput.value;
  let startingStackOne = startingStackOneInput.value;
  let startingStackTwo = startingStackTwoInput.value;
  console.log(gameName + otherPlayer + bb + startingStackOne + startingStackTwo);
  event.preventDefault(); // Needed for some reason
  fetch('/api/addgame', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: getCookieValue("userName"),
    gameName: gameName,
    otherPlayer: otherPlayer,
    bb: bb,
    stackOne: startingStackOne,
    stackTwo: startingStackTwo
  })
  })
  .then(response => {
    if (response.status === 200) {
      // Handle a successful response with status code 200
      console.log(response.json());
      window.location.href = '/game.html?hostUser='+getCookieValue("userName")+'&gameName='+gameName;
    } else if (response.status === 422) {
      // Handle an unauthorized response with status code 401
      alert("Incomplete/incorrect data");
    }  else if (response.status === 401) {
      // Handle an unauthorized response with status code 401
      alert("username/password not in DB");
    }  else if (response.status === 409) {
      // Handle an unauthorized response with status code 401
      alert("Game with this name already exists");
    } else {
      // Handle other status codes
      throw new Error('Something went wrong');
    }
  })
  .then(data => console.log(data))
  .catch(error => console.error(error))
  .finally(() => {
    // Re-enable the button
    submitButton.disabled = false;
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
    setDisplay('whylol', 'none');
  } else {
    setDisplay('loginButton', 'block');
    setDisplay('signupButton', 'block');
    setDisplay('profileButton', 'none');
    setDisplay('logoutButton', 'none');
    setDisplay('greeting', 'none');
    setDisplay('maincontent', 'none');
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

const signoutButton = document.getElementById('logoutButton');

signoutButton.addEventListener('click', () => {
  document.cookie = "userToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "userName=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  window.location.href = "index.html";
});
