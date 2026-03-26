'use client';

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaCheck } from 'react-icons/fa';
import { goalsAPI } from '@/utils/api';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import EmptyState from '@/components/common/EmptyState';
import MainLayout from '@/components/layout/MainLayout';
import toast from 'react-hot-toast';

function GoalsContent() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'personal',
    priority: 'medium',
    deadline: ''
  });

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await goalsAPI.getAll();
      setGoals(response.data);
    } catch (error) {
      toast.error('Failed to fetch goals');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingGoal) {
        await goalsAPI.update(editingGoal._id, formData);
        toast.success('Goal updated successfully');
      } else {
        await goalsAPI.create(formData);
        toast.success('Goal created successfully');
      }
      setShowModal(false);
      resetForm();
      fetchGoals();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      try {
        await goalsAPI.delete(id);
        toast.success('Goal deleted successfully');
        fetchGoals();
      } catch (error) {
        toast.error('Failed to delete goal');
      }
    }
  };

  const handleEdit = (goal) => {
    setEditingGoal(goal);
    setFormData({
      title: goal.title,
      description: goal.description || '',
      category: goal.category,
      priority: goal.priority,
      deadline: goal.deadline ? goal.deadline.split('T')[0] : ''
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingGoal(null);
    setFormData({
      title: '',
      description: '',
      category: 'personal',
      priority: 'medium',
      deadline: ''
    });
  };

  const getPriorityClass = (priority) => {
    switch(priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      default: return 'priority-low';
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      career: '💼',
      health: '💪',
      finance: '💰',
      relationships: '💝',
      personal: '🧘',
      education: '📚'
    };
    return icons[category] || '🎯';
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Container fluid>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold">Goals</h2>
          <p className="text-muted">Set, track, and achieve your life goals</p>
        </div>
        <Button className="btn-gradient" onClick={() => setShowModal(true)}>
          <FaPlus className="me-2" /> New Goal
        </Button>
      </div>

      {goals.length === 0 ? (
        <EmptyState
          icon="🎯"
          title="No goals yet"
          message="Start by setting your first goal. What do you want to achieve?"
          actionText="Create Your First Goal"
          onAction={() => setShowModal(true)}
        />
      ) : (
        <Row>
          {goals.map(goal => (
            <Col md={6} lg={4} key={goal._id} className="mb-4">
              <Card className="hover-card h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="d-flex align-items-center">
                      <span style={{ fontSize: '24px', marginRight: '10px' }}>
                        {getCategoryIcon(goal.category)}
                      </span>
                      <div>
                        <Card.Title className="mb-0">{goal.title}</Card.Title>
                        <small className="text-muted">{goal.category}</small>
                      </div>
                    </div>
                    <span className={getPriorityClass(goal.priority)}>
                      {goal.priority}
                    </span>
                  </div>
                  
                  {goal.description && (
                    <Card.Text className="text-muted small">{goal.description}</Card.Text>
                  )}
                  
                  <div className="mt-3">
                    <div className="d-flex justify-content-between mb-1">
                      <small>Progress</small>
                      <small>{Math.round(goal.progress)}%</small>
                    </div>
                    <div className="progress-custom">
                      <div 
                        className="progress-bar-custom"
                        style={{ width: `${goal.progress}%`, height: '100%' }}
                      />
                    </div>
                  </div>
                  
                  {goal.deadline && (
                    <div className="mt-3 text-muted small">
                      <strong>Deadline:</strong> {new Date(goal.deadline).toLocaleDateString()}
                    </div>
                  )}
                  
                  {goal.milestones && goal.milestones.length > 0 && (
                    <div className="mt-3">
                      <small className="text-muted">Milestones:</small>
                      <div className="mt-1">
                        {goal.milestones.slice(0, 2).map((milestone, idx) => (
                          <div key={idx} className="d-flex align-items-center gap-2 small">
                            {milestone.completed ? <FaCheck color="#10b981" size={12} /> : <span className="text-muted">○</span>}
                            <span className={milestone.completed ? 'text-muted text-decoration-line-through' : ''}>
                              {milestone.title}
                            </span>
                          </div>
                        ))}
                        {goal.milestones.length > 2 && (
                          <small className="text-muted">+{goal.milestones.length - 2} more</small>
                        )}
                      </div>
                    </div>
                  )}
                </Card.Body>
                <Card.Footer className="bg-white border-0 d-flex justify-content-end gap-2 pb-3">
                  <Button variant="outline-primary" size="sm" onClick={() => handleEdit(goal)}>
                    <FaEdit /> Edit
                  </Button>
                  <Button variant="outline-danger" size="sm" onClick={() => handleDelete(goal._id)}>
                    <FaTrash /> Delete
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Modal for Create/Edit Goal */}
      <Modal show={showModal} onHide={() => { setShowModal(false); resetForm(); }} className="modal-custom" size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingGoal ? 'Edit Goal' : 'Create New Goal'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Title *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter goal title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Describe your goal"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="career">Career</option>
                    <option value="health">Health</option>
                    <option value="finance">Finance</option>
                    <option value="relationships">Relationships</option>
                    <option value="personal">Personal Growth</option>
                    <option value="education">Education</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Priority</Form.Label>
                  <Form.Select
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Deadline</Form.Label>
              <Form.Control
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({...formData, deadline: e.target.value})}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => { setShowModal(false); resetForm(); }}>
              Cancel
            </Button>
            <Button type="submit" className="btn-gradient">
              {editingGoal ? 'Update Goal' : 'Create Goal'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}

// Main export with MainLayout wrapper
export default function GoalsPage() {
  return (
    <MainLayout>
      <GoalsContent />
    </MainLayout>
  );
}