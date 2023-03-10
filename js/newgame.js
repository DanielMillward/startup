document.getElementById("noUser").style.display = "none"; 
const currUser = localStorage.getItem('currUser');
console.log("Curr user is " + currUser)

// if no current user, don't display page
if (!currUser) {
document.getElementById("noUser").style.display = "block"; 
document.getElementById("profileDiv").style.display = "none"; 
} else {
//Check all fields filled out


const gameNameInput = document.getElementById('gameName');
const otherPlayerInput = document.getElementById('otherPlayer');
const bigBlindInput = document.getElementById('bigBlind');
const startingStackOneInput = document.getElementById('stackOne');
const startingStackTwoInput = document.getElementById('stackTwo');
const signupBtn = document.getElementById('submitButton');

//user logged in and all fields made, time to add the game to the user list
const users = JSON.parse(localStorage.getItem("users"));
const currentUser = users.find(user => user.username === currUser);

if (!currentUser) {
    document.getElementById("noUser").style.display = "block"; 
    document.getElementById("newGameDiv").style.display = "none"; 
}


signupBtn.addEventListener('click', (event) => {
    event.preventDefault(); // Needed for some reason

    console.log('Game Name: ', gameNameInput.value);
    console.log('Big Blind: ', bigBlindInput.value);
    console.log('Starting Stack for Player 1: ', startingStackOneInput.value);
    console.log('Starting Stack for Player 2: ', startingStackTwoInput.value);


    if (gameNameInput.value && otherPlayerInput.value && !isNaN(bigBlindInput.value) && !isNaN(startingStackOneInput.value) && !isNaN(startingStackTwoInput.value)) {
      bb = parseInt(bigBlindInput.value)
      stackOne = parseInt(startingStackOneInput.value)
      stackTwo = parseInt(startingStackTwoInput.value)
      let alreadyExists = false;
      for (var i = 0; i < currentUser.games.length; i++) {
        if (currentUser.games[i][0] == gameNameInput.value) {
            alert("Game of same name already exists.");
            alreadyExists = true;
        }
        }
        if (! alreadyExists) {
            gameArray = [gameNameInput.value, stackOne, stackTwo, bb, currUser, otherPlayerInput.value]

        // Update games of user
        tempGames = currentUser.games;
        tempGames.push(gameArray);
        currentUser.games = tempGames
        let updatedUsers = JSON.stringify(users);
        localStorage.setItem('users', updatedUsers);

        window.location.href = '/game.html?userData=' + encodeURI(JSON.stringify(gameArray));
        }
    } else {
      alert("Please fill in all fields, with the big blind/stacks being a number.");
    }
  });

}




// Get the navbar elements
const anonButtons = document.querySelectorAll('.anonButton');
const loginButton = anonButtons[0].querySelector('button');
const signupButton = anonButtons[1].querySelector('button');

// Check if the user is logged in
if (currUser) {
    console.log("theres a user")
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
  // user not logged in
  loginButton.style.display = 'block';
  signupButton.style.display = 'block';
}

