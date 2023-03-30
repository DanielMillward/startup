//const parsed = JSON.parse(decodeURIComponent(url));
//console.log(parsed)

// Get the query string from the URL
const queryString = window.location.search;
console.log(queryString)
const userDataString = queryString.substring(10);
console.log(userDataString)
const userDataDecoded = decodeURIComponent(userDataString);
console.log(userDataDecoded)
const userData = JSON.parse(userDataDecoded);

// data order:
/*
0. Game Name
1. player 1 start stack size
2. player 2 start stack size
3. bb size
4. first player/game maker
5. second player
6. player 1 current stack size
7. player 2 current stack size
8. player 1 cards (hashed)
9. player 2 cards (hashed)
10. table cards
11. current betting round
12. actions taken this round
13. Pot size
14. Player to move
 */

//Get game data from URL
const gameName = userData[0];
const startStackOne = userData[1]; 
const startStackTwo = userData[2]; 
const bb = userData[3]; 
const firstPlayer = userData[4]; 
const secondPlayer = userData[5];

// get references to page elements
document.title = gameName;
onestack = document.getElementById("oneStack");
twostack = document.getElementById("twoStack");
onename = document.getElementById("oneName");
twoname = document.getElementById("twoName");
newroundtext = document.getElementById("newround");
p1c1 = document.getElementById("p1c1");
p1c2 = document.getElementById("p1c2");
p2c1 = document.getElementById("p2c1");
p2c2 = document.getElementById("p2c2");
currplayer = localStorage.getItem('currUser');
t1 = document.getElementById("t1");
t2 = document.getElementById("t2");
t3 = document.getElementById("t3");
t4 = document.getElementById("t4");
t5 = document.getElementById("t5");
let pot = document.getElementById("pot");
let tomove = document.getElementById("tomove");
let nextroundbutton = document.getElementById("nextRound");
let checkbutton = document.getElementById("checkbutton");
let callbutton = document.getElementById("callbutton");
let betbutton = document.getElementById("betbutton");
let raiseBBbutton = document.getElementById("raiseBBbutton");
let foldbutton = document.getElementById("foldbutton");
let currUser = localStorage.getItem('currUser');


onename.textContent = firstPlayer + " (you)";
twoname.textContent = secondPlayer;
newRound = false

//get data
let users = JSON.parse(localStorage.getItem('users'));
let userIndex = users.findIndex(function(user) {
    return user.username === firstPlayer;
  });
console.log(userIndex)
let gameIndex = users[userIndex].games.findIndex(function(game) {
return game[0] === gameName;
});
console.log("Round start:" + userData)
var cards = [];
for (var i = 1; i <= 52; i++) {
    cards.push(i);
}


// brand new game, initialize stacks/cards
if (userData.length == 6) {
    console.log("initiating...");
    newRound = true
    userData.push(startStackOne - bb/2);
    userData.push(startStackTwo - bb);
    userData.push([cards[0], cards[1]]);
    userData.push([cards[2], cards[3]]);
    userData.push([cards[4], cards[5], cards[6]]);
    userData.push("preflop");
    userData.push([]);
    userData.push(bb* 1.5);
    userData.push(1);

    users[userIndex].games[gameIndex] = userData;
    localStorage.setItem('users', JSON.stringify(users));
    history.replaceState(null, null, '/game.html?userData=' + encodeURI(JSON.stringify(userData)));
}
//on very first page load?
updateDisplay();


console.log(userData[6] + " is 6s");


//grey out options depending on turn
currPlayerName = userData[14] == 1 ? firstPlayer : secondPlayer;

if (currPlayerName != currUser) {
    checkbutton.disabled = true;
    betbutton.disabled = true;
    nextroundbutton.disabled = true;
    foldbutton.disabled = true;
    raiseBBbutton.disabled = true;
    callbutton.disabled = true;
}
if (userData[11] == "preflop" && userData[14] == 1) {
    checkbutton.disabled = true;
    betbutton.disabled = true;
    nextroundbutton.disabled = true;
}


//take action
foldbutton.addEventListener('click', () => {
    
    
    /*
    0. Game Name
1. player 1 start stack size
2. player 2 start stack size
3. bb size
4. first player/game maker
5. second player
6. player 1 current stack size
7. player 2 current stack size
8. player 1 cards (hashed)
9. player 2 cards (hashed)
10. table cards
11. current betting round
12. actions taken this round
13. Pot size
14. Player to move */
cards = shuffleArray(cards);
userData[7] += userData[13];
userData[6] -= bb/2;
userData[7] -= bb;
userData[8] = [cards[0], cards[1]];
userData[9] = [cards[2], cards[3]];
userData[10] = [cards[4], cards[5], cards[6]];
userData[11] = "preflop";
userData[12] = [];
userData[13] = bb * 1.5;
userData[14] = 1;

users[userIndex].games[gameIndex] = userData;
console.log("fold date" + userData);
localStorage.setItem('users', JSON.stringify(users));
history.replaceState(null, null, '/game.html?userData=' + encodeURI(JSON.stringify(userData)));
updateDisplay();
});













//update elements
function updateDisplay() {
    onestack.textContent = "$" + userData[6];
    twostack.textContent = "$" + userData[7];
    newroundtext.textContent =  userData[11] == "preflop" ? "New Round" : "";
    pot.textContent = "Pot: $" + userData[13];
    tomove.textContent = userData[14] == 1 ? firstPlayer + "\'s turn" : secondPlayer + "\'s turn";
    console.log(userData[11])
    p1c1src = getCardName(userData[9][0]) 
    p1c2src = getCardName(userData[9][1]) 
    p2c1src = getCardName(userData[10][0]) 
    p2c2src = getCardName(userData[10][1])
    if (currplayer == firstPlayer || userData[11] == "showdown") {
        p1c1.src = "rec\\English_pattern_" + getCardName(userData[8][0]) + ".svg" 
        p1c2.src = "rec\\English_pattern_" + getCardName(userData[8][1]) + ".svg" 
    } else {
        p1c1.src = "rec\\card_back.svg" 
        p1c2.src = "rec\\card_back.svg" 
    }
    
    if (currplayer == secondPlayer || userData[11] == "showdown") {
        p2c1.src = "rec\\English_pattern_" + getCardName(userData[9][0]) + ".svg" 
        p2c2.src = "rec\\English_pattern_" + getCardName(userData[9][1]) + ".svg" 
    } else {
        p2c1.src = "rec\\card_back.svg" 
        p2c2.src = "rec\\card_back.svg" 
    }
    t1.src = "rec\\card_back.svg"
    t2.src = "rec\\card_back.svg"
    t3.src = "rec\\card_back.svg"
    t4.src = "rec\\card_back.svg"
    t5.src = "rec\\card_back.svg"
    console.log("11"+userData[11])
    if (userData[11] != "preflop") {
        t1.src = "rec\\English_pattern_" + getCardName(userData[10][0]) + ".svg" 
        t2.src = "rec\\English_pattern_" + getCardName(userData[10][1]) + ".svg" 
        t3.src = "rec\\English_pattern_" + getCardName(userData[10][2]) + ".svg" 
    }
    if (userData[11] != "preflop" && userData[11] != "flop") {
        t4.src = "rec\\English_pattern_" + getCardName(userData[10][3]) + ".svg" 
    }
    if (userData[11] != "preflop" && userData[11] != "flop" && userData[11] != "turn") {
        t4.src = "rec\\English_pattern_" + getCardName(userData[10][4]) + ".svg" 
    }
}

//shuffle algo
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }

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


// Get the navbar elements
const anonButtons = document.querySelectorAll('.anonButton');
const loginButton = anonButtons[0].querySelector('button');
const signupButton = anonButtons[1].querySelector('button');

// Check if the user is logged in
if (localStorage.getItem('currUser')) {
  anonButtons.forEach(button => button.style.display = 'none');
  const navbar = document.querySelector('.navbar-nav');
  //make profile button
  const profileButton = document.createElement('button');
  profileButton.type = 'button';
  profileButton.classList.add('btn', 'btn-dark', 'rounded-pill', 'py-0');
  profileButton.innerText = 'View Profile';
  profileButton.addEventListener('click', () => {
    window.location.href = "profile.html";
  });
  const profileListItem = document.createElement('li');
  profileListItem.classList.add('nav-item', 'p-2', 'anonButton');
  profileListItem.appendChild(profileButton);
  navbar.appendChild(profileListItem);

  // Make sign out button
  const signoutButton = document.createElement('button');
  signoutButton.type = 'button';
  signoutButton.classList.add('btn', 'btn-dark', 'rounded-pill', 'py-0');
  signoutButton.innerText = 'Sign Out';
  signoutButton.addEventListener('click', () => {
    localStorage.removeItem('currUser');
    window.location.href = "index.html";
  });
  const signoutListItem = document.createElement('li');
  signoutListItem.classList.add('nav-item', 'p-2', 'anonButton');
  signoutListItem.appendChild(signoutButton);
  
  navbar.appendChild(signoutListItem);


} else {
  // Show the "login" and "signup" buttons
  loginButton.style.display = 'block';
  signupButton.style.display = 'block';
}