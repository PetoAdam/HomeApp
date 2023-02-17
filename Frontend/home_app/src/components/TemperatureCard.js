import React, { useState, useEffect } from 'react';
import './TemperatureCardStyle.css';

const TemperatureCard = () => {
    const [temperature, setTemperature] = useState(0);
    const [timestamp, setTimestamp] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch('https://homeapp.ddns.net/api/temperatures/current');
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

