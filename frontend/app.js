import React, { useState } from 'react';
import LoginPage from './components/login';

function App() {
    // I don't know if we are going to be storing the token in localStorage, so may need to change this later
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  return (
    <div>
      {isLoggedIn ? (
        <div>
          <h1>Logged In!</h1>
          <p>You are logged in.</p>
          <button onClick={() => { localStorage.removeItem('token'); setIsLoggedIn(false);}}>Logout</button>
        </div>
      ) : (
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}

export default App;