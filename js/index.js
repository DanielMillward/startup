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