import React from 'react';
import './TemperatureCardStyle.css';

const TemperatureCard = ({ temperature, timestamp }) => {
  // Format the timestamp to be more human-readable
  const formattedTimestamp = "Latest measurement: " + new Date(timestamp).toLocaleString();
  const formattedTemperature = "Temperature: " + temperature.toLocaleString() + "°C";

  return (
    <div className="temperature-card">
      <div className="temperature">{formattedTemperature}</div>
      <div className="timestamp">{formattedTimestamp}</div>
    </div>
  );
};

export default TemperatureCard;

