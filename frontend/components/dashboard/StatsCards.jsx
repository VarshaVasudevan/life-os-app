import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { FaBullseye, FaHeartbeat, FaMoneyBillWave, FaTasks, FaUsers } from 'react-icons/fa';

const StatsCards = ({ stats }) => {
  const cards = [
    {
      title: 'Goals',
      value: `${stats.goals.completed}/${stats.goals.total}`,
      subtext: `${stats.goals.progress}% completed`,
      icon: FaBullseye,
      gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
      iconBg: '#eef2ff',
      iconColor: '#6366f1'
    },
    {
      title: 'Health',
      value: `${stats.health.mood}/10`,
      subtext: `${stats.health.steps.toLocaleString()} steps today`,
      icon: FaHeartbeat,
      gradient: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
      iconBg: '#ecfdf5',
      iconColor: '#10b981'
    },
    {
      title: 'Finance',
      value: `₹${stats.finance.balance.toLocaleString()}`,
      subtext: `Income: ₹${stats.finance.income} | Expenses: ₹${stats.finance.expenses}`,
      icon: FaMoneyBillWave,
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
      iconBg: '#fffbeb',
      iconColor: '#f59e0b'
    },
    {
      title: 'Tasks',
      value: `${stats.tasks.completed}/${stats.tasks.total}`,
      subtext: `${stats.tasks.completed} tasks completed`,
      icon: FaTasks,
      gradient: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)',
      iconBg: '#fef2f2',
      iconColor: '#ef4444'
    },
    {
      title: 'Relationships',
      value: stats.relationships.total,
      subtext: `${stats.relationships.upcoming} upcoming events | Strength: ${stats.relationships.avgStrength}/10`,
      icon: FaUsers,
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
      iconBg: '#f5f3ff',
      iconColor: '#8b5cf6'
    }
  ];

  return (
    <Row>
      {cards.map((card, idx) => (
        <Col lg={2.4} md={4} sm={6} key={idx} className="mb-4">
          <Card 
            className="stat-card h-100"
            style={{ 
              borderRadius: '20px', 
              border: 'none', 
              background: 'white',
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.05)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              overflow: 'hidden',
              position: 'relative'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.05)';
            }}
          >
            {/* Gradient Top Border */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: card.gradient
            }} />
            
            <Card.Body style={{ padding: '1.5rem' }}>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <p style={{ 
                    color: '#6c757d', 
                    marginBottom: '8px', 
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {card.title}
                  </p>
                  <h3 style={{ 
                    color: '#2c3e50', 
                    fontSize: '2rem', 
                    fontWeight: '700', 
                    marginBottom: '8px',
                    lineHeight: '1.2'
                  }}>
                    {card.value}
                  </h3>
                  <small style={{ 
                    color: '#6c757d', 
                    fontSize: '0.75rem',
                    display: 'block'
                  }}>
                    {card.subtext}
                  </small>
                </div>
                <div style={{
                  background: card.iconBg,
                  borderRadius: '15px',
                  width: '55px',
                  height: '55px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease'
                }}>
                  <card.icon color={card.iconColor} size={28} />
                </div>
              </div>
              
              {/* Progress Bar for Goals */}
              {card.title === 'Goals' && stats.goals.total > 0 && (
                <div className="mt-3">
                  <div style={{
                    height: '6px',
                    backgroundColor: '#e9ecef',
                    borderRadius: '10px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${stats.goals.progress}%`,
                      height: '100%',
                      background: card.gradient,
                      borderRadius: '10px',
                      transition: 'width 0.5s ease'
                    }} />
                  </div>
                </div>
              )}
              
              {/* Progress Bar for Tasks */}
              {card.title === 'Tasks' && stats.tasks.total > 0 && (
                <div className="mt-3">
                  <div style={{
                    height: '6px',
                    backgroundColor: '#e9ecef',
                    borderRadius: '10px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${(stats.tasks.completed / stats.tasks.total) * 100}%`,
                      height: '100%',
                      background: card.gradient,
                      borderRadius: '10px',
                      transition: 'width 0.5s ease'
                    }} />
                  </div>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default StatsCards;