let goodResponse = false;

fetch('/api/getprofile', {
  method: 'GET',
  headers: {
    'Cookie': document.cookie
  }
})
  .then(response => {
    if (response.ok) {
      // Handle successful response (status 200-299)
      goodResponse = true;
      return response.json();
    } else if (response.status === 401) {
      // Handle unauthorized response (status 401)
      alert('no cookie found');
    } else if (response.status === 422) {
      // Handle unauthorized response (status 401)
      alert('no match');
    } else {
      // Handle other errors
      throw new Error('Something went wrong');
    }
  })
  .then(data => {
    // Handle the data
    console.log("response was " + goodResponse);
    console.log(data);
    if (goodResponse) {
      // name: "hi3", createDate: "3/30/2023", numGamesPlayed: 0, totalMoneyWon: 0, games: []
      document.getElementById('username').textContent = data.name;
      document.getElementById('accountDate').textContent = data.createDate;
      document.getElementById('gamesPlayed').textContent = data.numGamesPlayed;
      document.getElementById('totalMoneyWon').textContent = data.totalMoneyWon;
      document.getElementById('profilePic').src = "https://robohash.org/" + encodeURIComponent(data.name) + ".png"
      document.querySelector('#playerName').textContent = data.name;
      setDisplay('loginButton', 'none');
      setDisplay('signupButton', 'none');
      setDisplay('profileButton', 'none');
      setDisplay('logoutButton', 'block');
      setDisplay('greeting', 'block');
      setDisplay('noUser', 'none');

      data.games.forEach((game) => {
        if (game != [0]){
          const parentDiv = document.getElementById("profileDiv");
        const gameDiv = document.createElement("div"); // Create a new div element
        gameDiv.classList.add("row", "bg-light", "p-3", "mt-3")
        const gameLink = document.createElement("a");
        gameLink.innerText = game.gameName;
        gameLink.href = '/game.html?hostUser=' + encodeURI(game.thisPlayer) + '&gameName=' + encodeURI(game.gameName);
        const usertext = document.createElement("p");
        usertext.innerText = "Other Player: " + game.otherPlayer;
        const bbtext = document.createElement("p");
        bbtext.innerText = "Beginning BB: " + game.bb;
        const startonetext = document.createElement("p");
        startonetext.innerText = "Beginning Stack for Host: " + game.stackThis * game.bb;
        const starttwotext = document.createElement("p");
        starttwotext.innerText = "Beginning Stack for Other Player: " + game.stackOther * game.bb;
      
        gameDiv.appendChild(gameLink);
        gameDiv.appendChild(usertext);
        gameDiv.appendChild(bbtext);
        gameDiv.appendChild(startonetext);
        gameDiv.appendChild(starttwotext);
        // Add the div to the HTML body
        parentDiv.appendChild(gameDiv);
        }
        })
    } else {
      setDisplay('profileDiv', 'none');
      setDisplay('loginButton', 'block');
      setDisplay('signupButton', 'block');
      setDisplay('profileButton', 'none');
      setDisplay('logoutButton', 'none');
      setDisplay('greeting', 'none');
      setDisplay('noUser', 'block');
    }
  })
  .catch(error => {
    // Handle any errors
});


//document.getElementById('username').textContent = currentUser.username;
//document.getElementById('accountDate').textContent = currentUser.accountDate;
//document.getElementById('gamesPlayed').textContent = currentUser.games.length;
///document.getElementById('totalMoneyWon').textContent = currentUser.moneyWon;
//document.getElementById('profilePic').src = "https://robohash.org/" + encodeURIComponent(currentUser.username) + ".png"












function setDisplay(controlId, display) {
  const playControlEl = document.querySelector(`#${controlId}`);
  if (playControlEl) {
    playControlEl.style.display = display;
  }
}

const signoutButton = document.getElementById('logoutButton');

signoutButton.addEventListener('click', () => {
  document.cookie = "userToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "userName=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  window.location.href = "index.html";
});
