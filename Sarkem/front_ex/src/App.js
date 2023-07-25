/* eslint-disable */
import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import StartPage from './pages/StartPage';
// import StartHost from './pages/StartHost'; // Import StartHost component
// import StartUnhost from './pages/StartUnhost'; // Import StartUnhost component
import CommonStart from './pages/CommonStart';
import LoadingPage from './pages/LoadingPage';
// import LobbyPage from './pages/LobbyPage';
import CommonLobby from './pages/CommonLobby';
import DayPage from './pages/DayPage';
import SunsetPage from './pages/SunsetPage';
import NightPage from './pages/NightPage';


const App = () => {
  return (
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/:roomId" element={<CommonStart />} /> 
        {/* <Route path="/start/unhost" element={<StartUnhost />} />  */}
        <Route path="/loading" element={<LoadingPage />} />
        <Route path="/lobby" element={<CommonLobby />}/>
        <Route path="/day" element={<DayPage />}/>
        <Route path="/sunset" element={<SunsetPage />}/>
        <Route path="/night" element={<NightPage />}/>
      </Routes>


  );
};

export default App;