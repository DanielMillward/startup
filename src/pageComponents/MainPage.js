import React, { useState, useEffect } from 'react';

function MainPage() {
    const [quote, setQuote] = useState('');
    const [author, setAuthor] = useState('');

    useEffect(() => {
        async function fetchData() {
        const response = await fetch('https://api.quotable.io/random');
        const data = await response.json();
        setQuote(data.content);
        setAuthor(data.author);
        }
        fetchData();
    }, []);

    return (
        <main>
        <div class="container">
          <div class="row">
            <div class="col-md-8 mx-auto">
              <div class="card shadow-lg rounded-lg">
                <div class="card-body p-4">
                  <blockquote class="blockquote mb-0">
                    <p class="text-center" id="quoteBlock">{quote}</p>
                    <footer class="blockquote-footer text-center" id="authorBlock">{author}</footer>
                  </blockquote>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="d-flex justify-content-center p-4">
          <img class="img-fluid customClass" src="/images/maincards.svg" alt="cards"></img>
        </div>
        <h1 class="text-center">The CoolPoker Website</h1>
      </main>
    );
  }
  
  export default MainPage;
  