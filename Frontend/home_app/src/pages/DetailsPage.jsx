import React from 'react';
import TemperatureCard from '../components/TemperatureCard';
import LineChart from '../components/LineChart';
//import MapComponent from '../components/MapComponent';

const DetailsPage = () => {
  return (
    <div>
      <TemperatureCard className="temperature-card" />
      <LineChart />
    </div>
  );
};

export default DetailsPage;
