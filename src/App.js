import React, { Component } from "react";
import "./App.css";
import Patient from "./components/patient";
class App extends Component {
  state = { sortColumn: "name" };

  render() {
    return (
      <div className="App">
        <Patient />
      </div>
    );
  }
}

export default App;
