import React from 'react';
import DataCard from '../components/DataCard';
import LineChartContainer from '../components/LineChartContainer';

const DetailsPage = () => {
  return (
    <div style={{marginTop: "100px"}}>
      <DataCard className="data-card" />
      <LineChartContainer />
    </div>
  );
};

export default DetailsPage;
