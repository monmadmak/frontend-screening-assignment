export type FlightLogType = "departure" | "arrival";

export type FlightLog = {
  passengerName: string;
  airport: string;
  timestamp: string | number;
  type: FlightLogType;
};

export type RouteStat = {
  totalTime: number;
  count: number;
};

export type AverageTravelTime = {
  route: string;
  averageTime: number;
};
