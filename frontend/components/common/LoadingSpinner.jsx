import React from 'react';
import { Spinner } from 'react-bootstrap';

const LoadingSpinner = ({ size = 'lg', message = 'Loading...' }) => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '300px' 
    }}>
      <Spinner animation="border" variant="primary" size={size} />
      <p style={{ marginTop: '15px', color: '#6c757d' }}>{message}</p>
    </div>
  );
};

export default LoadingSpinner;