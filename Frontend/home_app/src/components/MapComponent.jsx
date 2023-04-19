import React, { useState, useEffect } from 'react';
import './MapComponentStyle.css';

import backgroundImg from '../images/background.png'

const MapComponent = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [newLocationId, setnewLocationId] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [mapX, setMapX] = useState(0);
  const [mapY, setMapY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuX, setMenuX] = useState(0);
  const [menuY, setMenuY] = useState(0);

  // Load background image from API endpoint on mount
  useEffect(() => {
    fetch('https://homeapp.ddns.net/api/devices/1')
      .then(response => response.blob())
      .then(image => {
        const url = URL.createObjectURL(image);
        setBackgroundImage(backgroundImg);
      });
  }, []);

  // Load devices from API endpoint on mount
  useEffect(() => {
    fetch('https://homeapp.ddns.net/api/devices')
      .then(response => response.json())
      .then(data => {
        setDevices(data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);


  // Add a new device to the map
  const handleDeviceAdd = () => {
    // Send location first
    const addNewLocation = () => {
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ X: x, Y: y, Description: description })
      };
      fetch('https://homeapp.ddns.net/api/locations', requestOptions)
        .then(response => response.json())
        .then(data => {
          setnewLocationId(data.Id);
        })
        .catch(error => console.log(error));
    };

    const x = parseInt(document.querySelector('.add-menu input[type="number"][placeholder="X"]').value, 10);
    const y = parseInt(document.querySelector('.add-menu input[type="number"][placeholder="Y"]').value, 10);
    const name = document.querySelector('.add-menu input[type="text"][placeholder="Name"]').value;
    const description = document.querySelector('.add-menu input[type="text"][placeholder="Description"]').value;
    addNewLocation();
    const newDevice = { location: { x, y, Id: newLocationId }, name, description };
    setDevices([...devices, newDevice]);
    setMenuOpen(false);
  };

  // Drag map
  const handleMapDrag = event => {
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
  
    const handleMove = event => {
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
  

  // Open the context menu for a device
  const handleDeviceContextMenu = (event, device) => {
    event.preventDefault();
    setSelectedDevice(device);
    setMenuOpen(true);
    setMenuX(event.clientX);
    setMenuY(event.clientY);
  };

  // Close the context menu
  const handleMenuClose = () => {
    setSelectedDevice(null);
    setMenuOpen(false);
  };

  return (
    <div className="container">
    <div className="map-container"
      onMouseDown={event => !selectedDevice && handleMapDrag(event)}
      onTouchStart={event => !selectedDevice && handleMapDrag(event)}
      onTouchMove={event => !selectedDevice && handleMapDrag(event.touches[0])}
    >
      {backgroundImage && (
        <div
          className="map"
          id="map"
          style={{
            transform: `translate(${mapX}px, ${mapY}px)`,
            scale: `100%`
          }}
        >
          <img className='map-image' src={backgroundImage} />

          {devices.map((device, index) => (
            <div
              key={device.name}
              className="device-marker"
              style={{
                transform: `translate(${(( document.getElementById("map").offsetWidth / 100 * devices[index].location.x))}px, ${(( document.getElementById("map").offsetHeight / 100 * devices[index].location.y - document.getElementById("map").offsetHeight/2))}px)`
              }}
              onContextMenu={event => handleDeviceContextMenu(event, device)}
            >
              {device.name}
            </div>
          ))
          }
          {
            menuOpen && (
              <div className="context-menu" style={{ 
                transform: `translate(${(( document.getElementById("map").offsetWidth / 100 * selectedDevice.location.x + 20))}px, ${(( document.getElementById("map").offsetHeight / 100 * selectedDevice.location.y - document.getElementById("map").offsetHeight/2 -20))}px)`
                }}>
                <div>{selectedDevice.name}</div>
                <div>{selectedDevice.description}</div>
                <button onClick={handleMenuClose}>Close</button>
              </div >
            )}
        </div >
      )
      } </div>
      </div>
  );
}

export default MapComponent;