import React, { useState, useEffect } from "react";
import { Link} from "react-router-dom";
const Profile = () => {
    const [gameList, setGameList] = useState([]);

  useEffect(() => {
    async function fetchGames() {
      try {
        const response = await fetch('/api/getprofile', {
            method: 'GET',
            headers: {
              'Cookie': document.cookie
            }
          });
        if (response.ok) {
          const data = await response.json();
          setGameList(data);
        } else {
          throw new Error('Network response was not ok');
        }
      } catch (error) {
        console.error('Error fetching games:', error);
      }
    }
    fetchGames();
  }, []);
//name, createDate, numGamesPlayed, totalMoneyWon, games
  return (
    <main>
    <div class="container mt-3" id="profileDiv">
    <div class="row bg-light px-3 py-4">
          <div class="col-lg-4">
            <img class="img-fluid customClass" id="profilePic" alt="robot" src={"https://robohash.org/" + encodeURIComponent(gameList.name) + ".png"}></img>
          </div>
          <div class="col-lg-8">
            <h1 id="username">{gameList.name}</h1>
            <p>Account created on <span id="accountDate">{gameList.createDate}</span></p>
            <p></p>
            <h3>Games Played:</h3>
            <p id="gamesPlayed">{gameList.numGamesPlayed}</p>
            <h3>Total Money Won:</h3>
            <p>$<span id="totalMoneyWon">{gameList.totalMoneyWon}</span></p>
          </div>
      </div>
      <div class="row bg-light p-3 mt-3">
        <div class="col-lg-5">
          <h1 >Created Games</h1>
        </div>
        <div class="col-lg-7 pt-2">
          <div class="float-end">
            <button type="button" class="text-right btn btn-light border border-dark rounded-pill"> <Link class="nav-link text-dark" to="/newgame">New game</Link></button>
          </div>
        </div>
      </div>
      {gameList.games && 
      gameList.games.map((game) => (
        <div class="row bg-light p-3 mt-3">
            <Link to={'/game?hostUser=' + encodeURI(game.thisPlayer) + '&gameName=' + encodeURI(game.gameName)}>{game.gameName}</Link>
            <p>{"Other Player: " + game.otherPlayer}</p>
            <p>{"Beginning BB: " + game.bb}</p>
            <p>{"Beginning Stack for Host: " + game.stackThis * game.bb}</p>
            <p>{"Beginning Stack for Other Player: " + game.stackOther * game.bb}</p>
        </div>
        ))}
    </div>
  </main>
  );
};

export default Profile;
