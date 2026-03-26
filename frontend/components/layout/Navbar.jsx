'use client';

import React, { useState, useEffect } from 'react';
import { Navbar as BootstrapNavbar, Nav, Dropdown, Container, Badge } from 'react-bootstrap';
import { useAuth } from '@/context/AuthContext';
import { FaUser, FaCog, FaSignOutAlt, FaBell, FaCheckCircle, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Sample notifications - in real app, fetch from API
  useEffect(() => {
    // You can fetch notifications from your API here
    const sampleNotifications = [
      {
        id: 1,
        type: 'success',
        title: 'Goal Achieved!',
        message: 'You completed your "Learn React" goal',
        time: '2 hours ago',
        read: false
      },
      {
        id: 2,
        type: 'warning',
        title: 'Upcoming Deadline',
        message: 'Task "Submit report" is due tomorrow',
        time: '5 hours ago',
        read: false
      },
      {
        id: 3,
        type: 'info',
        title: 'Health Reminder',
        message: 'Don\'t forget to log your health data today',
        time: '1 day ago',
        read: true
      },
      {
        id: 4,
        type: 'success',
        title: 'New Interaction',
        message: 'You logged a new interaction with John Doe',
        time: '2 days ago',
        read: true
      }
    ];
    setNotifications(sampleNotifications);
  }, []);

  const getInitials = (name) => {
    return name?.charAt(0).toUpperCase() || 'U';
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'success':
        return <FaCheckCircle style={{ color: '#10b981' }} />;
      case 'warning':
        return <FaExclamationTriangle style={{ color: '#f59e0b' }} />;
      case 'info':
        return <FaInfoCircle style={{ color: '#3b82f6' }} />;
      default:
        return <FaBell style={{ color: '#6c757d' }} />;
    }
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    // Navigate based on notification type
    if (notification.type === 'goal') {
      router.push('/goals');
    } else if (notification.type === 'task') {
      router.push('/tasks');
    } else if (notification.type === 'health') {
      router.push('/health');
    }
  };

  return (
    <BootstrapNavbar 
      bg="white" 
      expand="lg" 
      className="shadow-sm rounded-3 mb-4" 
      style={{ padding: '15px 20px', borderRadius: '20px' }}
    >
      <Container fluid>
        <BootstrapNavbar.Brand href="/dashboard" className="d-flex align-items-center">
          <span style={{ fontSize: '24px', marginRight: '10px' }}>🧬</span>
          <span style={{ 
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #6c757d 0%, #495057 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Life OS
          </span>
        </BootstrapNavbar.Brand>
        
        <BootstrapNavbar.Toggle aria-controls="navbar-nav" />
        <BootstrapNavbar.Collapse id="navbar-nav">
          <Nav className="ms-auto align-items-center">
            {/* Notification Dropdown */}
            <Dropdown 
              align="end" 
              show={showNotifications} 
              onToggle={(isOpen) => setShowNotifications(isOpen)}
            >
              <Dropdown.Toggle 
                variant="light" 
                className="position-relative me-3 rounded-circle"
                style={{ 
                  background: 'transparent', 
                  border: 'none',
                  padding: '8px'
                }}
              >
                <FaBell size={20} style={{ color: '#6c757d' }} />
                {unreadCount > 0 && (
                  <Badge 
                    bg="danger" 
                    style={{ 
                      position: 'absolute', 
                      top: '-5px', 
                      right: '-5px',
                      fontSize: '10px',
                      borderRadius: '50%',
                      padding: '4px 6px'
                    }}
                  >
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </Badge>
                )}
              </Dropdown.Toggle>
              
              <Dropdown.Menu 
                style={{ 
                  width: '350px', 
                  maxHeight: '500px', 
                  overflowY: 'auto',
                  borderRadius: '15px',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                  border: 'none',
                  padding: '0'
                }}
              >
                <div style={{ 
                  padding: '15px 20px', 
                  borderBottom: '1px solid #e9ecef',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <strong style={{ color: '#495057' }}>Notifications</strong>
                  {unreadCount > 0 && (
                    <button 
                      onClick={markAllAsRead}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#6c757d',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                
                {notifications.length === 0 ? (
                  <div style={{ padding: '40px', textAlign: 'center' }}>
                    <FaBell size={40} style={{ color: '#dee2e6', marginBottom: '10px' }} />
                    <p style={{ color: '#6c757d', margin: 0 }}>No notifications</p>
                  </div>
                ) : (
                  notifications.map(notification => (
                    <div 
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      style={{
                        padding: '12px 20px',
                        borderBottom: '1px solid #e9ecef',
                        cursor: 'pointer',
                        backgroundColor: notification.read ? 'white' : '#f8f9fa',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f5f5f4';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = notification.read ? 'white' : '#f8f9fa';
                      }}
                    >
                      <div className="d-flex gap-3">
                        <div style={{ fontSize: '18px' }}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between align-items-start">
                            <strong style={{ color: '#495057', fontSize: '14px' }}>
                              {notification.title}
                            </strong>
                            {!notification.read && (
                              <Badge bg="primary" style={{ fontSize: '10px', backgroundColor: '#6c757d' }}>
                                New
                              </Badge>
                            )}
                          </div>
                          <p style={{ color: '#6c757d', fontSize: '13px', margin: '4px 0' }}>
                            {notification.message}
                          </p>
                          <small style={{ color: '#adb5bd', fontSize: '11px' }}>
                            {notification.time}
                          </small>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                
                <div style={{ 
                  padding: '10px', 
                  borderTop: '1px solid #e9ecef',
                  textAlign: 'center'
                }}>
                  <button 
                    onClick={() => router.push('/notifications')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#6c757d',
                      fontSize: '12px',
                      cursor: 'pointer',
                      width: '100%'
                    }}
                  >
                    View all notifications
                  </button>
                </div>
              </Dropdown.Menu>
            </Dropdown>
            
            {/* User Dropdown */}
            <Dropdown align="end">
              <Dropdown.Toggle 
                variant="light" 
                className="d-flex align-items-center gap-2 rounded-pill"
                style={{ 
                  background: '#f8f9fa',
                  border: '1px solid #e9ecef',
                  padding: '5px 12px'
                }}
              >
                <div style={{
                  background: 'linear-gradient(135deg, #6c757d 0%, #495057 100%)',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}>
                  {getInitials(user?.name)}
                </div>
                <span style={{ color: '#495057' }}>{user?.name || 'User'}</span>
              </Dropdown.Toggle>
              
              <Dropdown.Menu style={{ borderRadius: '12px', border: 'none', boxShadow: '0 5px 20px rgba(0,0,0,0.1)' }}>
                <Dropdown.Item href="/profile" style={{ padding: '10px 20px' }}>
                  <FaUser className="me-2" style={{ color: '#6c757d' }} /> Profile
                </Dropdown.Item>
                <Dropdown.Item href="/settings" style={{ padding: '10px 20px' }}>
                  <FaCog className="me-2" style={{ color: '#6c757d' }} /> Settings
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={logout} style={{ padding: '10px 20px' }}>
                  <FaSignOutAlt className="me-2" style={{ color: '#6c757d' }} /> Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;