import React, { Component } from 'react';
import logo from './gtri.png';
import './App.css';
import JobList from "./components/JobList";

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
            <div> <img src={logo} className="App-logo" alt="logo" /> <div className="App-name">ClarityNLP</div></div>
        </header>
        <p className="App-intro">
            <JobList/>
        </p>
      </div>
    );
  }
}

export default App;
