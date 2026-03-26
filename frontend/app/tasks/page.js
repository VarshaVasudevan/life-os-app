'use client';

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Badge } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaCheck, FaClock, FaFlag } from 'react-icons/fa';
import { tasksAPI } from '@/utils/api';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import EmptyState from '@/components/common/EmptyState';
import MainLayout from '@/components/layout/MainLayout';
import toast from 'react-hot-toast';

function TasksContent() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState('all');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: 'personal',
    dueDate: '',
    reminder: false
  });

  useEffect(() => {
    fetchTasks();
  }, [filter]);

  const fetchTasks = async () => {
    try {
      const params = filter !== 'all' ? { status: filter } : {};
      const response = await tasksAPI.getAll(params);
      setTasks(response.data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const taskData = {
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        category: formData.category,
        dueDate: formData.dueDate || null,
        reminder: {
          enabled: formData.reminder,
          time: formData.dueDate ? new Date(formData.dueDate) : null
        }
      };
      
      if (editingTask) {
        await tasksAPI.update(editingTask._id, taskData);
        toast.success('Task updated successfully');
      } else {
        await tasksAPI.create(taskData);
        toast.success('Task created successfully');
      }
      setShowModal(false);
      resetForm();
      fetchTasks();
    } catch (error) {
      console.error('Error saving task:', error);
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await tasksAPI.delete(id);
        toast.success('Task deleted successfully');
        fetchTasks();
      } catch (error) {
        toast.error('Failed to delete task');
      }
    }
  };

  const handleToggle = async (id) => {
    try {
      await tasksAPI.toggle(id);
      toast.success('Task status updated');
      fetchTasks();
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      category: task.category || 'personal',
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
      reminder: task.reminder?.enabled || false
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingTask(null);
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      category: 'personal',
      dueDate: '',
      reminder: false
    });
  };

  const getPriorityClass = (priority) => {
    switch(priority) {
      case 'urgent': return 'priority-high';
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      default: return 'priority-low';
    }
  };

  const getPriorityIcon = (priority) => {
    switch(priority) {
      case 'urgent': return '🔴';
      case 'high': return '🟠';
      case 'medium': return '🟡';
      default: return '🟢';
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      work: '💼',
      personal: '🧘',
      health: '💪',
      finance: '💰',
      relationships: '💝',
      other: '📋'
    };
    return icons[category] || '📋';
  };

  const filteredTasks = tasks;
  const pendingTasks = tasks.filter(t => t.status !== 'completed');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  if (loading) return <LoadingSpinner />;

  return (
    <Container fluid>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold" style={{ color: '#495057' }}>Tasks</h2>
          <p style={{ color: '#6c757d' }}>Manage your daily tasks and todos</p>
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
          <FaPlus className="me-2" /> New Task
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="d-flex gap-2 mb-4">
        <Button 
          variant={filter === 'all' ? 'primary' : 'outline-secondary'}
          onClick={() => setFilter('all')}
          style={{
            borderRadius: '10px',
            backgroundColor: filter === 'all' ? '#6c757d' : 'transparent',
            borderColor: '#dee2e6',
            color: filter === 'all' ? 'white' : '#495057'
          }}
        >
          All ({tasks.length})
        </Button>
        <Button 
          variant={filter === 'pending' ? 'primary' : 'outline-secondary'}
          onClick={() => setFilter('pending')}
          style={{
            borderRadius: '10px',
            backgroundColor: filter === 'pending' ? '#6c757d' : 'transparent',
            borderColor: '#dee2e6',
            color: filter === 'pending' ? 'white' : '#495057'
          }}
        >
          Pending ({pendingTasks.length})
        </Button>
        <Button 
          variant={filter === 'completed' ? 'primary' : 'outline-secondary'}
          onClick={() => setFilter('completed')}
          style={{
            borderRadius: '10px',
            backgroundColor: filter === 'completed' ? '#6c757d' : 'transparent',
            borderColor: '#dee2e6',
            color: filter === 'completed' ? 'white' : '#495057'
          }}
        >
          Completed ({completedTasks.length})
        </Button>
      </div>

      {tasks.length === 0 ? (
        <EmptyState
          icon="📋"
          title="No tasks yet"
          message="Start organizing your day by adding some tasks"
          actionText="Create Your First Task"
          onAction={() => setShowModal(true)}
        />
      ) : (
        <Row>
          <Col lg={12}>
            {filteredTasks.map(task => (
              <div 
                key={task._id} 
                className={`task-card ${task.status === 'completed' ? 'task-completed' : ''}`}
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: '12px',
                  transition: 'all 0.3s',
                  border: '1px solid #dee2e6'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#6c757d';
                  e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#dee2e6';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div className="d-flex align-items-start justify-content-between">
                  <div className="d-flex align-items-start gap-3 flex-grow-1">
                    <Button
                      variant="link"
                      onClick={() => handleToggle(task._id)}
                      className="p-0 text-decoration-none"
                      style={{ width: '24px' }}
                    >
                      {task.status === 'completed' ? (
                        <FaCheck color="#10b981" size={20} />
                      ) : (
                        <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid #adb5bd' }} />
                      )}
                    </Button>
                    
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                        <h5 className={`task-title mb-0 ${task.status === 'completed' ? 'text-muted text-decoration-line-through' : ''}`} style={{ color: '#495057' }}>
                          {task.title}
                        </h5>
                        <Badge className={getPriorityClass(task.priority)} style={{ padding: '4px 8px', borderRadius: '8px' }}>
                          {getPriorityIcon(task.priority)} {task.priority}
                        </Badge>
                        <Badge style={{ backgroundColor: '#f5f5f4', color: '#495057', padding: '4px 8px', borderRadius: '8px' }}>
                          {getCategoryIcon(task.category)} {task.category}
                        </Badge>
                      </div>
                      
                      {task.description && (
                        <p className="text-muted small mb-2" style={{ color: '#6c757d' }}>{task.description}</p>
                      )}
                      
                      <div className="d-flex gap-3 small" style={{ color: '#6c757d' }}>
                        {task.dueDate && (
                          <div className="d-flex align-items-center gap-1">
                            <FaClock size={12} />
                            <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                          </div>
                        )}
                        {task.createdAt && (
                          <div>Created: {new Date(task.createdAt).toLocaleDateString()}</div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="d-flex gap-2">
                    <Button 
                      variant="outline-secondary" 
                      size="sm" 
                      onClick={() => handleEdit(task)}
                      style={{ borderRadius: '8px', borderColor: '#dee2e6', color: '#6c757d' }}
                    >
                      <FaEdit />
                    </Button>
                    <Button 
                      variant="outline-danger" 
                      size="sm" 
                      onClick={() => handleDelete(task._id)}
                      style={{ borderRadius: '8px' }}
                    >
                      <FaTrash />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </Col>
        </Row>
      )}

      {/* Modal for Create/Edit Task */}
      <Modal show={showModal} onHide={() => { setShowModal(false); resetForm(); }} className="modal-custom" centered size="lg">
        <Modal.Header closeButton style={{ borderBottom: '2px solid #f5f5f4' }}>
          <Modal.Title style={{ color: '#495057' }}>{editingTask ? 'Edit Task' : 'Create New Task'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label style={{ color: '#495057', fontWeight: '500' }}>Title *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter task title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
                style={{ borderRadius: '10px', border: '2px solid #dee2e6' }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ color: '#495057', fontWeight: '500' }}>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter task description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                style={{ borderRadius: '10px', border: '2px solid #dee2e6' }}
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ color: '#495057', fontWeight: '500' }}>Priority</Form.Label>
                  <Form.Select
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                    style={{ borderRadius: '10px', border: '2px solid #dee2e6' }}
                  >
                    <option value="low">🟢 Low</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="high">🟠 High</option>
                    <option value="urgent">🔴 Urgent</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ color: '#495057', fontWeight: '500' }}>Category</Form.Label>
                  <Form.Select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    style={{ borderRadius: '10px', border: '2px solid #dee2e6' }}
                  >
                    <option value="work">💼 Work</option>
                    <option value="personal">🧘 Personal</option>
                    <option value="health">💪 Health</option>
                    <option value="finance">💰 Finance</option>
                    <option value="relationships">💝 Relationships</option>
                    <option value="other">📋 Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label style={{ color: '#495057', fontWeight: '500' }}>Due Date</Form.Label>
              <Form.Control
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                style={{ borderRadius: '10px', border: '2px solid #dee2e6' }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Set Reminder"
                checked={formData.reminder}
                onChange={(e) => setFormData({...formData, reminder: e.target.checked})}
                style={{ color: '#495057' }}
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
              {editingTask ? 'Update Task' : 'Create Task'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}

// Main export with MainLayout wrapper
export default function TasksPage() {
  return (
    <MainLayout>
      <TasksContent />
    </MainLayout>
  );
}