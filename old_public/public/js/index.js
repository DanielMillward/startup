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

  const url = "https://api.quotable.io/random";
fetch(url)
  .then((x) => x.json())
  .then((response) => {
    document.getElementById("quoteBlock").textContent = response.content;
    document.getElementById("authorBlock").textContent = response.author;
  });

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

/*

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
    location.reload();
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
*/