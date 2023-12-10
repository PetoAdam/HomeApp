import React, { useState, useEffect } from 'react';
import SpotifyPlayer from '../components/SpotifyPlayer';
import SpeakerComponent from '../components/SpeakerComponent';
import SpeakerService from '../services/SpeakerService';

const SpotifyPage = () => {
  const [isSpotifyVisible, setIsSpotifyVisible] = useState(false);

  useEffect(() => {
    const checkConnectedSpeakers = async () => {
      try {
        // Fetch list of connected Bluetooth speakers using SpeakerService
        const response = await SpeakerService.listConnectedSpeakers();
        const speakersData = response;
        setIsSpotifyVisible(speakersData.length > 0);
      } catch (error) {
        console.error('Error fetching connected speakers:', error);
      }
    };

    // Initial check
    checkConnectedSpeakers();

    // Set up an interval to check every 3 seconds
    const intervalId = setInterval(checkConnectedSpeakers, 3000);

    return () => {
      // Clear the interval when the component unmounts
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div>
      <SpeakerComponent />
      {isSpotifyVisible && <SpotifyPlayer />}
    </div>
  );
};

export default SpotifyPage;
