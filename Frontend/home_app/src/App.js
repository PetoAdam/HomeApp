import React, { useState, useEffect } from 'react';
import TemperatureCard from './components/TemperatureCard';
import LineChart from './components/LineChart';
import { fetch } from 'whatwg-fetch';

const App = () => {
  const [temperature, setTemperature] = useState(0);
  const [timestamp, setTimestamp] = useState('');
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('http://89.133.35.34:5001/api/temperatures/current');
      const json = await res.json();
      setTemperature(json.value);
      setTimestamp(json.timestamp);
    }
  
    fetchData(); // load data immediately
  
    const interval = setInterval(() => {
      fetchData();
    }, 60000); // update every minute
  
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('http://89.133.35.34:5001/api/temperatures/day');
      const json = await res.json();
      setData(json);
    }

    fetchData();
  }, []);

  return (
    <div>
      <TemperatureCard temperature={temperature} timestamp={timestamp} />
      <LineChart data={data} />
    </div>
  );
};

export default App;
