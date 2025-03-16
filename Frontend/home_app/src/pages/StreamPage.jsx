import React from 'react';

class StreamPage extends React.Component {
  render() {
    // Replace streamUrl with the actual IP address or hostname of your ESP32 camera, make sure that NGINX is configured properly if necessary.
    const streamUrl = 'https://homenavi.org/cam';

    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          maxHeight: '100vh' // Limit the height to the viewport height
        }}
      >
        <img
          src={streamUrl}
          alt="Camera Stream"
          style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
        />
      </div>
    );
  }
}

export default StreamPage;
