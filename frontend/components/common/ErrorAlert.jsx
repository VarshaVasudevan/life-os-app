import React from 'react';
import { Alert } from 'react-bootstrap';

const ErrorAlert = ({ message, onClose }) => {
  if (!message) return null;
  
  return (
    <Alert variant="danger" onClose={onClose} dismissible className="fade-in">
      <Alert.Heading>Oops! Something went wrong</Alert.Heading>
      <p>{message}</p>
    </Alert>
  );
};

export default ErrorAlert;