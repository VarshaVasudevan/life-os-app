import React from 'react';
import { Button } from 'react-bootstrap';

const EmptyState = ({ title, message, icon, actionText, onAction }) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon || '📭'}</div>
      <h4>{title || 'Nothing here yet'}</h4>
      <p style={{ color: '#6c757d', marginBottom: '20px' }}>
        {message || 'Start by adding your first item'}
      </p>
      {actionText && onAction && (
        <Button variant="primary" onClick={onAction} className="btn-gradient">
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;