import React from 'react';
import ShareLinkedin from 'react-share-linkedin';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
          <ShareLinkedin
            url="http://substancia.github.io"
            title="The web developer expert in Auvergne"
            summary="The web developer expert in Auvergne"
          />
        </a>
      </header>
    </div>
  );
}

export default App;
