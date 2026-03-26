import React from 'react';
import { ListGroup } from 'react-bootstrap';
import { FaCheckCircle, FaClock, FaBullseye, FaTasks, FaUsers } from 'react-icons/fa';

const RecentActivity = ({ activities }) => {
  const getIcon = (type) => {
    switch(type) {
      case 'goal': return <FaBullseye color="#6c757d" />;
      case 'task': return <FaTasks color="#6c757d" />;
      case 'relationship': return <FaUsers color="#6c757d" />;
      default: return <FaCheckCircle color="#6c757d" />;
    }
  };

  const getStatusColor = (status) => {
    if (status === 'completed') return '#10b981';
    if (status === 'Contacted recently') return '#10b981';
    if (status === 'No recent contact') return '#ef4444';
    return '#f59e0b';
  };

  if (activities.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-muted" style={{ color: '#6c757d' }}>No recent activity</p>
      </div>
    );
  }

  return (
    <ListGroup variant="flush">
      {activities.map((activity, idx) => (
        <ListGroup.Item key={idx} className="d-flex align-items-center gap-3 border-0 px-0">
          {getIcon(activity.type)}
          <div className="flex-grow-1">
            <div className="d-flex justify-content-between align-items-center">
              <strong style={{ color: '#495057' }}>{activity.title}</strong>
              <small style={{ color: '#6c757d' }}>{activity.time}</small>
            </div>
            <div className="d-flex align-items-center gap-2 mt-1">
              <span className="badge bg-light text-dark text-capitalize" style={{ backgroundColor: '#f5f5f4', color: '#495057' }}>
                {activity.type}
              </span>
              {activity.status && (
                <span style={{ color: getStatusColor(activity.status) }}>
                  <FaClock className="me-1" size={10} />
                  {activity.status}
                </span>
              )}
            </div>
          </div>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default RecentActivity;