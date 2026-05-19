import type { FlightLog } from "./flightlog.types";

type LogItemProps = {
  item: FlightLog;
};

function LogItem(props: LogItemProps) {
  const { item } = props;
  return (
    <div style={{ display: "flex" }}>
      <span style={{ flex: 1 }}>{item.passengerName}</span>
      <span style={{ flex: 1 }}>{item.airport}</span>
      <span style={{ flex: 1 }}>{item.timestamp}</span>
      <span style={{ flex: 1 }}>
        {item.type === "departure" ? "Departure" : "Arrival"}
      </span>
    </div>
  );
}

export default LogItem;
