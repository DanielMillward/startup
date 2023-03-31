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
    
  });

  ws.addEventListener('message', (event) => {
    let message = event.data;
    message = JSON.parse(message);
    console.log(`Received message: ${message}`);

    //only message we recieve here is for updating the display.
    /*
    "playerCards": [currGame.thisPlayerCards[0], currGame.thisPlayerCards[1]],
            "tableCards": [],
            playerStack: playerStack,
            oppStack: oppStack,
            pot: currGame.pot */
    p1c1.src = "rec\\English_pattern_" + getCardName(message.playerCards[0]) + ".svg" 
    p1c2.src = "rec\\English_pattern_" + getCardName(message.playerCards[1]) + ".svg" 
  });

  ws.addEventListener('close', () => {
    console.log('WebSocket connection closed');
  });

  ws.addEventListener('error', (event) => {
    console.error('WebSocket error:', event);
  });


  //First request
  let message = JSON.stringify({
    "request": "getactions",
    "data": {
      "email": hostUser,
      "gameName": gameName
    }
  });
  
  setTimeout(
    function() {
      ws.send(message);
    }, 1000);
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

//get card name
function getCardName(cardNum) {
  output = "";
  switch (cardNum) {
      case 0:
        output = 'ace_of_spades';
        break;
      case 1:
        output = '2_of_spades';
        break;
      case 2:
        output = '3_of_spades';
        break;
      case 3:
        output = '4_of_spades';
        break;
      case 4:
        output = '5_of_spades';
        break;
      case 5:
        output = '6_of_spades';
        break;
      case 6:
        output = '7_of_spades';
        break;
      case 7:
        output = '8_of_spades';
        break;
      case 8:
        output = '9_of_spades';
        break;
      case 9:
        output = '10_of_spades';
        break;
      case 10:
        output = 'jack_of_spades';
        break;
      case 11:
        output = 'queen_of_spades';
        break;
      case 12:
        output = 'king_of_spades';
        break;
      case 13:
        output = 'ace_of_hearts';
        break;
      case 14:
        output = '2_of_hearts';
        break;
      case 15:
        output = '3_of_hearts';
        break;
      case 16:
        output = '4_of_hearts';
        break;
      case 17:
        output = '5_of_hearts';
        break;
      case 18:
        output = '6_of_hearts';
        break;
      case 19:
        output = '7_of_hearts';
        break;
      case 20:
        output = '8_of_hearts';
        break;
      case 21:
        output = '9_of_hearts';
        break;
      case 22:
        output = '10_of_hearts';
        break;
      case 23:
        output = 'jack_of_hearts';
        break;
      case 24:
        output = 'queen_of_hearts';
        break;
      case 25:
        output = 'king_of_hearts';
        break;
      case 26:
        output = 'ace_of_clubs';
        break;
      case 27:
        output = '2_of_clubs';
        break;
      case 28:
        output = '3_of_clubs';
        break;
      case 29:
        output = '4_of_clubs';
        break;
      case 30:
        output = '5_of_clubs';
        break;
      case 31:
        output = '6_of_clubs';
        break;
      case 32:
        output = '7_of_clubs';
        break;
      case 33:
        output = '8_of_clubs';
        break;
      case 34:
        output = '9_of_clubs';
        break;
      case 35:
        output = '10_of_clubs';
        break;
      case 36:
        output = 'jack_of_clubs';
        break;
      case 37:
        output = 'queen_of_clubs';
        break;
      case 38:
        output = 'king_of_clubs';
        break;
      case 39:
        output = 'ace_of_diamonds';
        break;
      case 40:
        output = '2_of_diamonds';
        break;
      case 41:
        output = '3_of_diamonds';
        break;
      case 42:
      output = '4_of_diamonds';
      break;
      case 43:
      output = '5_of_diamonds';
      break;
      case 44:
      output = '6_of_diamonds';
      break;
      case 45:
      output = '7_of_diamonds';
      break;
      case 46:
      output = '8_of_diamonds';
      break;
      case 47:
      output = '9_of_diamonds';
      break;
      case 48:
      output = '10_of_diamonds';
      break;
      case 49:
      output = 'jack_of_diamonds';
      break;
      case 50:
      output = 'queen_of_diamonds';
      break;
      case 51:
      output = 'king_of_diamonds';
      break;
      default:
      output = 'Invalid card number';
  }
  return output;
}