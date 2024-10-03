import React, { useState, useRef, useEffect } from "react";
import "./Gameplay.css";

function Gameplay() {
  const [isRunning, setIsRunning] = useState(false);
  const [reactionTimes, setReactionTimes] = useState([]);
  const [startTime, setStartTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [redDotPosition, setRedDotPosition] = useState({
    top: "50%",
    left: "50%",
  });
  const [dotVisible, setDotVisible] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1000);
      }, 1000);
      const randomizeDotPosition = () => {
        setRedDotPosition({
          top: `${Math.random() * 90}%`,
          left: `${Math.random() * 90}%`,
        });
      };
      const dotAppearTimeout = setTimeout(() => {
        randomizeDotPosition();
        setDotVisible(true);
      }, Math.random() * 2000 + 1000);
      return () => {
        clearTimeout(dotAppearTimeout);
      };
    } else {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [isRunning]);

  const handleStart = () => {
    setIsRunning(true);
    setStartTime(Date.now());
    setElapsedTime(0);
  };

  const handleStop = () => {
    setIsRunning(false);
    setDotVisible(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setElapsedTime(0);
    setReactionTimes([]);
    setDotVisible(false);
  };

  const handleDotClick = () => {
    if (dotVisible) {
      const reactionTime = Date.now() - startTime;
      if (reactionTimes.length === 5) {
        setReactionTimes((prev) => [...prev.slice(1), reactionTime]);
      } else {
        setReactionTimes((prev) => [...prev, reactionTime]);
      }
      setDotVisible(false);
    }
  };

  return (
    <div className="App">
      <h1>Reaction Game</h1>
      <div className="controls">
        <button onClick={handleStart}>Start</button>
        <button onClick={handleStop}>Stop</button>
        <button onClick={handleReset}>Reset</button>
      </div>
      <div className="stopwatch">
        <p>Elapsed Time: {Math.floor(elapsedTime / 1000)}s</p>
      </div>
      <div className="game-area" onClick={handleDotClick}>
        {dotVisible && (
          <div
            className="red-dot"
            style={{ top: redDotPosition.top, left: redDotPosition.left }}
          ></div>
        )}
      </div>
      <div className="reaction-table">
        <table>
          <thead>
            <tr>
              <th>Reaction Time (ms)</th>
            </tr>
          </thead>
          <tbody>
            {reactionTimes.map((time, index) => (
              <tr key={index}>
                <td>{time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Gameplay;
