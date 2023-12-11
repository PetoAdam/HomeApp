import React, { useState, useEffect } from 'react';
import './MapComponentStyle.css';
import MapLabel from './MapLabel';
import LocationService from '../services/LocationService';
import DeviceService from '../services/DeviceService';

import backgroundImg from '../images/background.png'

const MapComponent = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [newLocationId, setNewLocationId] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [mapX, setMapX] = useState(0);
  const [mapY, setMapY] = useState(0);

  // TODO: Load background image from API endpoint on mount
  useEffect(() => {
    setBackgroundImage(backgroundImg);
  }, []);


  // Load devices from API endpoint on mount
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await DeviceService.listDevices();
        setDevices(response);
      } catch (error) {
        console.error('Error fetching devices:', error);
      }
    };

    fetchDevices();
  }, []);

  // Add a new device to the map
  const handleDeviceAdd = async () => {
    const x = parseInt(document.querySelector('.add-menu input[type="number"][placeholder="X"]').value, 10);
    const y = parseInt(document.querySelector('.add-menu input[type="number"][placeholder="Y"]').value, 10);
    const name = document.querySelector('.add-menu input[type="text"][placeholder="Name"]').value;
    const description = document.querySelector('.add-menu input[type="text"][placeholder="Description"]').value;

    try {
      // Send location first
      const newLocation = await LocationService.createLocation({ X: x, Y: y, Description: description });
      setNewLocationId(newLocation.Id);

      // Add new device
      const newDevice = await DeviceService.createDevice({
        location: { x, y, Id: newLocationId },
        name,
        description,
      });

      setDevices([...devices, newDevice]);
    } catch (error) {
      console.error('Error adding device:', error);
    }
  };

  // Drag map
  const handleMapDrag = (event) => {
    event.preventDefault();
    document.body.style.overflow = 'hidden';
    let startMouseX, startMouseY;

    if (event.type === 'mousedown') {
      startMouseX = event.clientX;
      startMouseY = event.clientY;
    } else if (event.type === 'touchstart') {
      startMouseX = event.changedTouches[0].clientX;
      startMouseY = event.changedTouches[0].clientY;
    }

    const startMapX = mapX;
    const startMapY = mapY;

    const handleMove = (event) => {
      let moveMouseX, moveMouseY;

      if (event.type === 'mousemove') {
        moveMouseX = event.clientX;
        moveMouseY = event.clientY;
      } else if (event.type === 'touchmove') {
        moveMouseX = event.changedTouches[0].clientX;
        moveMouseY = event.changedTouches[0].clientY;
      }

      setMapX(startMapX + (moveMouseX - startMouseX));
      setMapY(startMapY + (moveMouseY - startMouseY));
    };

    const handleEnd = () => {
      document.body.style.overflow = 'auto';
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleEnd);
    };

    if (event.type === 'mousedown' || event.type === 'touchstart') {
      document.addEventListener('mousemove', handleMove);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchmove', handleMove);
      document.addEventListener('touchend', handleEnd);
    }
  };

  // Function to check if the user is using an iOS device
  const isIOS = () => {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  };

  // Function to calculate the adjusted Y position
  const calculateAdjustedY = (device) => {
    if (isIOS()) {
      // For iOS, adjust the Y position differently
      return (
        (document.getElementById('map')?.offsetHeight / 100) * device.location.y
      );
    } else {
      // For other devices, use the previous calculation
      return (
        (document.getElementById('map')?.offsetHeight / 100) * device.location.y -
        document.getElementById('map')?.offsetHeight / 2
      );
    }
  };

  return (
    <div className="container">
      <div
        className="map-container"
        onMouseDown={(event) => !selectedDevice && handleMapDrag(event)}
        onTouchStart={(event) => !selectedDevice && handleMapDrag(event)}
        onTouchMove={(event) => !selectedDevice && handleMapDrag(event.touches[0])}
      >
        {backgroundImage && (
          <div
            className="map"
            id="map"
            style={{
              transform: `translate(${mapX}px, ${mapY}px)`,
              scale: `100%`,
            }}
          >
            <img className="map-image" src={backgroundImage} alt="background" />

            {devices.map((device, index) => (
              <div
              style={{
                transform: `translate(${(document.getElementById('map')?.offsetWidth / 100) *
                  device.location.x}px, ${calculateAdjustedY(device)}px)`,
                position: `absolute`,
                }}
                key={device.name}
              >
                <MapLabel device={device} className="device-marker" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MapComponent;
