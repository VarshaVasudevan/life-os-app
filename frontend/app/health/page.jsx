'use client';

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { FaHeartbeat, FaBed, FaWalking, FaTint, FaSmile } from 'react-icons/fa';
import { healthAPI } from '@/utils/api';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import HealthChart from '@/components/health/HealthChart';
import MainLayout from '@/components/layout/MainLayout';
import toast from 'react-hot-toast';

function HealthContent() {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    steps: '',
    sleepDuration: '',
    sleepQuality: '5',
    mood: '5',
    water: '',
    exerciseDuration: '',
    notes: ''
  });
  const [todayLog, setTodayLog] = useState(null);

  useEffect(() => {
    fetchHealthData();
  }, []);

  const fetchHealthData = async () => {
    try {
      const response = await healthAPI.getAll({ limit: 30 });
      setMetrics(response.data);
      
      // Check if today is logged
      const today = new Date().toISOString().split('T')[0];
      const todayLogData = response.data.find(m => m.date?.split('T')[0] === today);
      if (todayLogData) {
        setTodayLog(todayLogData);
        setFormData({
          steps: todayLogData.steps || '',
          sleepDuration: todayLogData.sleep?.duration || '',
          sleepQuality: todayLogData.sleep?.quality || '5',
          mood: todayLogData.mood || '5',
          water: todayLogData.water || '',
          exerciseDuration: todayLogData.exercise?.duration || '',
          notes: todayLogData.notes || ''
        });
      }
    } catch (error) {
      toast.error('Failed to fetch health data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        steps: parseInt(formData.steps) || 0,
        sleep: {
          duration: parseFloat(formData.sleepDuration) || 0,
          quality: parseInt(formData.sleepQuality) || 5
        },
        mood: parseInt(formData.mood) || 5,
        water: parseInt(formData.water) || 0,
        exercise: {
          duration: parseInt(formData.exerciseDuration) || 0
        },
        notes: formData.notes
      };
      
      await healthAPI.create(data);
      toast.success(todayLog ? 'Health data updated!' : 'Health data logged successfully!');
      fetchHealthData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to log health data');
    }
  };

  const getLatestStats = () => {
    const latest = metrics[0];
    if (!latest) return { steps: 0, mood: 0, sleep: 0, water: 0 };
    return {
      steps: latest.steps || 0,
      mood: latest.mood || 0,
      sleep: latest.sleep?.duration || 0,
      water: latest.water || 0
    };
  };

  const stats = getLatestStats();

  if (loading) return <LoadingSpinner />;

  return (
    <Container fluid>
      <div className="mb-4">
        <h2 className="fw-bold" style={{ color: '#495057' }}>Health Tracker</h2>
        <p style={{ color: '#6c757d' }}>Monitor your daily health and wellness</p>
      </div>

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="stat-card text-center">
            <Card.Body>
              <div className="stat-icon mx-auto mb-3" style={{ backgroundColor: '#f5f5f4' }}>
                <FaWalking color="#6c757d" size={24} />
              </div>
              <h3 style={{ color: '#495057' }}>{stats.steps.toLocaleString()}</h3>
              <p style={{ color: '#6c757d' }} className="mb-0">Steps Today</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card text-center">
            <Card.Body>
              <div className="stat-icon mx-auto mb-3" style={{ backgroundColor: '#f5f5f4' }}>
                <FaBed color="#6c757d" size={24} />
              </div>
              <h3 style={{ color: '#495057' }}>{stats.sleep} hrs</h3>
              <p style={{ color: '#6c757d' }} className="mb-0">Sleep</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card text-center">
            <Card.Body>
              <div className="stat-icon mx-auto mb-3" style={{ backgroundColor: '#f5f5f4' }}>
                <FaSmile color="#6c757d" size={24} />
              </div>
              <h3 style={{ color: '#495057' }}>{stats.mood}/10</h3>
              <p style={{ color: '#6c757d' }} className="mb-0">Mood</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card text-center">
            <Card.Body>
              <div className="stat-icon mx-auto mb-3" style={{ backgroundColor: '#f5f5f4' }}>
                <FaTint color="#6c757d" size={24} />
              </div>
              <h3 style={{ color: '#495057' }}>{stats.water} glasses</h3>
              <p style={{ color: '#6c757d' }} className="mb-0">Water</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col lg={5}>
          <Card className="shadow-sm mb-4" style={{ borderRadius: '20px', border: 'none' }}>
            <Card.Body>
              <Card.Title className="mb-3" style={{ color: '#495057' }}>
                {todayLog ? 'Update Today\'s Log' : 'Log Today\'s Health'}
              </Card.Title>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ color: '#495057', fontWeight: '500' }}>Steps</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Number of steps"
                    value={formData.steps}
                    onChange={(e) => setFormData({...formData, steps: e.target.value})}
                    style={{ borderRadius: '10px', border: '2px solid #dee2e6' }}
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ color: '#495057', fontWeight: '500' }}>Sleep Duration (hours)</Form.Label>
                      <Form.Control
                        type="number"
                        step="0.5"
                        placeholder="Hours"
                        value={formData.sleepDuration}
                        onChange={(e) => setFormData({...formData, sleepDuration: e.target.value})}
                        style={{ borderRadius: '10px', border: '2px solid #dee2e6' }}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ color: '#495057', fontWeight: '500' }}>Sleep Quality (1-10)</Form.Label>
                      <Form.Control
                        type="range"
                        min="1"
                        max="10"
                        value={formData.sleepQuality}
                        onChange={(e) => setFormData({...formData, sleepQuality: e.target.value})}
                      />
                      <Form.Text style={{ color: '#a9a9a9' }}>{formData.sleepQuality}/10</Form.Text>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label style={{ color: '#495057', fontWeight: '500' }}>Mood (1-10)</Form.Label>
                  <Form.Control
                    type="range"
                    min="1"
                    max="10"
                    value={formData.mood}
                    onChange={(e) => setFormData({...formData, mood: e.target.value})}
                  />
                  <Form.Text style={{ color: '#a9a9a9' }}>{formData.mood}/10</Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label style={{ color: '#495057', fontWeight: '500' }}>Water (glasses)</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Glasses of water"
                    value={formData.water}
                    onChange={(e) => setFormData({...formData, water: e.target.value})}
                    style={{ borderRadius: '10px', border: '2px solid #dee2e6' }}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label style={{ color: '#495057', fontWeight: '500' }}>Exercise Duration (minutes)</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Minutes"
                    value={formData.exerciseDuration}
                    onChange={(e) => setFormData({...formData, exerciseDuration: e.target.value})}
                    style={{ borderRadius: '10px', border: '2px solid #dee2e6' }}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label style={{ color: '#495057', fontWeight: '500' }}>Notes</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    placeholder="Any additional notes..."
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    style={{ borderRadius: '10px', border: '2px solid #dee2e6' }}
                  />
                </Form.Group>

                <Button 
                  type="submit" 
                  className="w-100 py-2"
                  style={{
                    background: 'linear-gradient(135deg, #6c757d 0%, #5a6268 100%)',
                    border: 'none',
                    borderRadius: '10px',
                    color: 'white',
                    fontWeight: '500',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 5px 15px rgba(108, 117, 125, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <FaHeartbeat className="me-2" />
                  {todayLog ? 'Update Log' : 'Log Today'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={7}>
          <Card className="shadow-sm mb-4" style={{ borderRadius: '20px', border: 'none' }}>
            <Card.Body>
              <Card.Title className="mb-3" style={{ color: '#495057' }}>Health Trends</Card.Title>
              <HealthChart metrics={metrics} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

// Main export with MainLayout wrapper
export default function HealthPage() {
  return (
    <MainLayout>
      <HealthContent />
    </MainLayout>
  );
}