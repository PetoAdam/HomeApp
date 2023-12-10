import React, { useState, useEffect } from 'react';
import LineChart from './LineChart';
import MeasurementService from '../services/MeasurementService';

const LineChartContainer = ({ deviceId }) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await MeasurementService.listDayMeasurements(deviceId);
        setData(response);
      } catch (err) {
        console.error('Error fetching day measurements:', err);
        setError(err);
      }
    };
    fetchData();
  }, [deviceId]);

  if (error !== null) {
    return <div>An error occurred...</div>;
  }

  const processData = () => {
    const datasets = {};

    data.forEach((item) => {
      const parsedData = JSON.parse(item.data);
      const timestamps = Object.keys(parsedData);

      timestamps.forEach((timestamp) => {
        if (!datasets[timestamp]) {
          datasets[timestamp] = [];
        }
        datasets[timestamp].push({
          x: new Date(item.timestamp).toISOString(),
          y: parsedData[timestamp],
        });
      });
    });

    return Object.keys(datasets).map((timestamp) => (
      <LineChart key={timestamp} label={timestamp} data={datasets[timestamp]} />
    ));
  };

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      {processData().map((chart, index) => (
        <div key={index} style={{ flexBasis: '50%', maxWidth: '600px', padding: '10px' }}>
          {chart}
        </div>
      ))}
    </div>
  );
};

export default LineChartContainer;
