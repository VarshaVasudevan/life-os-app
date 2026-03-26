'use client';

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Badge } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaPhone, FaEnvelope, FaBirthdayCake, FaCalendarAlt } from 'react-icons/fa';
import { relationshipsAPI } from '@/utils/api';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import EmptyState from '@/components/common/EmptyState';
import MainLayout from '@/components/layout/MainLayout';
import toast from 'react-hot-toast';

function RelationshipsContent() {
  const [relationships, setRelationships] = useState([]);
  const [upcomingDates, setUpcomingDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showInteractionModal, setShowInteractionModal] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [editingPerson, setEditingPerson] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'friend',
    email: '',
    phone: '',
    birthday: '',
    anniversary: '',
    notes: ''
  });
  const [interactionData, setInteractionData] = useState({
    type: 'call',
    notes: '',
    mood: '5'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [relationshipsRes, upcomingRes] = await Promise.all([
        relationshipsAPI.getAll(),
        relationshipsAPI.getUpcoming()
      ]);
      setRelationships(relationshipsRes.data);
      setUpcomingDates(upcomingRes.data);
    } catch (error) {
      toast.error('Failed to fetch relationships data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPerson) {
        await relationshipsAPI.update(editingPerson._id, formData);
        toast.success('Person updated');
      } else {
        await relationshipsAPI.create(formData);
        toast.success('Person added');
      }
      setShowModal(false);
      resetForm();
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this person?')) {
      try {
        await relationshipsAPI.delete(id);
        toast.success('Person deleted');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete person');
      }
    }
  };

  const handleInteraction = async (e) => {
    e.preventDefault();
    try {
      await relationshipsAPI.addInteraction(selectedPerson._id, interactionData);
      toast.success('Interaction logged');
      setShowInteractionModal(false);
      fetchData();
    } catch (error) {
      toast.error('Failed to log interaction');
    }
  };

  const handleEdit = (person) => {
    setEditingPerson(person);
    setFormData({
      name: person.name,
      type: person.type,
      email: person.email || '',
      phone: person.phone || '',
      birthday: person.birthday ? person.birthday.split('T')[0] : '',
      anniversary: person.anniversary ? person.anniversary.split('T')[0] : '',
      notes: person.notes || ''
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingPerson(null);
    setFormData({
      name: '',
      type: 'friend',
      email: '',
      phone: '',
      birthday: '',
      anniversary: '',
      notes: ''
    });
  };

  const getTypeIcon = (type) => {
    const icons = {
      family: '👨‍👩‍👧‍👦',
      friend: '👥',
      colleague: '💼',
      partner: '💕',
      mentor: '🎓',
      other: '👤'
    };
    return icons[type] || '👤';
  };

  const getStrengthColor = (strength) => {
    if (strength >= 8) return '#10b981';
    if (strength >= 5) return '#f59e0b';
    return '#ef4444';
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Container fluid>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold" style={{ color: '#495057' }}>Relationships</h2>
          <p style={{ color: '#6c757d' }}>Manage your important connections</p>
        </div>
        <Button 
          className="btn-gradient" 
          onClick={() => setShowModal(true)}
          style={{
            background: 'linear-gradient(135deg, #6c757d 0%, #5a6268 100%)',
            border: 'none',
            borderRadius: '10px',
            padding: '10px 24px',
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
          <FaPlus className="me-2" /> Add Person
        </Button>
      </div>

      {/* Upcoming Dates Section */}
      {upcomingDates.length > 0 && (
        <Card className="shadow-sm mb-4" style={{ borderRadius: '20px', border: 'none' }}>
          <Card.Body>
            <Card.Title className="mb-3" style={{ color: '#495057' }}>
              <FaCalendarAlt className="me-2" style={{ color: '#6c757d' }} /> Upcoming Important Dates
            </Card.Title>
            <Row>
              {upcomingDates.slice(0, 4).map((date, idx) => (
                <Col md={3} key={idx}>
                  <div className="p-3 rounded-3 mb-2" style={{ backgroundColor: '#f5f5f4' }}>
                    <div className="d-flex align-items-center gap-2">
                      <span style={{ fontSize: '24px' }}>
                        {date.type === 'birthday' ? '🎂' : date.type === 'anniversary' ? '💍' : '📅'}
                      </span>
                      <div>
                        <strong style={{ color: '#495057' }}>{date.person}</strong>
                        <div className="small" style={{ color: '#6c757d' }}>
                          {date.type === 'birthday' ? 'Birthday' : date.type === 'anniversary' ? 'Anniversary' : date.title}
                        </div>
                        <Badge 
                          className="mt-1" 
                          style={{ 
                            backgroundColor: '#e9ecef', 
                            color: '#495057',
                            padding: '4px 8px',
                            borderRadius: '20px'
                          }}
                        >
                          {date.daysUntil === 0 ? 'Today!' : `${date.daysUntil} days`}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </Card.Body>
        </Card>
      )}

      {relationships.length === 0 ? (
        <EmptyState
          icon="👥"
          title="No connections yet"
          message="Start building your network by adding important people"
          actionText="Add Your First Person"
          onAction={() => setShowModal(true)}
        />
      ) : (
        <Row>
          {relationships.map(person => (
            <Col md={6} lg={4} key={person._id} className="mb-4">
              <Card className="hover-card h-100" style={{ borderRadius: '20px', border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="d-flex align-items-center">
                      <div style={{
                        background: 'linear-gradient(135deg, #6c757d 0%, #5a6268 100%)',
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px',
                        marginRight: '15px'
                      }}>
                        {getTypeIcon(person.type)}
                      </div>
                      <div>
                        <Card.Title className="mb-0" style={{ color: '#495057' }}>{person.name}</Card.Title>
                        <small style={{ color: '#6c757d' }}>{person.type}</small>
                      </div>
                    </div>
                    <div 
                      className="rounded-circle p-2 d-flex align-items-center justify-content-center"
                      style={{ 
                        background: getStrengthColor(person.relationshipStrength),
                        width: '40px',
                        height: '40px',
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                    >
                      {person.relationshipStrength}
                    </div>
                  </div>
                  
                  {(person.email || person.phone) && (
                    <div className="mb-3">
                      {person.email && (
                        <div className="small mb-1" style={{ color: '#6c757d' }}>
                          <FaEnvelope className="me-2" style={{ color: '#a9a9a9' }} /> {person.email}
                        </div>
                      )}
                      {person.phone && (
                        <div className="small" style={{ color: '#6c757d' }}>
                          <FaPhone className="me-2" style={{ color: '#a9a9a9' }} /> {person.phone}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {(person.birthday || person.anniversary) && (
                    <div className="mb-3">
                      {person.birthday && (
                        <div className="small" style={{ color: '#495057' }}>
                          <FaBirthdayCake className="me-2" style={{ color: '#f59e0b' }} />
                          Birthday: {new Date(person.birthday).toLocaleDateString()}
                        </div>
                      )}
                      {person.anniversary && (
                        <div className="small" style={{ color: '#495057' }}>
                          <FaCalendarAlt className="me-2" style={{ color: '#3b82f6' }} />
                          Anniversary: {new Date(person.anniversary).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {person.notes && (
                    <Card.Text className="small mt-2" style={{ color: '#6c757d' }}>
                      {person.notes}
                    </Card.Text>
                  )}
                  
                  {person.lastContact && (
                    <div className="mt-2 small" style={{ color: '#6c757d' }}>
                      Last contact: {new Date(person.lastContact).toLocaleDateString()}
                    </div>
                  )}
                  
                  {person.interactions && person.interactions.length > 0 && (
                    <div className="mt-2">
                      <small style={{ color: '#6c757d' }}>Recent interactions: {person.interactions.length}</small>
                    </div>
                  )}
                </Card.Body>
                <Card.Footer className="bg-white border-0 d-flex justify-content-between gap-2 pb-3">
                  <Button 
                    variant="outline-success" 
                    size="sm"
                    onClick={() => {
                      setSelectedPerson(person);
                      setShowInteractionModal(true);
                    }}
                    style={{ borderRadius: '8px', borderColor: '#10b981', color: '#10b981' }}
                  >
                    <FaPhone /> Log Interaction
                  </Button>
                  <div>
                    <Button 
                      variant="outline-secondary" 
                      size="sm" 
                      onClick={() => handleEdit(person)} 
                      className="me-2"
                      style={{ borderRadius: '8px', borderColor: '#dee2e6', color: '#6c757d' }}
                    >
                      <FaEdit />
                    </Button>
                    <Button 
                      variant="outline-danger" 
                      size="sm" 
                      onClick={() => handleDelete(person._id)}
                      style={{ borderRadius: '8px' }}
                    >
                      <FaTrash />
                    </Button>
                  </div>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Modal for Add/Edit Person */}
      <Modal show={showModal} onHide={() => { setShowModal(false); resetForm(); }} className="modal-custom" centered size="lg">
        <Modal.Header closeButton style={{ borderBottom: '2px solid #f5f5f4' }}>
          <Modal.Title style={{ color: '#495057' }}>{editingPerson ? 'Edit Person' : 'Add Person'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label style={{ color: '#495057', fontWeight: '500' }}>Name *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
                style={{ borderRadius: '10px', border: '2px solid #dee2e6' }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ color: '#495057', fontWeight: '500' }}>Relationship Type</Form.Label>
              <Form.Select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                style={{ borderRadius: '10px', border: '2px solid #dee2e6' }}
              >
                <option value="family">👨‍👩‍👧‍👦 Family</option>
                <option value="friend">👥 Friend</option>
                <option value="colleague">💼 Colleague</option>
                <option value="partner">💕 Partner</option>
                <option value="mentor">🎓 Mentor</option>
                <option value="other">👤 Other</option>
              </Form.Select>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ color: '#495057', fontWeight: '500' }}>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    style={{ borderRadius: '10px', border: '2px solid #dee2e6' }}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ color: '#495057', fontWeight: '500' }}>Phone</Form.Label>
                  <Form.Control
                    type="tel"
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    style={{ borderRadius: '10px', border: '2px solid #dee2e6' }}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ color: '#495057', fontWeight: '500' }}>Birthday</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.birthday}
                    onChange={(e) => setFormData({...formData, birthday: e.target.value})}
                    style={{ borderRadius: '10px', border: '2px solid #dee2e6' }}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ color: '#495057', fontWeight: '500' }}>Anniversary</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.anniversary}
                    onChange={(e) => setFormData({...formData, anniversary: e.target.value})}
                    style={{ borderRadius: '10px', border: '2px solid #dee2e6' }}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label style={{ color: '#495057', fontWeight: '500' }}>Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Add any notes..."
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                style={{ borderRadius: '10px', border: '2px solid #dee2e6' }}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer style={{ borderTop: '2px solid #f5f5f4' }}>
            <Button 
              variant="secondary" 
              onClick={() => { setShowModal(false); resetForm(); }}
              style={{ borderRadius: '10px', backgroundColor: '#e9ecef', border: 'none', color: '#495057' }}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              style={{
                background: 'linear-gradient(135deg, #6c757d 0%, #5a6268 100%)',
                border: 'none',
                borderRadius: '10px',
                padding: '8px 24px',
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
              {editingPerson ? 'Update' : 'Add'} Person
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Modal for Log Interaction */}
      <Modal show={showInteractionModal} onHide={() => setShowInteractionModal(false)} className="modal-custom" centered>
        <Modal.Header closeButton style={{ borderBottom: '2px solid #f5f5f4' }}>
          <Modal.Title style={{ color: '#495057' }}>Log Interaction with {selectedPerson?.name}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleInteraction}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label style={{ color: '#495057', fontWeight: '500' }}>Interaction Type</Form.Label>
              <Form.Select
                value={interactionData.type}
                onChange={(e) => setInteractionData({...interactionData, type: e.target.value})}
                style={{ borderRadius: '10px', border: '2px solid #dee2e6' }}
              >
                <option value="call">📞 Phone Call</option>
                <option value="meet">🤝 In-Person Meeting</option>
                <option value="message">💬 Text/Message</option>
                <option value="gift">🎁 Gift</option>
                <option value="other">📝 Other</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ color: '#495057', fontWeight: '500' }}>Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="What did you talk about?"
                value={interactionData.notes}
                onChange={(e) => setInteractionData({...interactionData, notes: e.target.value})}
                style={{ borderRadius: '10px', border: '2px solid #dee2e6' }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ color: '#495057', fontWeight: '500' }}>Mood (1-10)</Form.Label>
              <Form.Control
                type="range"
                min="1"
                max="10"
                value={interactionData.mood}
                onChange={(e) => setInteractionData({...interactionData, mood: e.target.value})}
              />
              <Form.Text style={{ color: '#a9a9a9' }}>{interactionData.mood}/10</Form.Text>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer style={{ borderTop: '2px solid #f5f5f4' }}>
            <Button 
              variant="secondary" 
              onClick={() => setShowInteractionModal(false)}
              style={{ borderRadius: '10px', backgroundColor: '#e9ecef', border: 'none', color: '#495057' }}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              style={{
                background: 'linear-gradient(135deg, #6c757d 0%, #5a6268 100%)',
                border: 'none',
                borderRadius: '10px',
                padding: '8px 24px',
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
              Log Interaction
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}

// Main export with MainLayout wrapper
export default function RelationshipsPage() {
  return (
    <MainLayout>
      <RelationshipsContent />
    </MainLayout>
  );
}