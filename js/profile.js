document.getElementById("noUser").style.display = "none"; 

const currUser = localStorage.getItem('currUser');
console.log("Curr user is" + currUser)
// if no current user, don't display page
if (!currUser) {
document.getElementById("noUser").style.display = "block"; 
document.getElementById("profileDiv").style.display = "none"; 
} else {
// get current user data
const users = JSON.parse(localStorage.getItem("users"));
const currentUser = users.find(user => user.username === currUser);

if (!currentUser) {
    document.getElementById("noUser").style.display = "block"; 
    document.getElementById("profileDiv").style.display = "none"; 
}

document.getElementById('username').textContent = currentUser.username;
document.getElementById('accountDate').textContent = currentUser.accountDate;
document.getElementById('gamesPlayed').textContent = currentUser.gamesPlayed;
document.getElementById('totalMoneyWon').textContent = currentUser.moneyWon;
document.getElementById('profilePic').src = "https://robohash.org/" + currentUser.username + ".png"

currentUser.games.forEach((value) => {
    console.log(value);
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
    location.reload();
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

