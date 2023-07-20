import React, { Component } from 'react'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import Room from '../routes/Room'
import Welcome from '../routes/Welcome'
import Join from '../routes/Join'

export default class AppRouters extends Component {
  render() {
    return (
      <Router>
        <Routes>
            <>
                <Route path="/" element={<Welcome/>}/>
                <Route path="/:roomId" element={<Join/>}/>
                <Route path="/lobby" element={<Room/>}/>
            </>
        </Routes>
      </Router>
    )
  }
}
