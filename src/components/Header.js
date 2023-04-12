import { NavLink, Link } from "react-router-dom";

function Header() {
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
          console.log("quote thing"+response);
          document.getElementById("quoteBlock").textContent = response.content;
          document.getElementById("authorBlock").textContent = response.author;
        })
        .finally(console.log("did a fetch"));
      
      });

  return (
    <nav class="navbar navbar-expand-md navbar-dark bg-secondary py-0">
      <div class="container-fluid">
          <NavLink class="navbar-brand font-weight-bold" to="#">CoolPoker</NavLink>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarContent">
              <ul class="navbar-nav ms-auto">
                <p class="navbar-brand font-weight-bold my-2" id="greeting" style={{display: 'none'}}>Hello, <span id="playerName">user</span></p>
                  <li class="nav-item p-2 anonButton" id="loginButton">
                        <button type="button" class="btn btn-light border border-dark rounded-pill py-0"> <NavLink class="nav-link text-dark" to="login.html">Login</NavLink></button>
                  </li>
                  <li class="nav-item p-2 anonButton" id="signupButton" style={{display: 'none'}}>
                    <button type="button" class="btn btn-dark rounded-pill py-0"> <NavLink class="nav-link text-light" to="signup.html">Sign Up</NavLink></button>
                  </li>
                  <li class="nav-item p-2 anonButton" id="profileButton" style={{display: 'none'}}>
                    <button type="button" class="btn btn-light border border-dark rounded-pill py-0"> <NavLink class="nav-link text-dark" to="profile.html">Profile</NavLink></button>
                  </li>
                  <li class="nav-item p-2 anonButton" id="logoutButton" style={{display: 'none'}}>
                    <button type="button" class="btn btn-dark rounded-pill py-0"> <NavLink class="nav-link text-light" to="signup.html">Logout</NavLink></button>
                  </li>
              </ul>
          </div>
          <div class="container">
        <div class="row">
          <div class="col-md-8 mx-auto">
            <div class="card shadow-lg rounded-lg">
              <div class="card-body p-4">
                <blockquote class="blockquote mb-0">
                  <p class="text-center" id="quoteBlock">Loading...</p>
                  <footer class="blockquote-footer text-center" id="authorBlock">Loading...</footer>
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </nav>
  );
}

function setDisplay(controlId, display) {
  const playControlEl = document.querySelector(`#${controlId}`);
  if (playControlEl) {
    playControlEl.style.display = display;
  }
}

async function getUser(email) {
// See if we have a user with the given email.
console.log("getuser")
const response = await fetch(`/api/user/${email}`);
if (response.status === 200) {
  console.log(response);
  return response.json();
}

return null;
}

export default Header;
