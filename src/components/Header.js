import { Link } from "react-router-dom";
import React, { useState, useEffect } from 'react';

function Header({ user }) {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`/api/user/${user}`);
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
          console.log(data);
        } else {
          throw new Error("Network response was not ok");
        }
      } catch (error) {
        console.error("The error: " + error);
        const response = await fetch(`/api/user/${user}`);
        const dataerr = await response.text();
        setError(dataerr || "No response");
      }
    }
    fetchData();
  }, [user]);

  if (error) {
    return (
      <nav class="navbar navbar-expand-md navbar-dark bg-secondary py-0">
      <div class="container-fluid">
          <Link class="navbar-brand font-weight-bold" to="/">CoolPoker</Link>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarContent">
              <ul class="navbar-nav ms-auto">
                  <li class="nav-item p-2 anonButton" id="loginButton">
                        <button type="button" class="btn btn-light border border-dark rounded-pill py-0"> <Link class="nav-link text-dark" to="login.html">Login</Link></button>
                  </li>
                  <li class="nav-item p-2 anonButton" id="signupButton">
                    <button type="button" class="btn btn-dark rounded-pill py-0"> <Link class="nav-link text-light" to="signup.html">Sign Up</Link></button>
                  </li>
              </ul>
          </div>
      </div>
    </nav>
    );
  }

  if (!userData) {
    return <p>Loading...</p>;
  }

  function logOut() {
    document.cookie = "userToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "userName=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "index.html";
  }

  return (
    <nav class="navbar navbar-expand-md navbar-dark bg-secondary py-0">
      <div class="container-fluid">
          <Link class="navbar-brand font-weight-bold" to="/">CoolPoker</Link>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarContent">
              <ul class="navbar-nav ms-auto">
                <p class="navbar-brand font-weight-bold my-2" id="greeting">Hello, <span id="playerName">{userData.name}</span></p>
                  <li class="nav-item p-2 anonButton" id="profileButton">
                    <button type="button" class="btn btn-light border border-dark rounded-pill py-0"> <Link class="nav-link text-dark" to="profile.html">Profile</Link></button>
                  </li>
                  <li class="nav-item p-2 anonButton" id="logoutButton">
                    <button type="button" class="btn btn-dark rounded-pill py-0" onClick={logOut}> <Link class="nav-link text-light" to="/">Logout</Link></button>
                  </li>
              </ul>
          </div>
      </div>
    </nav>
  );
}

export default Header;
