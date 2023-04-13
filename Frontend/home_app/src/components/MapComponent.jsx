import React, { useState, useEffect } from 'react';
import './MapComponentStyle.css';

import backgroundImg from '../images/background.png'

const MapComponent = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [newLocationId, setnewLocationId] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
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
        //setBackgroundImage(url);
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
    const x = parseInt(document.querySelector('.add-menu input[type="number"][placeholder="X"]').value, 10);
    const y = parseInt(document.querySelector('.add-menu input[type="number"][placeholder="Y"]').value, 10);
    const name = document.querySelector('.add-menu input[type="string"][placeholder="Name"]').value;
    const description = document.querySelector('.add-menu input[type="string"][placeholder="Description"]').value;

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
          const newDevice = { location: { x, y, Id: data.Id }, name, description };
          setDevices([...devices, newDevice]);
        })
        .catch(error => console.log(error));
    };

  addNewLocation();
    setMenuOpen(false);
  };

  // Move the map when the user drags it
  const handleMapDrag = event => {
    const startMouseX = event.clientX;
    const startMouseY = event.clientY;
    const startMapX = mapX;
    const startMapY = mapY;
  
    const handleMouseMove = event => {
      setMapX(startMapX + (event.clientX - startMouseX) / zoomLevel);
      setMapY(startMapY + (event.clientY - startMouseY) / zoomLevel);
    };
  
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const enableScroll = () => {
    document.body.style.overflow = '';
  };
  
  const disableScroll = () => {
    document.body.style.overflow = 'hidden';
  };  

  // Zoom the map when the user scrolls
  const handleMapScroll = event => {
    event.preventDefault();
    const newZoomLevel = zoomLevel - event.deltaY / 1000;
    setZoomLevel(Math.max(1, Math.min(newZoomLevel, 3)));
  };

  // Move the selected device when the user drags it
  const handleDeviceDrag = event => {
    const newDevice = { ...selectedDevice };
    newDevice.x += event.movementX / zoomLevel;
    newDevice.y += event.movementY / zoomLevel;
    setSelectedDevice(newDevice);
    // TODO: update location of the device in db
  };

  // Show the add menu when the user long presses
  const handleLongPress = event => {
    if(token){
      event.preventDefault();
      setMenuOpen(true);
      setMenuX(event.clientX);
      setMenuY(event.clientY);
    }else{
      // TODO: Implement something to handle when the user is not logged in. Also should handle errors when adding a new device if the user is unauthorized (not admin). 
    }
    
  };

  // Hide the add menu when the user clicks outside it
  const handleMenuClose = () => {
    setMenuOpen(false);
  };

  // Show details when the user clicks on a device
  const handleDeviceClick = object => {
    setSelectedDevice(object);
  };

  const handleIconClick = (index) => {
    setSelectedDevice(devices[index]);
    selectedDevice[index].isOpen = !selectedDevice[index].isOpen;
  };

  return (
    <div className="map-container" 
          onMouseDown={event => !selectedDevice && handleMapDrag(event)}
          onTouchStart={event => !selectedDevice && handleMapDrag(event.touches[0])}
          onTouchMove={event => !selectedDevice && handleMapDrag(event.touches[0])}
          onContextMenu={handleLongPress}
          onWheel={handleMapScroll}
          onMouseEnter={disableScroll}
          onMouseLeave={enableScroll}
          onMouseMove={event => selectedDevice && handleDeviceDrag(event)}
      >
      {backgroundImage && (
        <div
          className="map"
          
        >
        <img className='map-image' src={backgroundImage} style={{
          transform: `translate(${mapX / zoomLevel}px, ${mapY / zoomLevel}px)`,
          scale: `${100 * zoomLevel}%`
        }}>
        </img>

        {devices.map((device, index) => (
          <div
            key={device.name}
            className="device-icon"
            style={{
              position: 'absolute',
              transform: `translate(${(mapX / zoomLevel + devices[index].location.x)}px, ${(mapY / zoomLevel+ devices[index].location.y)}px)`,
            }}
            onClick={() => handleIconClick(index)}
            >
            <span className="device-name">{device.name}</span>
          </div>
        ))}

        {selectedDevice && (
          <div
            className="selected-object"
            style={{
              left: `${selectedDevice.location.x}px`,
              top: `${selectedDevice.location.y}px`,
            }}
          >
            <div className="object-details" onClick={() => setSelectedDevice(null)}>
              <p>Device Details:</p>
              <p>X: {selectedDevice.location.x}</p>
              <p>Y: {selectedDevice.location.y}</p>
            </div>
          </div>
        )}
        {menuOpen && (
          <div className="add-menu" style={{ left: menuX, top: menuY }} onClick={handleMenuClose}>
            <p>Add new device:</p>
            <input type="number" placeholder="X" />
            <input type="number" placeholder="Y" />
            <input type="string" placeholder="Name" />
            <input type="string" placeholder="Description" />
            <button onClick={handleDeviceAdd}>Add</button>
          </div>
        )}
        </div>
      )}
    </div>
  );
}

export default MapComponent;