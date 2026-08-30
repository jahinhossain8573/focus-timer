"use client";

import { useState, useRef, useEffect } from "react";

export default function App() {
  const [isRunning, alterIsRunning] = useState(false);
  const [elapsedTime, alterElapsedTime] = useState(0);
  const [totalTime, alterTotalTime] = useState(0);
  const initialTime = useRef(0);
  const intervalID = useRef(null);

  useEffect(() => {
    if (isRunning) {
      intervalID.current = setInterval(() => {
        alterElapsedTime(Date.now() - initialTime.current);
      }, 1000);
    } else {
      clearInterval(intervalID.current);
    }
  }, [isRunning]);

  function onPressed() {
    alterIsRunning(!isRunning);
    if (isRunning === false) {
      initialTime.current = Date.now() - elapsedTime;
    }
  }

  function onReset() {
    alterElapsedTime(0);
    alterTotalTime(totalTime + elapsedTime);
  }

  return (
    <div className="p-4 gap-5">
      <header className="flex justify-between items-center text-amber-200">
        <h1 className="text-4xl">
          <b>Pomodoro Timer</b>
        </h1>
        <span className="text-2xl">
          Hours Focused: {Math.trunc(totalTime / 1000 / 60).toString()}:
          {(Math.trunc(totalTime / 1000) % 60).toString()}
        </span>
      </header>
      <div className="text-amber-50 text-center p-10">
        <h2 className="p-2 text-2xl">
          {Math.trunc(elapsedTime / 1000 / 60).toString()}:
          {(Math.trunc(elapsedTime / 1000) % 60).toString()}
        </h2>
        {isRunning ? (
          <>
            <button
              className="border border-amber-50 px-2 py-1 rounded-2xl"
              onClick={onPressed}
            >
              Stop Timer
            </button>
          </>
        ) : (
          <div className="flex gap-4 justify-center">
            <button
              className="border border-amber-50 px-2 py-1 rounded-2xl"
              onClick={onPressed}
            >
              Start Timer
            </button>
            {elapsedTime === 0 ? (
              <></>
            ) : (
              <button
                className="border border-amber-50 px-2 py-1 rounded-2xl"
                onClick={onReset}
              >
                Reset Timer
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
