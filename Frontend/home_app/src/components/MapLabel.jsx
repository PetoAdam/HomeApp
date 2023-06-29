import React, { useState, useEffect } from 'react';
import './MapLabelStyle.css';

const MapLabel = ({ device }) => {
  const [data, setData] = useState({});
  const [timestamp, setTimestamp] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuOpen = (event) => {
    event.preventDefault();
    setMenuOpen((prevState) => !prevState);
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(
        `https://homeapp.ddns.net/api/measurements/current?deviceId=${device.id}`
      );
      const json = await res.json();
      setData(JSON.parse(json.data));
      setTimestamp(json.timestamp);
    };

    fetchData(); // load data immediately

    const interval = setInterval(() => {
      fetchData();
    }, 60000); // update every minute

    return () => clearInterval(interval);
  }, [device.id]);

  const formattedName = device.name;
  const formattedTimestamp = new Date(timestamp).toLocaleString();

  const renderDataRows = () => {
    if (Object.keys(data).length === 0) {
      return null; // Render nothing if data is empty
    }

    const formatValue = (key, value) => {
      switch (key) {
        case 'humidity':
        case 'battery':
        case 'linkquality':
          return value + '%';
        case 'temperature':
          return value + '°C';
        case 'voltage':
          return value + 'mV';
        default:
          return value;
      }
    };

    const capitalizeFirstLetter = (str) => {
      return str.charAt(0).toUpperCase() + str.slice(1);
    };

    return Object.keys(data).map((key) => (
      <div key={key} className="data-row">
        <span className="data-key">{capitalizeFirstLetter(key)}: </span>
        <span className="data-value">{formatValue(key, data[key])}</span>
      </div>
    ));
  };

  return (
    <div className="map-label" onClick={handleMenuOpen}>
      <div className="data">
        <b>{formattedName}</b>
      </div>
      {menuOpen && (
        <div>
          {renderDataRows()}
          <div className="timestamp">{formattedTimestamp}</div>
        </div>
      )}
    </div>
  );
};

export default MapLabel;
