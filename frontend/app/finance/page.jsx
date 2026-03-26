'use client';

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Modal, Badge } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaMoneyBillWave, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { financeAPI } from '@/utils/api';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import EmptyState from '@/components/common/EmptyState';
import FinanceSummary from '@/components/finance/FinanceSummary';
import MainLayout from '@/components/layout/MainLayout';
import toast from 'react-hot-toast';

function FinanceContent() {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [formData, setFormData] = useState({
    amount: '',
    type: 'expense',
    category: 'other',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [transactionsRes, summaryRes] = await Promise.all([
        financeAPI.getAll({ limit: 50 }),
        financeAPI.getSummary()
      ]);
      setTransactions(transactionsRes.data);
      setSummary(summaryRes.data);
    } catch (error) {
      toast.error('Failed to fetch financial data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTransaction) {
        await financeAPI.update(editingTransaction._id, formData);
        toast.success('Transaction updated');
      } else {
        await financeAPI.create(formData);
        toast.success('Transaction added');
      }
      setShowModal(false);
      resetForm();
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await financeAPI.delete(id);
        toast.success('Transaction deleted');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete transaction');
      }
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      amount: transaction.amount,
      type: transaction.type,
      category: transaction.category,
      description: transaction.description || '',
      date: transaction.date.split('T')[0]
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingTransaction(null);
    setFormData({
      amount: '',
      type: 'expense',
      category: 'other',
      description: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const getCategoryIcon = (category) => {
    const icons = {
      food: '🍔',
      transport: '🚗',
      entertainment: '🎬',
      bills: '📄',
      salary: '💼',
      shopping: '🛍️',
      health: '💊',
      education: '📚',
      other: '💰'
    };
    return icons[category] || '💰';
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Container fluid>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold" style={{ color: '#495057' }}>Finance Tracker</h2>
          <p style={{ color: '#6c757d' }}>Track your income and expenses</p>
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
          <FaPlus className="me-2" /> Add Transaction
        </Button>
      </div>

      {summary && <FinanceSummary summary={summary} />}

      <Card className="shadow-sm mt-4" style={{ borderRadius: '20px', border: 'none' }}>
        <Card.Body>
          <Card.Title className="mb-3" style={{ color: '#495057' }}>Recent Transactions</Card.Title>
          
          {transactions.length === 0 ? (
            <EmptyState
              icon="💰"
              title="No transactions yet"
              message="Start tracking your finances by adding your first transaction"
              actionText="Add Transaction"
              onAction={() => setShowModal(true)}
            />
          ) : (
            <div className="table-responsive">
              <Table hover style={{ borderRadius: '12px', overflow: 'hidden' }}>
                <thead style={{ backgroundColor: '#f5f5f4' }}>
                  <tr>
                    <th style={{ color: '#495057', fontWeight: '600' }}>Date</th>
                    <th style={{ color: '#495057', fontWeight: '600' }}>Description</th>
                    <th style={{ color: '#495057', fontWeight: '600' }}>Category</th>
                    <th style={{ color: '#495057', fontWeight: '600' }}>Type</th>
                    <th style={{ color: '#495057', fontWeight: '600' }}>Amount</th>
                    <th style={{ color: '#495057', fontWeight: '600' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map(transaction => (
                    <tr key={transaction._id} style={{ borderBottom: '1px solid #dee2e6' }}>
                      <td style={{ color: '#495057' }}>{new Date(transaction.date).toLocaleDateString()}</td>
                      <td style={{ color: '#6c757d' }}>{transaction.description || '-'}</td>
                      <td>
                        <Badge 
                          style={{ 
                            backgroundColor: '#f5f5f4', 
                            color: '#495057',
                            padding: '6px 12px',
                            borderRadius: '20px',
                            fontWeight: '500'
                          }}
                        >
                          {getCategoryIcon(transaction.category)} {transaction.category}
                        </Badge>
                      </td>
                      <td>
                        {transaction.type === 'income' ? (
                          <Badge style={{ backgroundColor: '#d1fae5', color: '#065f46', padding: '6px 12px', borderRadius: '20px' }}>
                            <FaArrowUp className="me-1" size={12} /> Income
                          </Badge>
                        ) : (
                          <Badge style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '6px 12px', borderRadius: '20px' }}>
                            <FaArrowDown className="me-1" size={12} /> Expense
                          </Badge>
                        )}
                      </td>
                      <td className={transaction.type === 'income' ? 'text-success' : 'text-danger'} style={{ fontWeight: '600' }}>
                        {transaction.type === 'income' ? '+' : '-'} ₹{transaction.amount.toLocaleString()}
                      </td>
                      <td>
                        <Button 
                          variant="outline-secondary" 
                          size="sm" 
                          onClick={() => handleEdit(transaction)} 
                          className="me-2"
                          style={{ borderRadius: '8px', borderColor: '#dee2e6', color: '#6c757d' }}
                        >
                          <FaEdit />
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm" 
                          onClick={() => handleDelete(transaction._id)}
                          style={{ borderRadius: '8px' }}
                        >
                          <FaTrash />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Modal for Add/Edit Transaction */}
      <Modal show={showModal} onHide={() => { setShowModal(false); resetForm(); }} className="modal-custom" centered>
        <Modal.Header closeButton style={{ borderBottom: '2px solid #f5f5f4' }}>
          <Modal.Title style={{ color: '#495057' }}>{editingTransaction ? 'Edit Transaction' : 'Add Transaction'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label style={{ color: '#495057', fontWeight: '500' }}>Amount *</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter amount"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                required
                style={{ borderRadius: '10px', border: '2px solid #dee2e6' }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ color: '#495057', fontWeight: '500' }}>Type</Form.Label>
              <div className="d-flex gap-4">
                <Form.Check
                  type="radio"
                  label="Expense"
                  value="expense"
                  checked={formData.type === 'expense'}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  style={{ color: '#495057' }}
                />
                <Form.Check
                  type="radio"
                  label="Income"
                  value="income"
                  checked={formData.type === 'income'}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  style={{ color: '#495057' }}
                />
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ color: '#495057', fontWeight: '500' }}>Category</Form.Label>
              <Form.Select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                style={{ borderRadius: '10px', border: '2px solid #dee2e6' }}
              >
                <option value="food">🍔 Food & Dining</option>
                <option value="transport">🚗 Transportation</option>
                <option value="entertainment">🎬 Entertainment</option>
                <option value="bills">📄 Bills & Utilities</option>
                <option value="shopping">🛍️ Shopping</option>
                <option value="health">💊 Health & Wellness</option>
                <option value="education">📚 Education</option>
                <option value="salary">💼 Salary</option>
                <option value="other">💰 Other</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ color: '#495057', fontWeight: '500' }}>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                style={{ borderRadius: '10px', border: '2px solid #dee2e6' }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ color: '#495057', fontWeight: '500' }}>Date</Form.Label>
              <Form.Control
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                required
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
              {editingTransaction ? 'Update' : 'Add'} Transaction
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}

// Main export with MainLayout wrapper
export default function FinancePage() {
  return (
    <MainLayout>
      <FinanceContent />
    </MainLayout>
  );
}