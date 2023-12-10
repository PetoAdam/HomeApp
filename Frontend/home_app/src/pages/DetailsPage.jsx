import React, { useState, useEffect } from 'react';
import DataCard from '../components/DataCard';
import LineChartContainer from '../components/LineChartContainer';
import DeviceService from '../services/DeviceService';

const DetailsPage = () => {
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        // Use the DeviceService to fetch devices directly
        const devices = await DeviceService.listDevices();
        setDevices(devices);
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
    <div style={{ marginTop: '100px' }}>
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
