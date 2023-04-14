import React, { useState } from "react";

const NewGame = () => {
  const [gameName, setGameName] = useState("");
  const [otherPlayer, setOtherPlayer] = useState("");
  const [bb, setBB] = useState("");
  const [stackOne, setStackOne] = useState("");
  const [stackTwo, setStackTwo] = useState("");


  const handleNewGame = async () => {
    try {
      const response = await fetch('/api/addgame', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: getCookieValue("userName"),
          gameName: gameName,
          otherPlayer: otherPlayer,
          bb: bb,
          stackOne: stackOne,
          stackTwo: stackTwo
        })
        });
      if (response.status === 200) {
        // handle successful login
        console.log("Good game making");
        window.location.href = '/profile';
      } else if (response.status === 422) {
        // handle successful login
        alert("Incomplete/incorrect form of data. Make sure that BB/stack sizes are numbers.");
      } else if (response.status === 409) {
        // handle successful login
        alert("Game name already exists.");
      } else {
        // handle other response codes
        alert("Unknown error. Please try again later.");
      }

    } catch (error) {
      alert("Invalid username or password");
    }

  };

  return (
    <main id="maincontent">
      <div class="justify-content-center p-5 ">
        <h1 class="text-center mb-5">New Game</h1>
        <form id="login-form">
        <div class="form-outline mx-auto w-75">
          <input type="email" class="form-control" value={gameName} onChange={(e) => setGameName(e.target.value)}/>
          <label class="form-label" >Game Name</label>
        </div>
        <div class="form-outline mx-auto w-75">
          <input type="email" class="form-control" value={otherPlayer} onChange={(e) => setOtherPlayer(e.target.value)}/>
          <label class="form-label" >Other Player</label>
        </div>
        <div class="form-outline mx-auto w-75">
          <input type="email" class="form-control" value={bb} onChange={(e) => setBB(e.target.value)}/>
          <label class="form-label" >Big Blind</label>
        </div>
        <div class="form-outline mx-auto w-75">
          <input type="email" class="form-control" value={stackOne} onChange={(e) => setStackOne(e.target.value)}/>
          <label class="form-label" >Your starting stack size (in BB)</label>
        </div>
        <div class="form-outline mx-auto w-75">
          <input type="email" class="form-control" value={stackTwo} onChange={(e) => setStackTwo(e.target.value)}/>
          <label class="form-label" >Other player starting stack size (in BB)</label>
        </div>
        </form>
        <div class="form-outline mx-auto w-75">
          <button class="btn btn-primary btn-block mb-3" id="login-button" onClick={handleNewGame}>Create Game</button>
        </div>
      </div>
      
    </main>
  );
};

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

export default NewGame;
