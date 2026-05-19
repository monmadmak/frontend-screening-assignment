"use client";

import { useCallback, useState, useEffect } from "react";
import Image from "next/image";
import styles from "./Home.module.css";
import {
  addLogToAverageTracker,
  buildAverageTracker,
  createEmptyAverageTracker,
  getAverageTravelTimes,
} from "../(flightlog)/flightlog.average";
import { FlightLogService } from "../(flightlog)/flightlog.service";
import type {
  AverageTravelTime,
  FlightLog,
} from "../(flightlog)/flightlog.types";
import type { AverageTrackerState } from "../(flightlog)/flightlog.average";
import LogCard from "../(flightlog)/LogCard";
import LogForm from "../(flightlog)/LogForm";
// import BoardingPassCard from "../(boardingpass)/BoardingPassCard";

const flightLogService = new FlightLogService();

function formatDuration(seconds: number) {
  const roundedSeconds = Math.round(seconds);

  if (roundedSeconds < 60) {
    return `${roundedSeconds} sec`;
  }

  if (roundedSeconds < 60 * 60) {
    return `${Math.round(roundedSeconds / 60)} min`;
  }

  return `${Math.round(roundedSeconds / 3600)} hour`;
}

export default function Home() {
  const [logs, setLogs] = useState<FlightLog[]>([]);
  const [averageTracker, setAverageTracker] = useState<AverageTrackerState>(
    createEmptyAverageTracker()
  );
  const [averageTravelTimes, setAverageTravelTimes] = useState<
    AverageTravelTime[]
  >([]);

  const handleAddLog = useCallback(
    (log: FlightLog) => {
      setLogs((prevLogs) => [...prevLogs, log]);
      setAverageTracker((currentTracker) =>
        addLogToAverageTracker(currentTracker, log)
      );
    },
    []
  );

  const handlePrintAvgTime = useCallback(() => {
    setAverageTravelTimes(getAverageTravelTimes(averageTracker.routeStats));
  }, [averageTracker.routeStats]);

  useEffect(() => {
    const fetch = async () => {
      const data = await flightLogService.getLogs();
      const tracker = data.length
        ? buildAverageTracker(data)
        : createEmptyAverageTracker();

      setLogs(data);
      setAverageTracker(tracker);
    };

    fetch();
  }, []);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Next Airline!</a>
        </h1>
        <p className={styles.description}>
          Get started by editing{" "}
          <code className={styles.code}>app/(home)/page.tsx</code>
        </p>
        <div className={styles.card} style={{ margin: 16, width: "100%" }}>
          <h2>Flight Logs</h2>
          <LogCard style={{ width: "100%" }} data={logs}></LogCard>
          <button onClick={handlePrintAvgTime} style={{ marginTop: 16 }}>
            Print avg time
          </button>

          <div style={{ marginTop: 16 }}>
            {averageTravelTimes.length === 0 ? (
              <p>No average travel time calculated yet.</p>
            ) : (
              averageTravelTimes.map(({ route, averageTime }) => (
                <p key={route}>
                  {route} : {formatDuration(averageTime)}
                </p>
              ))
            )}
          </div>
        </div>
        <div className={styles.card} style={{ margin: 16, width: "100%" }}>
          <h2>Departure Logging</h2>
          <LogForm
            style={{ width: "100%" }}
            type={"departure"}
            onSubmit={handleAddLog}
          ></LogForm>
        </div>
        <div className={styles.card} style={{ margin: 16, width: "100%" }}>
          <h2>Arrival Logging</h2>
          <LogForm
            style={{ width: "100%" }}
            type={"arrival"}
            onSubmit={handleAddLog}
          ></LogForm>
        </div>
        {/* Render boarding pass here */}
        {/* {[].map((_, i) => ( */}
        {/*   <BoardingPassCard key={i} /> */}
        {/* ))} */}
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
}
