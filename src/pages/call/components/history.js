import { History } from "lucide-react";
import React from "react";

function HistoryList({ callHistory }) {
  console.log("callHistory", callHistory);
  return (
    <div className="call-history-container">
      {callHistory.length === 0 ? (
        <div className="empty-history">
          <History className="empty-icon" />
          <p>No call history yet</p>
        </div>
      ) : (
        callHistory.map((call) => (
          <div key={call.sid} className="call-card">
            <div className="call-info">
              <h3>{call.direction === "inbound" ? call.from : call.to}</h3>
              <p className="meta">
                {call.direction === "inbound" ? "Incoming" : "Outgoing"} •{" "}
                {call.status}
              </p>
              <p className="date">
                {new Date(call.startTime).toLocaleString()}
              </p>
            </div>
            <div className="call-duration">
              <p>{call.duration ? `${call.duration}s` : "No answer"}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default HistoryList;
