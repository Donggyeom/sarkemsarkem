import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import StartPage from './pages/StartPage';
import StartHost from './pages/StartHost'; // Import StartHost component
import StartUnhost from './pages/StartUnhost'; // Import StartUnhost component
import LoadingPage from './pages/LoadingPage';
import LobbyPage from './pages/LobbyPage';


const App = () => {
  return (
      <Routes>
        <Route path="/start" element={<StartPage />} />
        <Route path="/start/host" element={<StartHost />} /> 
        <Route path="/start/unhost" element={<StartUnhost />} /> 
        <Route path="/loading" element={<LoadingPage />} />
        <Route path="/lobby" element={<LobbyPage />}/>
      </Routes>


  );
};

export default App;