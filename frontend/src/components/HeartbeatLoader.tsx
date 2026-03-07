// components/HeartbeatLoader.tsx
import React from 'react';
import './HeartbeatLoader.css'; // Make sure to include styles

const HeartbeatLoader: React.FC = () => {
  return (
    <div className="heartbeat-loader-container">
      <div className="heart"></div>
    </div>
  );
};

export default HeartbeatLoader;
