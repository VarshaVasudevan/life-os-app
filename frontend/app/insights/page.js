'use client';

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { FaLightbulb, FaChartLine, FaHeartbeat, FaMoneyBillWave, FaUsers, FaTasks } from 'react-icons/fa';
import { insightsAPI } from '@/utils/api';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import MainLayout from '@/components/layout/MainLayout';
import toast from 'react-hot-toast';

function InsightsContent() {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      const response = await insightsAPI.getAll();
      setInsights(response.data);
    } catch (error) {
      toast.error('Failed to fetch insights');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      goals: '🎯',
      health: '💪',
      finance: '💰',
      tasks: '📋',
      relationships: '👥',
      general: '💡'
    };
    return icons[category] || '💡';
  };

  const getInsightClass = (type) => {
    switch(type) {
      case 'success': return 'insight-success';
      case 'warning': return 'insight-warning';
      case 'danger': return 'insight-danger';
      default: return 'insight-info';
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Container fluid>
      <div className="mb-4">
        <h2 className="fw-bold" style={{ color: '#495057' }}>AI Insights</h2>
        <p style={{ color: '#6c757d' }}>Personalized insights to help you improve your life</p>
      </div>

      {insights.length === 0 ? (
        <Card className="text-center p-5" style={{ borderRadius: '20px', border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <Card.Body>
            <div className="display-1 mb-3">🤖</div>
            <h4 style={{ color: '#495057' }}>No insights yet</h4>
            <p style={{ color: '#6c757d' }}>
              Start adding more data to your goals, health, finances, and tasks to get personalized insights.
            </p>
          </Card.Body>
        </Card>
      ) : (
        <Row>
          {insights.map((insight, index) => (
            <Col lg={6} key={index} className="mb-4">
              <div 
                className={`insight-card ${getInsightClass(insight.type)}`}
                style={{
                  borderLeft: '4px solid',
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: '15px',
                  transition: 'all 0.3s',
                  background: 'white',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateX(5px)';
                  e.currentTarget.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateX(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div className="d-flex align-items-start gap-3">
                  <div style={{ fontSize: '32px' }}>
                    {insight.icon || getCategoryIcon(insight.category)}
                  </div>
                  <div className="flex-grow-1">
                    <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
                      <h5 className="mb-0" style={{ color: '#495057' }}>{insight.title}</h5>
                      <Badge 
                        style={{
                          backgroundColor: insight.type === 'success' ? '#d1fae5' : 
                                         insight.type === 'warning' ? '#fffbeb' : 
                                         insight.type === 'danger' ? '#fee2e2' : '#eff6ff',
                          color: insight.type === 'success' ? '#065f46' : 
                                 insight.type === 'warning' ? '#92400e' : 
                                 insight.type === 'danger' ? '#991b1b' : '#1e40af',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontWeight: '500'
                        }}
                      >
                        {insight.type}
                      </Badge>
                    </div>
                    <p className="mb-2" style={{ color: '#495057' }}>{insight.message}</p>
                    {insight.action && (
                      <div className="mt-2">
                        <small style={{ color: '#6c757d' }}>
                          💡 {insight.action}
                        </small>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      )}

      {/* Tips Section */}
      <Card className="shadow-sm mt-4" style={{ borderRadius: '20px', border: 'none' }}>
        <Card.Body>
          <Card.Title className="mb-3" style={{ color: '#495057' }}>
            <FaLightbulb className="me-2" style={{ color: '#f59e0b' }} />
            Pro Tips for Better Life Management
          </Card.Title>
          <Row>
            <Col md={6}>
              <ul className="list-unstyled">
                <li className="mb-2" style={{ color: '#495057' }}>
                  <span style={{ color: '#10b981' }}>✓</span> Set SMART goals (Specific, Measurable, Achievable, Relevant, Time-bound)
                </li>
                <li className="mb-2" style={{ color: '#495057' }}>
                  <span style={{ color: '#10b981' }}>✓</span> Log your health daily to see patterns and improve habits
                </li>
                <li className="mb-2" style={{ color: '#495057' }}>
                  <span style={{ color: '#10b981' }}>✓</span> Review your finances weekly to stay on top of your budget
                </li>
              </ul>
            </Col>
            <Col md={6}>
              <ul className="list-unstyled">
                <li className="mb-2" style={{ color: '#495057' }}>
                  <span style={{ color: '#10b981' }}>✓</span> Schedule regular catch-ups with important people in your life
                </li>
                <li className="mb-2" style={{ color: '#495057' }}>
                  <span style={{ color: '#10b981' }}>✓</span> Break large tasks into smaller, manageable subtasks
                </li>
                <li className="mb-2" style={{ color: '#495057' }}>
                  <span style={{ color: '#10b981' }}>✓</span> Celebrate small wins to stay motivated
                </li>
              </ul>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
}

// Main export with MainLayout wrapper
export default function InsightsPage() {
  return (
    <MainLayout>
      <InsightsContent />
    </MainLayout>
  );
}