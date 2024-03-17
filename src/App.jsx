import React from 'react';
import CountdownTimer from './assets/components/CountdownTimer';
import './App.css';

function App() {
  return (
    <div className='countDown_wrapper'>
      <h1 className='countDown_title'>Countdown Timer</h1>
      
      <CountdownTimer />
    </div>
  )
}

export default App