const urlParams = new URLSearchParams(window.location.search);
const hostUser = urlParams.get('hostUser');
const gameName = urlParams.get('gameName');
console.log(hostUser, gameName);
document.title = gameName;
let onestack = document.getElementById("oneStack");
let twostack = document.getElementById("twoStack");
let onename = document.getElementById("oneName");
let twoname = document.getElementById("twoName");
let newroundtext = document.getElementById("newround");
let p1c1 = document.getElementById("p1c1");
let p1c2 = document.getElementById("p1c2");
let p2c1 = document.getElementById("p2c1");
let p2c2 = document.getElementById("p2c2");
let currplayer = localStorage.getItem('currUser');
let t1 = document.getElementById("t1");
let t2 = document.getElementById("t2");
let t3 = document.getElementById("t3");
let t4 = document.getElementById("t4");
let t5 = document.getElementById("t5");
let pot = document.getElementById("pot");
let tomove = document.getElementById("tomove");
let nextroundbutton = document.getElementById("nextRound");
let checkbutton = document.getElementById("checkbutton");
let callbutton = document.getElementById("callbutton");
let betbutton = document.getElementById("betbutton");
let raiseBBbutton = document.getElementById("raiseBBbutton");
let foldbutton = document.getElementById("foldbutton");
let currUser = localStorage.getItem('currUser');

const userToken = getCookieValue("userToken");

window.addEventListener('load', () => {
  const ws = new WebSocket('ws://localhost:3000/?userToken='+userToken);

  ws.addEventListener('open', () => {
    let message = JSON.stringify({
      "request": "getactions",
      "data": {
        "fish": 4
      }
    });
    ws.send(message);
    console.log(`Sent message: ${message}`);
  });

  ws.addEventListener('message', (event) => {
    const message = event.data;
    console.log(`Received message: ${message}`);
  });

  ws.addEventListener('close', () => {
    console.log('WebSocket connection closed');
  });

  ws.addEventListener('error', (event) => {
    console.error('WebSocket error:', event);
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