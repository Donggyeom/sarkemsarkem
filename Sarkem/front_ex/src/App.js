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
import NotFound from './pages/NotFound';
import ResultPage from './pages/ResultPage';
import { RoomProvider } from './Context';
import { GameProvider } from './GameContext';


const App = () => {
  return (
    <RoomProvider>
      <GameProvider>
        <Routes>
          <Route path="/" element={<StartPage />} />
          <Route path="/loading" element={<LoadingPage />} />
          <Route path="/:roomId" element={<CommonStart />} /> 
          {/* <Route path="/start/unhost" element={<StartUnhost />} />  */}
          <Route path="/:roomId/lobby" element={<CommonLobby />}/>
          <Route path="/:roomId/day" element={<DayPage />}/>
          <Route path="/:roomId/sunset" element={<SunsetPage />}/>
          <Route path="/:roomId/night" element={<NightPage />}/>
          <Route path="/:roomId/result" element={<ResultPage />}/>
          <Route path="*" element={<NotFound />}/>
        </Routes>
      </GameProvider>
    </RoomProvider>


  );
};

export default App;