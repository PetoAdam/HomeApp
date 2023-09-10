import React, { useState, useEffect } from 'react';
import { FaBluetooth, FaTimes, FaVolumeDown } from 'react-icons/fa';
import Loading from './Loading';
import './SpeakerComponentStyle.css';

const SpeakerComponent = () => {
    const [connectedSpeakers, setConnectedSpeakers] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchedDevices, setSearchedDevices] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState(null);
    const scrollDelay = 3000; // 3000 milliseconds = 3 seconds

    const listConnectedSpeakers = async () => {
        try {
            // Fetch list of connected Bluetooth speakers
            const response = await fetch('https://homeapp.ddns.net/api/speakers/connected'); // Replace with your API endpoint
            const speakersData = await response.json();
            setConnectedSpeakers(speakersData);
        } catch (error) {
            console.error('Error fetching connected speakers:', error);
        }
    };

    const searchBluetoothDevices = async () => {
        setIsSearching(true);
        try {
            // Fetch list of available Bluetooth devices
            const response = await fetch('https://homeapp.ddns.net/api/speakers/pairable'); // Replace with your API endpoint
            const devicesData = await response.json();
            setSearchedDevices(devicesData);
        } catch (error) {
            console.error('Error searching Bluetooth devices:', error);
        } finally {
            setIsSearching(false);
        }
    };

    const connectToDevice = async (deviceAddress) => {
        try {
            // Send a POST request to connect to the selected Bluetooth device
            const response = await fetch('https://homeapp.ddns.net/api/speakers/connect', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ deviceAddress }),
            });

            if (response.ok) {
                // Device connected successfully, update the UI or perform any necessary actions
                setSelectedDevice(null);
                listConnectedSpeakers();
            } else {
                console.error('Error connecting to device');
            }
        } catch (error) {
            console.error('Error connecting to device:', error);
        }
    };

    const disconnectDevice = async (deviceAddress) => {
        try {
            // Send a POST request to disconnect from the selected Bluetooth device
            const response = await fetch('https://homeapp.ddns.net/api/speakers/disconnect', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ deviceAddress }),
            });

            if (response.ok) {
                // Device disconnected successfully, update the UI or perform any necessary actions
                listConnectedSpeakers();
            } else {
                console.error('Error disconnecting from device');
            }
        } catch (error) {
            console.error('Error disconnecting from device:', error);
        }
    };

    useEffect(() => {
        listConnectedSpeakers();
        // Periodically check for connected speakers every 3 seconds
        const intervalId = setInterval(() => {
            listConnectedSpeakers();
        }, 3000);

        return () => {
            // Clear the interval when the component unmounts
            clearInterval(intervalId);
        };
    }, []);

    useEffect(() => {
        let scrolling = false;
    
        const handleScroll = () => {
            if (!scrolling && window.scrollY < 65) {
                scrolling = true; // Set scrolling to true to prevent multiple animations
                // User scrolled above 65 pixels, scroll back down with a delay
                setTimeout(() => {
                    if(window.scrollY < 65){
                        window.scrollTo({ top: 65, behavior: 'smooth' });
                    }
                    setTimeout(() => {
                        // Wait for the scrollback to finish
                        scrolling = false; // Reset scrolling to false after the animation
                    }, 300);
                }, scrollDelay);
            }
        };
    
        // Attach the scroll listener when the component mounts
        window.addEventListener('scroll', handleScroll);
    
        // Run it for the first time
        handleScroll();
    
        return () => {
            // Remove the scroll listener when the component unmounts
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const renderNoSpeakers = () => (
        <div className="no-speakers">
            {isSearching ? (
                <div className="loading">
                    <p>Searching for Bluetooth devices...</p>
                    <Loading />
                </div>
            ) : (
                <>
                    {connectedSpeakers.length === 0 && searchedDevices.length > 0 && (
                        <div className="search-results">
                            <h3>Available Devices</h3>
                            <ul>
                                {searchedDevices.map((device) => (
                                    <li key={device.address} onClick={() => connectToDevice(device.address)}>
                                        <span>{device.name}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <p>No Bluetooth speakers connected.</p>
                    <button className="search-button" onClick={searchBluetoothDevices}>
                        <FaBluetooth /> Search for Devices
                    </button>
                </>
            )}
        </div>
    );

    const renderConnectingScreen = () => (
        <div className="no-speakers">
            <p>Connecting to {selectedDevice?.name}...</p>
            <Loading />
        </div>
    );

    return (
        <div className="speaker-component">
            <div className="header">
                {connectedSpeakers.length > 0 ? (
                    // Display a small connected speaker card
                    <div className="connected-speaker-card">
                        <FaVolumeDown />
                        <span>{connectedSpeakers[0]?.name}</span>
                        <button
                            className="disconnect-button"
                            onClick={() => disconnectDevice(connectedSpeakers[0]?.address)}
                        >
                            <FaTimes /> Disconnect
                        </button>
                    </div>
                ) : (
                    // Show the appropriate content based on the UI state
                    selectedDevice ? (
                        // Display a connecting screen
                        renderConnectingScreen()
                    ) : (
                        // Show either connected speakers or a search button
                        renderNoSpeakers()
                    )
                )}
            </div>

            
        </div>
    );
};

export default SpeakerComponent;

