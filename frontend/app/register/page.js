'use client';

import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { FaUser, FaEnvelope, FaLock, FaUserPlus, FaSignInAlt } from 'react-icons/fa';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setError('');
    setLoading(true);
    
    const result = await register(name, email, password);
    if (result.success) {
      router.push('/dashboard');
    } else {
      setError(result.error || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: '#E5E4E2'
    }}>
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <Card className="glass-card fade-in">
              <Card.Body style={{ padding: '40px' }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                  <div style={{
                    background: 'linear-gradient(135deg, #6c757d 0%, #5a6268 100%)',
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px'
                  }}>
                    <span style={{ fontSize: '48px' }}>🧬</span>
                  </div>
                  <h2 style={{ fontWeight: 'bold', color: '#495057' }}>Create Account</h2>
                  <p style={{ color: '#6c757d' }}>Start your journey with Life OS</p>
                </div>

                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ color: '#495057', fontWeight: '500' }}>Full Name</Form.Label>
                    <div style={{ position: 'relative' }}>
                      <FaUser style={{ 
                        position: 'absolute', 
                        left: '12px', 
                        top: '50%', 
                        transform: 'translateY(-50%)',
                        color: '#a9a9a9'
                      }} />
                      <Form.Control
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        style={{ 
                          paddingLeft: '40px', 
                          borderRadius: '10px', 
                          border: '2px solid #dee2e6',
                          backgroundColor: '#fff'
                        }}
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label style={{ color: '#495057', fontWeight: '500' }}>Email Address</Form.Label>
                    <div style={{ position: 'relative' }}>
                      <FaEnvelope style={{ 
                        position: 'absolute', 
                        left: '12px', 
                        top: '50%', 
                        transform: 'translateY(-50%)',
                        color: '#a9a9a9'
                      }} />
                      <Form.Control
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ 
                          paddingLeft: '40px', 
                          borderRadius: '10px', 
                          border: '2px solid #dee2e6',
                          backgroundColor: '#fff'
                        }}
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label style={{ color: '#495057', fontWeight: '500' }}>Password</Form.Label>
                    <div style={{ position: 'relative' }}>
                      <FaLock style={{ 
                        position: 'absolute', 
                        left: '12px', 
                        top: '50%', 
                        transform: 'translateY(-50%)',
                        color: '#a9a9a9'
                      }} />
                      <Form.Control
                        type="password"
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ 
                          paddingLeft: '40px', 
                          borderRadius: '10px', 
                          border: '2px solid #dee2e6',
                          backgroundColor: '#fff'
                        }}
                      />
                    </div>
                    <Form.Text style={{ color: '#a9a9a9' }}>
                      Password must be at least 6 characters
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label style={{ color: '#495057', fontWeight: '500' }}>Confirm Password</Form.Label>
                    <div style={{ position: 'relative' }}>
                      <FaLock style={{ 
                        position: 'absolute', 
                        left: '12px', 
                        top: '50%', 
                        transform: 'translateY(-50%)',
                        color: '#a9a9a9'
                      }} />
                      <Form.Control
                        type="password"
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        style={{ 
                          paddingLeft: '40px', 
                          borderRadius: '10px', 
                          border: '2px solid #dee2e6',
                          backgroundColor: '#fff'
                        }}
                      />
                    </div>
                  </Form.Group>

                  <Button
                    type="submit"
                    className="w-100 py-2 mb-3"
                    disabled={loading}
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
                    {loading ? 'Creating account...' : <><FaUserPlus className="me-2" /> Sign Up</>}
                  </Button>

                  <div className="text-center">
                    <Link href="/login" className="text-decoration-none" style={{ color: '#6c757d' }}>
                      <FaSignInAlt className="me-1" /> Already have an account? Sign in
                    </Link>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}