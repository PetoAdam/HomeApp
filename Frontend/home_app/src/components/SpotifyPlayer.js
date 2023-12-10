import React, { useState, useEffect } from 'react';
import './SpotifyPlayerStyle.css';

import { FaPlay, FaPause, FaForward, FaBackward, FaVolumeUp } from "react-icons/fa";
import Loading from './Loading';


const SpotifyPlayer = () => {
  const playback_state = {
    isPlaying: false,
    volume: 0,
    time: 0,
    duration: 0,
    title: '',
    artist: '',
    album: '',
    albumImageUri: '',
  };

  const [currentTrack, setCurrentTrack] = useState(playback_state);
  const [queue, setQueue] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInteractingWithVolumeSlider, setIsInteractingWithVolumeSlider] = useState(false);

  
  const fetchCurrentPlaybackInfo = async () => {
    try {
      // Fetch current playback info
      const response = await fetch('https://homeapp.ddns.net/api/spotify/playback');
      const playbackInfo = await response.json();
      
      // Update currentTrack state with the fetched data
      setCurrentTrack(playbackInfo);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching current playback info:', error);
    }
  };

  const fetchQueue = async () => {
    try {
      // Fetch list of queue items
      const queueResponse = await fetch('/api/spotify/queue'); // Replace with your API endpoint
      const queueData = await queueResponse.json();

      // Update queue state with the fetched data
      setQueue(queueData.queue);
    } catch (error) {
      console.error('Error fetching queue:', error);
    }
  };
  

  const handlePlayPause = async () => {
    try {
      const playPauseEndpoint = `https://homeapp.ddns.net/api/spotify/${
        currentTrack.isPlaying ? 'pause' : 'play'
      }`;

      // Send a POST request to the play/pause endpoint
      const response = await fetch(playPauseEndpoint, { method: 'POST' });
      if (response.ok) {
        // Update the playback state based on the response
        setCurrentTrack((prevState) => ({
          ...prevState,
          isPlaying: !prevState.isPlaying,
        }));
        fetchCurrentPlaybackInfo();
      } else {
        console.error('Error toggling play/pause');
      }
    } catch (error) {
      console.error('Error toggling play/pause:', error);
    }
  };

  const handleSkip = async () => {
    try {
      const skipEndpoint = "https://homeapp.ddns.net/api/spotify/skip";
      // Update the currentTrack state with the new track information
      // Send a POST request to the play/pause endpoint
      const response = await fetch(skipEndpoint, { method: 'POST' });
      if (response.ok) {
        fetchCurrentPlaybackInfo();
        fetchQueue();
      } else {
      console.error('Error skipping track');
      }
    } catch (error) {
      console.error('Error skipping track:', error);
    }
  };

  const handlePrevious = async () => {
    try {
      const skipEndpoint = "https://homeapp.ddns.net/api/spotify/previous";
      // Update the currentTrack state with the new track information
      // Send a POST request to the play/pause endpoint
      const response = await fetch(skipEndpoint, { method: 'POST' });
      if (response.ok) {
        fetchCurrentPlaybackInfo();
        fetchQueue();
      } else {
      console.error('Error toggling previous track');
      }
    } catch (error) {
      console.error('Error toggling previous track:', error);
    }
  };

  const handleVolumeChange = async (newValue) => {
    try {
      // Update the volume in the currentTrack state
      setCurrentTrack((prevState) => ({
        ...prevState,
        volume: newValue,
      }));

      // Send a POST request to change the volume
      const response = await fetch('https://homeapp.ddns.net/api/spotify/volume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ volume: newValue }),
      });

      if (response.ok){
        fetchCurrentPlaybackInfo();
      } else {
        console.error('Error changing volume');
      }
    } catch (error) {
      console.error('Error changing volume:', error);
    }
  };

  const handleSearch = async () => {
    if(searchQuery == ""){
      return;
    }

    try {
      const response = await fetch(`https://homeapp.ddns.net/api/spotify/search?query=${searchQuery}`);
      const searchData = await response.json();
      setSearchResults(searchData.songs);
    } catch (error) {
      console.error('Error searching for tracks:', error);
    }
  };

  const handleSearchInputChange = (e) => {
    // First, update the search query using setSearchQuery
    setSearchQuery(e.target.value);
    handleSearch();
  };

  const addToQueue = async (track) => {
    try {
      const response = await fetch('https://homeapp.ddns.net/api/spotify/queue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ trackId: track.trackId }), // Adjust the payload as per your API
      });
  
      if (response.ok) {
        // Optionally, you can update the queue state to reflect the changes immediately.
        fetchQueue(); // Fetch the updated queue after adding to it.
      } else {
        console.error('Error adding to queue');
      }
    } catch (error) {
      console.error('Error adding to queue:', error);
    }
    setSearchQuery("");
  };

  useEffect(() => {
    const updatePlaybackProgress = () => {
      setCurrentTrack((prevState) => {
        if (prevState.isPlaying && prevState.time < prevState.duration) {
          // Increment playback time predictively every second
          const newTime = prevState.time + 1000;
          return { ...prevState, time: newTime };
        }
        return prevState;
      });
    };

    // Fetch current playback info every 5 seconds
    const fetchIntervalId = setInterval(() => {
      fetchCurrentPlaybackInfo();
    }, 3000);

    const queueFetchIntervalId = setInterval(() => {
      fetchQueue();
    }, 5000);

    const uiIntervalId = setInterval(() => {
      updatePlaybackProgress();
    }, 1000)

    fetchCurrentPlaybackInfo();
    fetchQueue();

    return () => {
      clearInterval(fetchIntervalId);
      clearInterval(queueFetchIntervalId);
      clearInterval(uiIntervalId);
    };

    
  }, []);

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="spotify-player">
      {/* Show loading screen while isLoading is true */}
      {isLoading ? (
        <Loading />
      ) : (
        // Render the player content once data is fetched
        <div>
          <div className="search-box">
            <input className="search-input"
              type="text"
              placeholder="Search for tracks"
              value={searchQuery}
              onChange={(e) => handleSearchInputChange(e)}
            />
          </div>
            {searchResults.length > 0 && searchQuery != "" && 
              <div className="search-results">
                {searchResults.map((track) => (
                    <div className="search-item" key={track.trackId} onClick={() => addToQueue(track)}>
                      <img src={track.albumImageUri} alt="Album Cover" />
                      <div className="track-title">{track.title}</div>
                      <div className="track-artist">{track.artist}</div>
                    </div>
                  ))
                }
              </div>
            }
          <div className="player-header">
            <div className="track-info">
              <img src={currentTrack.albumImageUri} alt="Album Cover" />
              <div className="track-details">
                <div className="track-title">{currentTrack.title}</div>
                <div className="track-artist">{currentTrack.artist}</div>
                <div className="track-album">{currentTrack.album}</div>
              </div>
            </div>
            <div>
              <div className="controls">
                {/* Previous button */}
                <button className="control-button prev-button" onClick={handlePrevious}>
                  <FaBackward />
                </button>
                {/* Play/Pause button */}
                <button className="control-button play-pause-button" onClick={handlePlayPause}>
                  {currentTrack.isPlaying ? (
                    <FaPause />
                  ) : (
                    <FaPlay />
                  )}
                </button>
                {/* Skip button */}
                <button className="control-button skip-button" onClick={handleSkip}>
                  <FaForward />
                </button>
              </div>
              <div className="volume-control">
                <FaVolumeUp className='volume-icon'/>
                <input
                  type="range"
                  className="volume-slider"
                  min="0"
                  max="100"
                  value={currentTrack.volume}
                  onChange={(e) => {
                    setCurrentTrack((prevState) => ({
                      ...prevState,
                      volume: parseInt(e.target.value),
                    }));
                    setIsInteractingWithVolumeSlider(true);
                  }}
                  onMouseUp={(e) => {
                    if (isInteractingWithVolumeSlider) {
                      handleVolumeChange(parseInt(e.target.value));
                      setIsInteractingWithVolumeSlider(false);
                    }
                  }}
                />
              </div>
            </div>
          </div>

          <div className="progress">
            <div className="progress-current">
              {formatTime(currentTrack.time)}
            </div>
            <input
              type="range"
              className="playback-slider"
              min="0"
              max={currentTrack.duration}
              value={currentTrack.time}
            />
            <div className="progress-duration">
              {formatTime(currentTrack.duration)}
            </div>
          </div>

          <div className="queue">
            {queue.map((queuedTrack) => (
              <div className="search-item" key={queuedTrack.track_id}>
                <img src={queuedTrack.albumImageUri} alt="Album Cover" />
                <div className="track-title">{queuedTrack.title}</div>
                <div className="track-artist">{queuedTrack.artist}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SpotifyPlayer;
