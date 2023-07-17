import React, {Component} from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Lobby from "../routes/Lobby";
import Welcome from "../routes/Welcome";
import Join from "../routes/Join";
export default class AppRouter extends Component {
    render() {
      return (
          <Router>
              <div className="router">
                  <Routes>
                      <>
                          <Route path="/" element={<Welcome/>}/>
                          <Route path="/join" element={<Join/>}/>
                          <Route path="/lobby" element={<Lobby/>}/>
                      </>
                  </Routes>
              </div>
          </Router>
      )
    }
  }