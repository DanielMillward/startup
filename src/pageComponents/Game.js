import React, { useState, useEffect } from 'react';

function Game() {
  const [message, setMessage] = useState("");
  const userToken = getCookieValue("userToken");
  useEffect(() => {
    const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
    let port = window.location.port;
    let connectString = `${protocol}://${window.location.host}:${port}/?userToken=`+userToken;
    if (process.env.NODE_ENV !== 'production') {
        connectString = `${protocol}://localhost:3000/?userToken=`+userToken;
    }
    
    
    console.log(connectString)
    const socket = new WebSocket(connectString);

    socket.onopen = () => {
      console.log("WebSocket connection established.");
    };

    socket.onmessage = (event) => {
      setMessage(event.data);
    };

    socket.onclose = (event) => {
      console.log(`WebSocket connection closed with code: ${event.code}`);
    };

    return () => {
      socket.close();
    };
  }, []);

  return (
    <div>
      <h1>WebSocket Example</h1>
      <p>{message}</p>
    </div>
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
