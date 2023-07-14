import React, { useState, useEffect } from 'react';
import './DataCardStyle.css';

const DataCard = ({ device, onClick, isActive }) => {
    const [data, setData] = useState('');
    const [timestamp, setTimestamp] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(`https://homeapp.ddns.net/api/measurements/current?deviceId=${device.id}`);
            const json = await res.json();
            setData(JSON.parse(json.data));
            setTimestamp(json.timestamp);
        };

        fetchData(); // load data immediately

        const interval = setInterval(() => {
            fetchData();
        }, 60000); // update every minute

        return () => clearInterval(interval);
    }, []);

    // Format the timestamp to be more human-readable
    const formattedTimestamp = "Latest measurement: " + new Date(timestamp).toLocaleString();

    const renderDataRows = () => {
        if (data === '') {
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
            <span className="data-key">{capitalizeFirstLetter(key)}:  </span>
            <span className="data-value">{formatValue(key, data[key])}</span>
          </div>
        ));
      };

    return (
        <div 
          className={`data-card ${isActive ? 'active' : ''}`}
          onClick={onClick}
          >
            <div><b>{device.name}</b></div>
            {renderDataRows()}
            <div className="timestamp">{formattedTimestamp}</div>
        </div>
    );
};

export default DataCard;
