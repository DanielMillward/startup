import React, { useState } from "react";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async () => {
    try {
      const response = await fetch("/api/auth/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: username,
            password: password
          }),
      });
      if (response.status === 200) {
        // handle successful login
        console.log("Good login");
        window.location.href = '/profile';
      } else if (response.status === 413) {
        // handle successful login
        alert("Please input both username and password.");
      } else if (response.status === 409) {
        // handle successful login
        alert("Username is taken.");
      } else {
        // handle other response codes
        alert("Unknown error. Please try again later.");
      }
    } catch (error) {
      setError("Invalid username or password");
    }
  };

  return (
    <main id="maincontent">
      <div class="justify-content-center p-5 ">
        <h1 class="text-center mb-5">Signup</h1>
        <form id="login-form">
        <div class="form-outline mx-auto w-75">
          <input type="email" class="form-control" id="username-input" value={username} onChange={(e) => setUsername(e.target.value)}/>
          <label class="form-label" >Username</label>
        </div>
        <div class="form-outline mx-auto w-75">
          <input type="password" class="form-control" id="password-input" value={password} onChange={(e) => setPassword(e.target.value)}/>
          <label class="form-label" >Password</label>
        </div>
        
        </form>
        <div class="form-outline mx-auto w-75">
          <button class="btn btn-primary btn-block mb-3" id="login-button" onClick={handleSignup}>Sign in</button>
        </div>
      </div>
      
    </main>
  );
};

export default Signup;
