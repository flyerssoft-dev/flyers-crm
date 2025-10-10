import React from "react";
import { Phone, FileText, Edit3 } from "lucide-react";
import "./history-timeline.scss";

const History = ({ data }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const recordDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );

    if (recordDate.getTime() === today.getTime()) {
      return "TODAY";
    } else if (recordDate.getTime() === yesterday.getTime()) {
      return "YESTERDAY";
    } else {
      return date
        .toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
        .toUpperCase();
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getActivityIcon = (type) => {
    switch (type.toLowerCase()) {
      case "outbound":
      case "inbound":
        return <Phone className="history-item__icon" />;
      case "note":
        return <FileText className="history-item__icon" />;
      case "update":
        return <Edit3 className="history-item__icon" />;
      default:
        return <Phone className="history-item__icon" />;
    }
  };

  const groupDataByDate = (records) => {
    const groups = {};

    records.forEach((record) => {
      const dateKey = formatDate(record.createdAt);
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(record);
    });

    return groups;
  };

  const groupedData = groupDataByDate(data);

  return (
    <div className="history">
      <div className="history__timeline">
        {Object.entries(groupedData).map(([dateGroup, records]) => (
          <div key={dateGroup} className="history__date-group">
            <div className="history__date-header">
              <div className="history__date-indicator"></div>
              <span className="history__date-text">{dateGroup}</span>
            </div>

            <div className="history__items">
              {records.map((record) => (
                <div key={record.id} className="history-item">
                  <div className="history-item__time">
                    {formatTime(record.createdAt)}
                  </div>
                  <div className="history-item__content">
                    <div className="history-item__icon-wrapper">
                      {getActivityIcon(record.type)}
                    </div>
                    <div className="history-item__details">
                      {record?.status ? (
                        <div className="history-item__title">
                          Status updated by <strong>{record.createrName}</strong>
                        </div>
                      ) : (
                        <div className="history-item__title">
                          Call added by <strong>{record.createrName}</strong>
                        </div>
                      )}
                      <div className="history-item__description">
                        {record.description}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;
