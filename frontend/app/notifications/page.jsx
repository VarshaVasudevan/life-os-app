'use client';

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaBell, FaTrash, FaCheckDouble } from 'react-icons/fa';
import MainLayout from '@/components/layout/MainLayout';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import toast from 'react-hot-toast';

function NotificationsContent() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    // Simulate API call - replace with actual API
    setTimeout(() => {
      const sampleNotifications = [
        {
          id: 1,
          type: 'success',
          title: 'Goal Achieved!',
          message: 'You completed your "Learn React" goal',
          time: '2024-03-26T10:30:00',
          read: false,
          link: '/goals'
        },
        {
          id: 2,
          type: 'warning',
          title: 'Upcoming Deadline',
          message: 'Task "Submit report" is due tomorrow',
          time: '2024-03-25T15:20:00',
          read: false,
          link: '/tasks'
        },
        {
          id: 3,
          type: 'info',
          title: 'Health Reminder',
          message: 'Don\'t forget to log your health data today',
          time: '2024-03-24T09:00:00',
          read: true,
          link: '/health'
        },
        {
          id: 4,
          type: 'success',
          title: 'New Interaction',
          message: 'You logged a new interaction with John Doe',
          time: '2024-03-23T14:15:00',
          read: true,
          link: '/relationships'
        },
        {
          id: 5,
          type: 'warning',
          title: 'Budget Alert',
          message: 'You have exceeded your monthly budget by ₹5,000',
          time: '2024-03-22T11:45:00',
          read: false,
          link: '/finance'
        },
        {
          id: 6,
          type: 'info',
          title: 'New Feature',
          message: 'Check out the new AI insights feature!',
          time: '2024-03-21T16:30:00',
          read: true,
          link: '/insights'
        }
      ];
      setNotifications(sampleNotifications);
      setLoading(false);
    }, 500);
  };

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'success':
        return <FaCheckCircle style={{ color: '#10b981', fontSize: '20px' }} />;
      case 'warning':
        return <FaExclamationTriangle style={{ color: '#f59e0b', fontSize: '20px' }} />;
      case 'info':
        return <FaInfoCircle style={{ color: '#3b82f6', fontSize: '20px' }} />;
      default:
        return <FaBell style={{ color: '#6c757d', fontSize: '20px' }} />;
    }
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
    toast.success('Notification marked as read');
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
    toast.success('Notification deleted');
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) return <LoadingSpinner />;

  return (
    <Container fluid>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold" style={{ color: '#495057' }}>Notifications</h2>
          <p style={{ color: '#6c757d' }}>Stay updated with your latest activities</p>
        </div>
        {unreadCount > 0 && (
          <Button 
            onClick={markAllAsRead}
            style={{
              background: 'linear-gradient(135deg, #6c757d 0%, #495057 100%)',
              border: 'none',
              borderRadius: '10px',
              padding: '8px 20px'
            }}
          >
            <FaCheckDouble className="me-2" /> Mark All as Read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <Card className="text-center p-5" style={{ borderRadius: '20px', border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <Card.Body>
            <div className="display-1 mb-3">🔔</div>
            <h4 style={{ color: '#495057' }}>No notifications</h4>
            <p style={{ color: '#6c757d' }}>
              You're all caught up! Check back later for updates.
            </p>
          </Card.Body>
        </Card>
      ) : (
        <>
          <div className="mb-3">
            <small style={{ color: '#6c757d' }}>
              {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </small>
          </div>
          {notifications.map(notification => (
            <Card 
              key={notification.id}
              className="mb-3 hover-card"
              style={{
                borderRadius: '15px',
                border: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                backgroundColor: notification.read ? 'white' : '#f8f9fa',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onClick={() => window.location.href = notification.link}
            >
              <Card.Body>
                <div className="d-flex align-items-start gap-3">
                  <div className="mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h6 className="mb-1" style={{ color: '#495057' }}>
                          {notification.title}
                          {!notification.read && (
                            <Badge 
                              className="ms-2" 
                              style={{ backgroundColor: '#6c757d', fontSize: '10px' }}
                            >
                              New
                            </Badge>
                          )}
                        </h6>
                        <p style={{ color: '#6c757d', marginBottom: '8px' }}>
                          {notification.message}
                        </p>
                        <small style={{ color: '#adb5bd' }}>
                          {formatTime(notification.time)}
                        </small>
                      </div>
                      <div className="d-flex gap-2">
                        {!notification.read && (
                          <Button
                            variant="link"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notification.id);
                            }}
                            style={{ color: '#6c757d' }}
                          >
                            Mark read
                          </Button>
                        )}
                        <Button
                          variant="link"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                          style={{ color: '#dc3545' }}
                        >
                          <FaTrash />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          ))}
        </>
      )}
    </Container>
  );
}

export default function NotificationsPage() {
  return (
    <MainLayout>
      <NotificationsContent />
    </MainLayout>
  );
}