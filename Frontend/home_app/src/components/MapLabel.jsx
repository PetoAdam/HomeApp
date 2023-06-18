import React, { useState, useEffect } from 'react';
import './MapLabelStyle.css';

const MapLabel = ({device}) => {

    const [temperature, setTemperature] = useState(0);
    const [humidity, setHumidity] = useState(0);
    const [timestamp, setTimestamp] = useState('');

    const [menuOpen, setMenuOpen] = useState(false);

    // Open or close the context menu for a device
    const handleMenuOpen = (event) => {
        event.preventDefault();
        setMenuOpen(prevState => !prevState);
    };

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch('https://homeapp.ddns.net/api/measurements/current?deviceId=' + device.id);
            const json = await res.json();
            setTemperature(json.temperature);
            setHumidity(json.humidity);
            setTimestamp(json.timestamp);
        }

        fetchData(); // load data immediately

        const interval = setInterval(() => {
            fetchData();
        }, 60000); // update every minute

        return () => clearInterval(interval);
    }, []);

    // Format the timestamp to be more human-readable
    const formattedName = device.name;
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const formattedTimestamp = new Date(timestamp).toLocaleString();
    const formattedTemperature = "Temperature: " + temperature.toLocaleString() + "°C";
    const formattedHumidity = "Humidity: " + humidity.toLocaleString() + "%";

    return (
        <div className="map-label" onClick={handleMenuOpen}>
            <div className="data"><b>{formattedName}</b></div>
            {
            menuOpen && (
                <div>
                    <div className="data">{formattedTemperature}</div>
                    <div className="data">{formattedHumidity}</div>
                    <div className="timestamp">{formattedTimestamp}</div>
                </div>
            )}
        </div>
    );
};

export default MapLabel;