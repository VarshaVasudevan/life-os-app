'use client';

import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { FaEnvelope, FaLock, FaSignInAlt, FaUserPlus } from 'react-icons/fa';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const result = await login(email, password);
    if (result.success) {
      router.push('/dashboard');
    } else {
      setError(result.error || 'Invalid email or password');
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
                  <h2 style={{ fontWeight: 'bold', color: '#495057' }}>Welcome Back</h2>
                  <p style={{ color: '#6c757d' }}>Sign in to your Life OS account</p>
                </div>

                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
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

                  <Form.Group className="mb-4">
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
                        placeholder="Enter your password"
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
                  </Form.Group>

                  <Button
                    type="submit"
                    className="btn-gradient w-100 py-2 mb-3"
                    disabled={loading}
                    style={{
                      background: 'linear-gradient(135deg, #6c757d 0%, #5a6268 100%)',
                      border: 'none'
                    }}
                  >
                    {loading ? 'Signing in...' : <><FaSignInAlt className="me-2" /> Sign In</>}
                  </Button>

                  <div className="text-center">
                    <Link href="/register" className="text-decoration-none" style={{ color: '#6c757d' }}>
                      <FaUserPlus className="me-1" /> Don't have an account? Sign up
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