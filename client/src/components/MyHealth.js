import React, { useState, useEffect } from 'react';
import '../styles/Dashboard.css';

const MyHealth = () => {
  const [phase, setPhase] = useState('Inhale');
  const [count, setCount] = useState(4);
  const [duration, setDuration] = useState(4);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started) return;

    const interval = setInterval(() => {
      if (count === 0) {
        if (phase === 'Inhale') {
          setPhase('Hold');
          setCount(4);
          setDuration(4);
        } else if (phase === 'Hold') {
          setPhase('Exhale');
          setCount(6);
          setDuration(6);
        } else {
          setPhase('Inhale');
          setCount(4);
          setDuration(4);
        }
      } else {
        setCount(prev => prev - 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [count, phase, started]);

  const handleStart = () => {
    setStarted(true);
    setPhase('Inhale');
    setCount(4);
    setDuration(4);
  };

  const handleStop = () => {
    setStarted(false);
    setPhase('Inhale');
    setCount(4);
    setDuration(4);
  };

  return (
    <div className="health-section-container">
      {/* Breathing Exercise Box */}
      <div className="health-section">
        <h2 className="test-title">Breathing Exercise</h2>
        <p className="breath-instruction">Follow the breathing rhythm below:</p>

        <div
          className={`breathing-circle ${phase.toLowerCase()}`}
          style={{
            transition: `transform ${duration}s ease-in-out`
          }}
        >
          <span className="phase-label">{phase}</span>
          <span className="timer">{count}</span>
        </div>

        {!started ? (
          <button className="start-breathing-btn" onClick={handleStart}>
            Start
          </button>
        ) : (
          <button className="stop-breathing-btn" onClick={handleStop}>
            Stop
          </button>
        )}
      </div>

      {/* Posture Exercise Box */}
      <div className="posture-section">
        <h2 className="test-title">Office Posture Exercise</h2>
        <p className="posture-description">Straighten your back, roll your shoulders slowly, and relax your neck.</p>
        <div className="posture-animation">
          🧍‍♂️↕️💺
        </div>
        <p className="posture-instruction">Repeat every 30 mins for better spinal health.</p>
      </div>

      {/* Eye Rest Exercise Box */}
      <div className="eye-rest-section">
        <h2>Eye Rest Exercise</h2>
        <p className="eye-description">
          Give your eyes a break to reduce strain. Try the 20-20-20 rule: every 20 minutes, look at something 20 feet away for 20 seconds.
        </p>
        <div className="eye-animation">👁️</div>
        <p className="eye-instruction">Blink gently and relax your focus for a few seconds.</p>
      </div>
    </div>
  );
};

export default MyHealth;
