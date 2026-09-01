"use client";

import { useState, useRef, useEffect } from "react";
import { dbGet, dbLog } from "./components";
import { truncate } from "fs";
//import prisma from "@/app/db";

const buttonStyling = "bg-slate-800 px-2 py-1 rounded-2xl hover:bg-slate-700";

export default function App() {
  //prisma.$connect();
  const [isRunning, alterIsRunning] = useState(false);
  const [timeLeft, alterTimeLeft] = useState(3600 * 1000);
  const [totalTime, alterTotalTime] = useState(0);
  const [focusTime, alterFocusTime] = useState(3600 * 1000);
  const [taskName, alterTaskName] = useState("Miscellaneous Task");
  const [timerStarted, alterTimerStarted] = useState(false);
  const [db, alterDb] = useState<any[]>([]);
  const targetTime = useRef(0);
  const intervalID = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    dbGet().then(alterDb);
  }, []);

  useEffect(() => {
    if (isRunning) {
      intervalID.current = setInterval(() => {
        alterTimeLeft(targetTime.current - Date.now());
      }, 1000);
    } else if (intervalID.current !== null) {
      clearInterval(intervalID.current);
      intervalID.current = null;
    }
  }, [isRunning]);
  function onPressed() {
    alterIsRunning(!isRunning);
    alterTimerStarted(true);
    if (isRunning === false) {
      if (timerStarted) {
        targetTime.current = Date.now() + timeLeft;
      } else {
        targetTime.current = Date.now() + focusTime;
      }
      alterTimeLeft(targetTime.current - Date.now());
    }
  }

  function onReset() {
    dbLog(focusTime - timeLeft, taskName);
    targetTime.current = Date.now();
    alterTimerStarted(false);
    alterTaskName("Miscellaneous Task");
    dbGet().then(alterDb);
  }

  return (
    <div className="p-4 gap-5">
      <header className="flex justify-between items-center text-amber-200">
        <h1 className="text-4xl">
          <b>Pomodoro Timer</b>
        </h1>
        <span className="text-2xl">
          Minutes Focused:{" "}
          {Math.trunc(
            db.reduce((sum, session) => sum + session.time, 0) / 1000 / 60,
          ).toString()}
          :
          {(
            Math.trunc(
              db.reduce((sum, session) => sum + session.time, 0) / 1000,
            ) % 60
          ).toString()}
        </span>
      </header>
      <div className="text-amber-50 text-center p-10">
        <h2 className="p-2">
          {timerStarted ? (
            <>
              {Math.trunc(timeLeft / 1000 / 60).toString()}:
              {(Math.ceil(timeLeft / 1000) % 60).toString()}
            </>
          ) : (
            <div className="flex justify-center gap-4">
              <input
                type="text"
                placeholder="Task Name"
                className="bg-slate-800 rounded-2xl px-4"
                onChange={(e) => {
                  alterTaskName(e.target.value);
                }}
              ></input>
              <select
                value={focusTime}
                onChange={(e) => {
                  alterFocusTime(Number(e.target.value));
                  alterTimeLeft(Number(e.target.value));
                }}
                className=" px-2 py-1 rounded-2xl bg-slate-800 text-amber-200 text-center"
              >
                <option value={5 * 60 * 1000}>5 minutes</option>
                <option value={10 * 60 * 1000}>10 minutes</option>
                <option value={15 * 60 * 1000}>15 minutes</option>
                <option value={20 * 60 * 1000}>20 minutes</option>
                <option value={25 * 60 * 1000}>25 minutes</option>
                <option value={30 * 60 * 1000}>30 minutes</option>
                <option value={35 * 60 * 1000}>35 minutes</option>
                <option value={40 * 60 * 1000}>40 minutes</option>
                <option value={45 * 60 * 1000}>45 minutes</option>
                <option value={50 * 60 * 1000}>50 minutes</option>
                <option value={55 * 60 * 1000}>55 minutes</option>
                <option value={60 * 60 * 1000}>1 hour</option>
              </select>
            </div>
          )}
        </h2>
        {isRunning ? (
          <>
            <button className={buttonStyling} onClick={onPressed}>
              Stop Timer
            </button>
          </>
        ) : (
          <div className="flex gap-4 justify-center">
            <button className={buttonStyling} onClick={onPressed}>
              Start Timer
            </button>
            {timeLeft === 0 ? (
              <></>
            ) : (
              <button className={buttonStyling} onClick={onReset}>
                Reset Timer
              </button>
            )}
          </div>
        )}
      </div>
      <div className="flex justify-center">
        <table className="text-amber-50 border border-amber-50 p-8">
          <thead>
            <tr className="border border-amber-50">
              <th className="p-2 border border-amber-50">Session Name</th>
              <th className="p-2 border border-amber-50">Session Duration</th>
            </tr>
            {db.map((e) => (
              <tr key={e.id}>
                <td className="p-2 border border-amber-50">{e.title}</td>
                <td className="p-2 border border-amber-50">
                  {Math.trunc(e.time / 1000)} seconds
                </td>
              </tr>
            ))}
          </thead>
        </table>
      </div>
    </div>
  );
}
