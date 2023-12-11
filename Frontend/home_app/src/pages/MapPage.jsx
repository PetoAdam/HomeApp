import React from 'react';
import MapComponent from '../components/MapComponent';

const MapPage = () => {
  return (
    <div style={{
      position: `fixed`,
      left:`50%`,
      top:`50%`,
      transform: `translate(-50%, -50%)`,
    }}>
      <MapComponent />
    </div>
  );
};

export default MapPage;