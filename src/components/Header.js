import { NavLink, Link } from "react-router-dom";
import React, { useState, useEffect } from 'react';

function Header({ user }) {
  const [userData, setUserData] = useState(null);
  let port = window.location.port;
  if (process.env.NODE_ENV !== 'production') {
    port = 3000;
  }
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`/api/user/${user}`);
        const data = await response.json();
        setUserData(data);
        console.log(data);
      } catch (error) {
        console.error("The error: " + error);
        const response = await fetch(`/api/user/${user}`);
        const data = await response.text();
        if (data) {
          console.log(data);
        } else {
          console.log("No response");
        }
      }
    }
    fetchData();
  }, [user]);

  if (!userData) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>User Data for {user}</h1>
      <p>Name: {userData.name}</p>
      <p>Email: {userData.email}</p>
      <p>Age: {userData.age}</p>
    </div>
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
console.log("RESPONSE: " + response.text());
if (response.status === 200) {
  console.log(response);
  return response.json();
}

return null;
}

export default Header;
