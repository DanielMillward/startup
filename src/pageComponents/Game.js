import React, { useState, useEffect } from 'react';
import getCardName from '../helper/gameRules';
import '../index.css'


function Game() {
  const [message, setMessage] = useState("");
  const [oneStack, setOneStack] = useState("Loading...");
  const [twoStack, setTwoStack] = useState("Loading...");
  const [p1c1, setp1c1] = useState("Loading...");
  const [p1c2, setp1c2] = useState("Loading...");
  const [pot, setPot] = useState("Loading...");
  const [toMove, setToMove] = useState("Loading...");
  const [round, setRound] = useState("Loading...");

  const userName = getCookieValue("userName");
  const userToken = getCookieValue("userToken");

  const [gameName, setGameName] = useState(null);
  const [ws, setWs] = useState(null);


  useEffect(() => {
    

    const urlParams = new URLSearchParams(window.location.search);
    const hostUser = urlParams.get('hostUser');
    const gameNametemp = urlParams.get('gameName');
    console.log("gnt " +gameNametemp);
    setGameName(gameNametemp);
    let port = window.location.port;
    if (process.env.NODE_ENV !== 'production') {
      port = 3000;
    }
    const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
    let socket = new WebSocket(`${protocol}://${window.location.hostname}:${port}/?userToken=`+userToken);

    socket.onopen = () => {
      console.log("WebSocket connection established.");
      setWs(socket);
      let message = JSON.stringify({
        "request": "getactions",
        "data": {
          "email": hostUser,
          "gameName": gameNametemp
        }
      });
      setTimeout(
        function() {
          socket.send(message);
        }, 1000);
    };

    socket.onmessage = (event) => {
      let message = event.data;
      console.log(message);
      message = JSON.parse(message);
      console.log(`Received message: ${JSON.stringify(message)}`);

      //only message we recieve here is for updating the display.
      /*
      "playerCards": [currGame.thisPlayerCards[0], currGame.thisPlayerCards[1]],
              "tableCards": [],
              playerStack: playerStack,
              oppStack: oppStack,
              pot: currGame.pot */
      setp1c1("/images/English_pattern_" + getCardName(message.playerCards[0]) + ".svg");
      setp1c2("/images/English_pattern_" + getCardName(message.playerCards[1]) + ".svg"); 
      setOneStack("$" + message.playerStack);
      setTwoStack("$" + message.oppStack);
      setPot("$" + message.pot);
      setToMove(message.currPlayer + "\'s turn");
      setRound(message.currRound);
    };

    socket.onclose = (event) => {
      console.log(`WebSocket connection closed with code: ${event.code}`);
    };

    

    return () => {
      socket.close();
    };
  }, []);

  const handleClick = (buttonType) => {
    if (ws) {
      //!msg.data.email || !msg.data.gameName || !msg.data.action.player || !msg.data.action.actionName || !msg.data.action.value
      let message = {
        request: "update",
        data: {
          email: userName,
          gameName: gameName,
          action: {
            player: userName,
            actionName: buttonType
          }

        }
      }
      console.log("Message sending: " + message);
      ws.send(JSON.stringify(message)); 
    } else {
      console.log("WebSocket connection not established yet.");
    }
  };



  return (
    <main id="maincontent">
      <div class="container mt-4">
      <div class="row">
          <div class="col-lg-2">
            <h2 id="twoName">Player 2</h2>
            <h4 id="twoStack">{twoStack}</h4>
          </div>
          <div class="col-lg-1">
            <img class="img-fluid customClass" src="images/card_back.svg" style={{height: "100px"}} id="p2c1"></img>
          </div>
          <div class="col-lg-1">
            <img class="img-fluid customClass" src="images/card_back.svg" style={{height: "100px"}} id="p2c2"></img>
          </div>
          <div class="col-lg-8">
            </div>
      </div>
      <div class="row">
        <div class="d-flex justify-content-center">
          <div class="table-ellipse">
            <div class="text-center mt-5">
              <h4 id="tomove">{toMove}</h4>
              <div class="row mx-0 justify-content-center mb-3">
                <div class="col-2 px-0">
                  <img src="images/card_back.svg" alt="Card 1" class="card-img" id="t1"></img>
                </div>
                <div class="col-2 px-0">
                  <img src="images/card_back.svg" alt="Card 2" class="card-img" id="t2"></img>
                </div>
                <div class="col-2 px-0">
                  <img src="images/card_back.svg" alt="Card 3" class="card-img" id="t3"></img>
                </div>
                <div class="col-2 px-0">
                  <img src="images/card_back.svg" alt="Card 4" class="card-img" id="t4"></img>
                </div>
                <div class="col-2 px-0">
                  <img src="images/card_back.svg" alt="Card 5" class="card-img" id="t5"></img>
                </div>
                <div class="col-lg-3"></div>
              </div>
              <p id="pot">Pot: {pot}</p>
              <p id="newround">{round}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="row">
          <div class="col-lg-2">
            <h2 id="oneName">Player 1 (you)</h2>
            <h4 id="oneStack">{oneStack}</h4>
          </div>
          <div class="col-lg-1">
            <img class="img-fluid customClass" src={p1c1} style={{height: "100px"}} id="p1c1"></img>
          </div>
          <div class="col-lg-1">
            <img class="img-fluid customClass" src={p1c2} style={{height: "100px"}} id="p1c2"></img>
          </div>
          <div class="col-lg-4">
            </div>
          <div class="col-lg-4 pt-2">
            <div class="float-end">
              <div class="btn-group btn-group-justified">
                <div class="btn-group" role="group">
                    <button type="button" class="btn btn-primary btn-block" onClick={() => handleClick("check", null)}>Check</button>
                  </div>
                <div class="btn-group" role="group">
                  <button type="button" class="btn btn-danger btn-block" id="foldbutton" onClick={() => handleClick("fold", null)}>Fold</button>
                </div>
                <div class="btn-group" role="group">
                  <button type="button" class="btn btn-info btn-block" onClick={() => handleClick("betbb")}>Bet BB</button>
                </div>
                <div class="btn-group" role="group">
                  <button type="button" class="btn btn-success btn-block" onClick={() => handleClick("raisebb")}>Raise BB</button>
                </div>
                <div class="btn-group" role="group">
                  <button type="button" class="btn btn-secondary btn-block" onClick={() => handleClick("call")}>Call</button>
                </div>
              </div>
              
              
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}

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

export default Game;
