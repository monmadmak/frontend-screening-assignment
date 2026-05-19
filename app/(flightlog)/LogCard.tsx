import type { CSSProperties } from "react";
import LogItem from "./LogItem";
import type { FlightLog } from "./flightlog.types";

type LogCardProps = {
  data: FlightLog[];
  style?: CSSProperties;
};

function LogCard(props: LogCardProps) {
  const { data, style } = props;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        rowGap: 4,
        ...style,
      }}
    >
      <div
        style={{
          display: "flex",
          marginBottom: 4,
          fontSize: 16,
          fontWeight: "bold",
        }}
      >
        <span style={{ flex: 1 }}>Passenger Name</span>
        <span style={{ flex: 1 }}>Airport</span>
        <span style={{ flex: 1 }}>Timestamp</span>
        <span style={{ flex: 1 }}>Type</span>
      </div>
      {data.map((item, index) => (
        <LogItem
          key={`${item.passengerName}-${item.airport}-${item.timestamp}-${item.type}-${index}`}
          item={item}
        ></LogItem>
      ))}
    </div>
  );
}

export default LogCard;
