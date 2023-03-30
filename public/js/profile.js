document.getElementById("noUser").style.display = "none"; 

const currUser = localStorage.getItem('currUser');
console.log("Curr user is" + currUser)
// if no current user, don't display page
if (!currUser) {
document.getElementById("noUser").style.display = "block"; 
document.getElementById("newGameDiv").style.display = "none"; 
} else {
// get current user data
const users = JSON.parse(localStorage.getItem("users"));
const currentUser = users.find(user => user.username === currUser);

if (!currentUser) {
    document.getElementById("noUser").style.display = "block"; 
    document.getElementById("newGameDiv").style.display = "none"; 
}

document.getElementById('username').textContent = currentUser.username;
document.getElementById('accountDate').textContent = currentUser.accountDate;
document.getElementById('gamesPlayed').textContent = currentUser.games.length;
document.getElementById('totalMoneyWon').textContent = currentUser.moneyWon;
document.getElementById('profilePic').src = "https://robohash.org/" + encodeURIComponent(currentUser.username) + ".png"

// TODO: Update money won to be (total absolute starting stack) - (total absolutefinal stack)
// Since they're in BB and that changes game to game

currentUser.games.forEach((game) => {
  if (game != [0]){
    const parentDiv = document.getElementById("profileDiv");
  const gameDiv = document.createElement("div"); // Create a new div element
  gameDiv.classList.add("row", "bg-light", "p-3", "mt-3")
  const gameLink = document.createElement("a");
  gameLink.innerText = game[0];
  gameLink.href = '/game.html?userData=' + encodeURI(JSON.stringify(game));
  const usertext = document.createElement("p");
  usertext.innerText = "Other Player: " + game[5];
  const bbtext = document.createElement("p");
  bbtext.innerText = "Beginning BB: " + game[3];
  const startonetext = document.createElement("p");
  startonetext.innerText = "Beginning Stack for Player 1: " + game[1];
  const starttwotext = document.createElement("p");
  starttwotext.innerText = "Beginning Stack for Player 1: " + game[2];

  gameDiv.appendChild(gameLink);
  gameDiv.appendChild(usertext);
  gameDiv.appendChild(bbtext);
  gameDiv.appendChild(startonetext);
  gameDiv.appendChild(starttwotext);
  // Add the div to the HTML body
  parentDiv.appendChild(gameDiv);
  }
});



    
}






// Get the navbar elements
const anonButtons = document.querySelectorAll('.anonButton');
const loginButton = anonButtons[0].querySelector('button');
const signupButton = anonButtons[1].querySelector('button');

// Check if the user is logged in
if (localStorage.getItem('currUser')) {
  anonButtons.forEach(button => button.style.display = 'none');
  // Make sign out button
  const signoutButton = document.createElement('button');
  signoutButton.type = 'button';
  signoutButton.classList.add('btn', 'btn-dark', 'rounded-pill', 'py-0');
  signoutButton.innerText = 'Sign Out';

  signoutButton.addEventListener('click', () => {
    localStorage.removeItem('currUser');
    window.location.href = "index.html";
  });
  // Add the "sign out" button to the navbar
  const signoutListItem = document.createElement('li');
  signoutListItem.classList.add('nav-item', 'p-2', 'anonButton');
  signoutListItem.appendChild(signoutButton);
  const navbar = document.querySelector('.navbar-nav');
  navbar.appendChild(signoutListItem);
} else {
  // Show the "login" and "signup" buttons
  loginButton.style.display = 'block';
  signupButton.style.display = 'block';
}

