import React, { Component } from 'react';
import logo from './gtri.png';
import './App.css';
import JobList from "./components/JobList";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
  render() {
    return (
      <div className="App">
        <header className="App-header">
            <div> <img src={logo} className="App-logo" alt="logo" /> <div className="App-name">ClarityNLP</div></div>
        </header>
        <div className="App-intro container-fluid">
            <JobList url={process.env.REACT_APP_CLARITY_NLP_URL}/>
        </div>
      </div>
    );
  }
}

export default App;
