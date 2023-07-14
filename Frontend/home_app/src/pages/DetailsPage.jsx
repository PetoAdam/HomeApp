import React, { useState, useEffect } from 'react';
import DataCard from '../components/DataCard';
import LineChartContainer from '../components/LineChartContainer';

const DetailsPage = () => {
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const res = await fetch('https://homeapp.ddns.net/api/devices');
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        const json = await res.json();
        setDevices(json);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDevices();
  }, []);

  const handleCardClick = (deviceId) => {
    setSelectedDevice((prevSelectedDevice) =>
      prevSelectedDevice === deviceId ? null : deviceId
    );
  };

  return (
    <div style={{ marginTop: "100px" }}>
      {devices.map((device) => (
        <React.Fragment key={device.id}>
          <DataCard
            device={device}
            onClick={() => handleCardClick(device.id)}
            isActive={selectedDevice === device.id}
          />
          {selectedDevice === device.id && (
            <LineChartContainer deviceId={selectedDevice} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default DetailsPage;
