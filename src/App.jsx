import React from 'react';
import MonitoringUI from './Components/MonitoringUI';
import plantLogo from '../src/assets/plantlogo.jpg';
import './App.css';

const App = () => {
  console.log('App component rendering');
  return (
    <div className="app">
      <header className="app-header">
        <h1>Plant Monitoring System</h1>
        <img src={plantLogo} alt="Plant Logo" className='logo' />
      </header>
      <main className="app-main">
        <MonitoringUI />
      </main>
    </div>
  );
};

export default App;