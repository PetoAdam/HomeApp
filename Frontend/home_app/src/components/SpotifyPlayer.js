import React, { useState, useEffect } from 'react';
import './SpotifyPlayerStyle.css';
import { FaPlay, FaPause, FaForward, FaBackward, FaVolumeUp } from 'react-icons/fa';
import Loading from './Loading';
import SpotifyService from '../services/SpotifyService';

const SpotifyPlayer = () => {
  const [currentTrack, setCurrentTrack] = useState({
    isPlaying: false,
    volume: 0,
    time: 0,
    duration: 0,
    title: '',
    artist: '',
    album: '',
    albumImageUri: '',
  });

  const [queue, setQueue] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInteractingWithVolumeSlider, setIsInteractingWithVolumeSlider] = useState(false);

  const fetchCurrentPlaybackInfo = async () => {
    try {
      const playbackInfo = await SpotifyService.getCurrentPlaybackInfo();
      setCurrentTrack(playbackInfo);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching current playback info:', error);
    }
  };

  const fetchQueue = async () => {
    try {
      const queueData = await SpotifyService.listQueue();
      setQueue(queueData.queue);
    } catch (error) {
      console.error('Error fetching queue:', error);
    }
  };

  const handlePlayPause = async () => {
    try {

      if (currentTrack.isPlaying){
        await SpotifyService.pausePlayback();
      } else {
        await SpotifyService.continuePlayback();
      }
      // Update the playback state based on the response
      setCurrentTrack((prevState) => ({
        ...prevState,
        isPlaying: !prevState.isPlaying,
      }));
      fetchCurrentPlaybackInfo();
    } catch (error) {
      console.error('Error toggling play/pause:', error);
    }
  };

  const handleSkip = async () => {
    try {
      await SpotifyService.skipSong();
      fetchCurrentPlaybackInfo();
      fetchQueue();
    } catch (error) {
      console.error('Error skipping track:', error);
    }
  };

  const handlePrevious = async () => {
    try {
      await SpotifyService.playPreviousSong();
      fetchCurrentPlaybackInfo();
      fetchQueue();
    } catch (error) {
      console.error('Error toggling previous track:', error);
    }
  };

  const handleVolumeChange = async (newValue) => {
    try {
      setCurrentTrack((prevState) => ({ ...prevState, volume: newValue }));
      await SpotifyService.changeVolume({ volume: newValue });
      fetchCurrentPlaybackInfo();
    } catch (error) {
      console.error('Error changing volume:', error);
    }
  };

  const handleSearch = async () => {
    if (searchQuery === '') {
      return;
    }

    try {
      const searchData = await SpotifyService.searchSongs(searchQuery);
      setSearchResults(searchData.songs);
    } catch (error) {
      console.error('Error searching for tracks:', error);
    }
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
    handleSearch();
  };

  const addToQueue = async (track) => {
    try {
      await SpotifyService.addToQueue({ trackId: track.trackId });
      fetchQueue();
    } catch (error) {
      console.error('Error adding to queue:', error);
    }
    setSearchQuery('');
  };

  useEffect(() => {
    const updatePlaybackProgress = () => {
      setCurrentTrack((prevState) => {
        if (prevState.isPlaying && prevState.time < prevState.duration) {
          const newTime = prevState.time + 1000;
          return { ...prevState, time: newTime };
        }
        return prevState;
      });
    };

    const fetchIntervalId = setInterval(() => {
      fetchCurrentPlaybackInfo();
    }, 3000);

    const queueFetchIntervalId = setInterval(() => {
      fetchQueue();
    }, 5000);

    const uiIntervalId = setInterval(() => {
      updatePlaybackProgress();
    }, 1000);

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
      {isLoading ? (
        <Loading />
      ) : (
        <div>
          <div className="search-box">
            <input
              className="search-input"
              type="text"
              placeholder="Search for tracks"
              value={searchQuery}
              onChange={(e) => handleSearchInputChange(e)}
            />
          </div>
          {searchResults.length > 0 && searchQuery !== '' && (
            <div className="search-results">
              {searchResults.map((track) => (
                <div className="search-item" key={track.trackId} onClick={() => addToQueue(track)}>
                  <img src={track.albumImageUri} alt="Album Cover" />
                  <div className="track-title">{track.title}</div>
                  <div className="track-artist">{track.artist}</div>
                </div>
              ))}
            </div>
          )}
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
                <button className="control-button prev-button" onClick={handlePrevious}>
                  <FaBackward />
                </button>
                <button className="control-button play-pause-button" onClick={handlePlayPause}>
                  {currentTrack.isPlaying ? <FaPause /> : <FaPlay />}
                </button>
                <button className="control-button skip-button" onClick={handleSkip}>
                  <FaForward />
                </button>
              </div>
              <div className="volume-control">
                <FaVolumeUp className="volume-icon" />
                <input
                  type="range"
                  className="volume-slider"
                  min="0"
                  max="100"
                  value={currentTrack.volume}
                  onChange={(e) => {
                    setCurrentTrack((prevState) => ({ ...prevState, volume: parseInt(e.target.value) }));
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
            <div className="progress-current">{formatTime(currentTrack.time)}</div>
            <input
              type="range"
              className="playback-slider"
              min="0"
              max={currentTrack.duration}
              value={currentTrack.time}
            />
            <div className="progress-duration">{formatTime(currentTrack.duration)}</div>
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
