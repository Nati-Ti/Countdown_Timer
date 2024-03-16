import React, { useState, useEffect, useRef } from 'react';

const CountdownTimer = () => {
  const [hours, setHours] = useState('0');
  const [minutes, setMinutes] = useState('0');
  const [seconds, setSeconds] = useState('0');
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [timerActive, setTimerActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
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
        }
      }
      setTimerActive(true);
      setIsPaused(false);
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
  };

  useEffect(() => {
    if (timerActive && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(calculateTimeLeft());
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [timerActive, isPaused]);

  return (
    <div>
      <form>
        <label htmlFor="hourInput">Hour:</label>
        <input
          id="hourInput"
          type="number"
          value={hours}
          onChange={handleInputChange}
          placeholder="0"
          min="0"
          required
        />
        <label htmlFor="minInput">Minute:</label>
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
        <label htmlFor="secInput">Second:</label>
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
      <div>
        <div>
          {timeLeft.hours.toString().padStart(2, '0')}:{' '}
          {timeLeft.minutes.toString().padStart(2, '0')}:{' '}
          {timeLeft.seconds.toString().padStart(2, '0')} sec 
        </div>
      </div>
      <div>
        {timerActive && !isPaused ? (
          <button onClick={pauseTimer}>Pause</button>
        ) : (
          <button onClick={startTimer}>{isPaused ? 'Resume' : 'Start'}</button>
        )}
        <button onClick={resetTimer}>Reset</button>
      </div>
    </div>
  );
};

export default CountdownTimer;
