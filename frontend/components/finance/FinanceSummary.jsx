import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const FinanceSummary = ({ summary = {} }) => {
  // Default values
  const income = summary?.income || 0;
  const expenses = summary?.expenses || 0;
  const balance = summary?.balance || 0;
  const byCategory = summary?.byCategory || {};

  const pieData = {
    labels: Object.keys(byCategory),
    datasets: [
      {
        data: Object.values(byCategory),
        backgroundColor: [
          '#6366f1',
          '#10b981',
          '#f59e0b',
          '#ef4444',
          '#8b5cf6',
          '#ec489a',
          '#14b8a6',
          '#f43f5e'
        ],
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          font: {
            size: 11
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ₹${value.toLocaleString()} (${percentage}%)`;
          }
        }
      }
    }
  };

  const savingsRate = income > 0 ? Math.round((balance / income) * 100) : 0;
  const progressWidth = income > 0 ? Math.min(100, (balance / income) * 100) : 0;

  return (
    <Row>
      <Col md={8}>
        <Card className="shadow-sm mb-4">
          <Card.Body>
            <Card.Title className="mb-3">Financial Overview</Card.Title>
            <Row>
              <Col md={4} className="text-center">
                <div className="p-3">
                  <p className="text-muted mb-1">Total Income</p>
                  <h3 className="text-success mb-0">+₹{income.toLocaleString()}</h3>
                </div>
              </Col>
              <Col md={4} className="text-center">
                <div className="p-3">
                  <p className="text-muted mb-1">Total Expenses</p>
                  <h3 className="text-danger mb-0">-₹{expenses.toLocaleString()}</h3>
                </div>
              </Col>
              <Col md={4} className="text-center">
                <div className="p-3">
                  <p className="text-muted mb-1">Net Balance</p>
                  <h3 className={balance >= 0 ? 'text-success' : 'text-danger'}>
                    ₹{balance.toLocaleString()}
                  </h3>
                </div>
              </Col>
            </Row>
            <div className="mt-3">
              <div className="d-flex justify-content-between align-items-center">
                <span>Savings Rate</span>
                <span className="fw-bold">{savingsRate}%</span>
              </div>
              <div className="progress-custom mt-2" style={{ backgroundColor: '#e5e7eb', borderRadius: '10px' }}>
                <div 
                  className="progress-bar-custom"
                  style={{ 
                    width: `${progressWidth}%`,
                    height: '8px',
                    borderRadius: '10px',
                    background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)'
                  }}
                />
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col md={4}>
        {Object.keys(byCategory).length > 0 && (
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <Card.Title className="mb-3">Expenses by Category</Card.Title>
              <div style={{ height: '280px' }}>
                <Pie data={pieData} options={options} />
              </div>
            </Card.Body>
          </Card>
        )}
      </Col>
    </Row>
  );
};

export default FinanceSummary;