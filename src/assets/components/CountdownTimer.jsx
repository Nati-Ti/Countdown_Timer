import React, { useState, useEffect, useRef } from 'react';
import './CountdownTimer.css';

const CountdownTimer = () => {
  const [hours, setHours] = useState('0');
  const [minutes, setMinutes] = useState('0');
  const [seconds, setSeconds] = useState('10');
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [timerActive, setTimerActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timerDone, setTimerDone] = useState(false);
  const intervalRef = useRef();
  const targetTimeRef = useRef();

  const calculateTimeLeft = () => {
    const difference = targetTimeRef.current - new Date();
    let timeLeft = { hours: 0, minutes: 0, seconds: 0 };

    if (difference > 0) {
      timeLeft = {
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    let parsedValue = parseInt(value, 10);
    if (isNaN(parsedValue)) {
      parsedValue = 0;
    }
    if (id === 'hourInput') {
      setHours(parsedValue.toString());
    } else if (id === 'minInput') {
      setMinutes(parsedValue.toString());
    } else if (id === 'secInput') {
      setSeconds(parsedValue.toString());
    }
  };

  
  const startTimer = () => {
    const totalSeconds = parseInt(hours, 10) * 3600 + parseInt(minutes, 10) * 60 + parseInt(seconds, 10);
    if (totalSeconds > 0) {
      const currentTime = new Date().getTime();
      if (!timerActive || isPaused) {
        if (isPaused) {
          targetTimeRef.current = currentTime + (timeLeft.hours * 3600 + timeLeft.minutes * 60 + timeLeft.seconds) * 1000;
        } else {
          targetTimeRef.current = currentTime + totalSeconds * 1000;
          setTimeLeft(calculateTimeLeft()); // Set initial timeLeft value immediately
        }
        setTimerActive(true);
        setIsPaused(false);
        setTimerDone(false); // Reset timerDone when the timer starts
      } else {
        // Countdown is already active, so no need to start it again
        return;
      }
    }
  };

  const pauseTimer = () => {
    setTimerActive(false);
    setIsPaused(true);
  };

  const resetTimer = () => {
    setTimerActive(false);
    setIsPaused(false);
    setHours('0');
    setMinutes('0');
    setSeconds('0');
    setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
    setTimerDone(false); // Reset timerDone when the timer is reset
  };
  
  useEffect(() => {
    if (timerActive && !isPaused) {
      const interval = setInterval(() => {
        const newTimeLeft = calculateTimeLeft();
        setTimeLeft(newTimeLeft);
  
        if (newTimeLeft.hours === 0 && newTimeLeft.minutes === 0 && newTimeLeft.seconds === 0) {
          setTimerActive(false);
          setIsPaused(false);
          clearInterval(interval); // Clear interval when countdown reaches 0
          setTimerDone(true); // Set timerDone to true when the timer reaches zero
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timerActive, isPaused]);
  
  useEffect(()=> {
    if (timerDone == true){
      setTimeout(() => {
        setTimerDone(false);
      }, 5000);
    }
  }, [timerDone]);

  return (
    <div className='countDownTimer'>
      <div>
        <form>
          <div className='countDown_input'>
            <p>Hour</p>
            <p>Min</p>
            <p>Sec</p> 
          </div>

          <label htmlFor="hourInput"></label>
          <input
            id="hourInput"
            type="number"
            value={hours}
            onChange={handleInputChange}
            placeholder="0"
            min="0"
            required
          /> 

          <label htmlFor="minInput"></label>
          <input
            id="minInput"
            type="number"
            value={minutes}
            onChange={handleInputChange}
            placeholder="0"
            min="0"
            max="59"
            required
          />

          <label htmlFor="secInput"></label>
          <input
            id="secInput"
            type="number"
            value={seconds}
            onChange={handleInputChange}
            placeholder="0"
            min="0"
            max="59"
            required
          />
        </form>

        {timerActive || timerDone ?
          <div className={timerDone ?`countDown_display shaking-div` : `countDown_display`}>
          <h2>
            {timeLeft.hours.toString().padStart(2, '0')}:{' '}
            {timeLeft.minutes.toString().padStart(2, '0')}:{' '}
            {timeLeft.seconds.toString().padStart(2, '0')} sec 
          </h2>
        </div> :
        <div className={timerDone ?`countDown_display shaking-div` : `countDown_display`}>
          <h2>
            {hours.toString().padStart(2, '0')}:{' '}
            {minutes.toString().padStart(2, '0')}:{' '}
            {seconds.toString().padStart(2, '0')} sec 
          </h2>
        </div>}
        
        <div className='countDown_button'>
          {timerActive && !isPaused ? (
            <button onClick={pauseTimer}>Pause</button>
          ) : (
            <button onClick={startTimer}>{isPaused ? 'Resume' : 'Start'}</button>
          )}
          <button onClick={resetTimer}>Reset</button>
        </div>

        <div className='stopwatch_img'>
          <img src='https://www.pngkey.com/png/full/514-5141110_100-speed-stopwatch-icon-4.png' />
        </div>
        
      </div>
    </div>
  );
};

export default CountdownTimer;
