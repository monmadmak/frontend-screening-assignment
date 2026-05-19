import type { AverageTravelTime, FlightLog, RouteStat } from "./flightlog.types";

export type AverageTrackerState = {
  pendingDepartures: Record<string, FlightLog[]>;
  routeStats: Record<string, RouteStat>;
};

const normalizePassengerName = (passengerName: string) =>
  passengerName.trim().toLowerCase();

const buildRouteKey = (departure: FlightLog, arrival: FlightLog) =>
  `${departure.airport} to ${arrival.airport}`;

export function createEmptyAverageTracker(): AverageTrackerState {
  return {
    pendingDepartures: {},
    routeStats: {},
  };
}

export function addLogToAverageTracker(
  state: AverageTrackerState,
  log: FlightLog
): AverageTrackerState {
  const passengerName = normalizePassengerName(log.passengerName);

  if (log.type === "departure") {
    return {
      ...state,
      pendingDepartures: {
        ...state.pendingDepartures,
        [passengerName]: [...(state.pendingDepartures[passengerName] || []), log],
      },
    };
  }

  const [departure, ...remainingDepartures] =
    state.pendingDepartures[passengerName] || [];

  if (!departure) {
    return state;
  }

  const travelTime = Number(log.timestamp) - Number(departure.timestamp);

  if (travelTime < 0) {
    return state;
  }

  const route = buildRouteKey(departure, log);
  const currentStat = state.routeStats[route] || { totalTime: 0, count: 0 };

  return {
    pendingDepartures: {
      ...state.pendingDepartures,
      [passengerName]: remainingDepartures,
    },
    routeStats: {
      ...state.routeStats,
      [route]: {
        totalTime: currentStat.totalTime + travelTime,
        count: currentStat.count + 1,
      },
    },
  };
}

export function buildAverageTracker(logs: FlightLog[]): AverageTrackerState {
  return logs.reduce(addLogToAverageTracker, createEmptyAverageTracker());
}

export function getAverageTravelTimes(
  routeStats: Record<string, RouteStat>
): AverageTravelTime[] {
  return Object.entries(routeStats).map(([route, stat]) => ({
    route,
    averageTime: stat.totalTime / stat.count,
  }));
}
