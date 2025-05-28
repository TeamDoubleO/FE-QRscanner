import React from 'react';
import KEYWEloading from '../../assets/images/KEYWE-loading.png';
import './css/Loading.css';

const Loading: React.FC = () => {
  return (
    <div className="loading-container">
      <img
        src={KEYWEloading}
        alt="Loading"
        className="loading-image spinning"
      />
    </div>
  );
};

export default Loading;
