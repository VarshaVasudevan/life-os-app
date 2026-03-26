'use client';

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert, Button } from 'react-bootstrap';
import { useAuth } from '@/context/AuthContext';
import { goalsAPI, healthAPI, financeAPI, tasksAPI, relationshipsAPI } from '@/utils/api';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import StatsCards from '@/components/dashboard/StatsCards';
import RecentActivity from '@/components/dashboard/RecentActivity';
import ProgressCharts from '@/components/dashboard/ProgressCharts';
import MainLayout from '@/components/layout/MainLayout';
import toast from 'react-hot-toast';

function DashboardContent() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    goals: { total: 0, completed: 0, progress: 0 },
    health: { mood: 0, steps: 0, sleep: 0 },
    finance: { balance: 0, income: 0, expenses: 0 },
    tasks: { total: 0, completed: 0 },
    relationships: { total: 0, upcoming: 0, avgStrength: 0 }
  });
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setError(null);
      
      let goals = [];
      let healthData = [];
      let financeData = {};
      let tasks = [];
      let relationships = [];

      try {
        const goalsRes = await goalsAPI.getAll();
        goals = goalsRes.data || [];
      } catch (err) {
        console.error('Error fetching goals:', err);
      }

      try {
        const healthRes = await healthAPI.getAll({ limit: 7 });
        healthData = healthRes.data || [];
      } catch (err) {
        console.error('Error fetching health data:', err);
      }

      try {
        const financeRes = await financeAPI.getSummary();
        financeData = financeRes.data || {};
      } catch (err) {
        console.error('Error fetching finance data:', err);
      }

      try {
        const tasksRes = await tasksAPI.getAll({ limit: 5 });
        tasks = tasksRes.data || [];
      } catch (err) {
        console.error('Error fetching tasks:', err);
      }

      try {
        const relationshipsRes = await relationshipsAPI.getAll();
        relationships = relationshipsRes.data || [];
      } catch (err) {
        console.error('Error fetching relationships:', err);
      }

      const completedGoals = goals.filter(g => g.status === 'completed');
      const progress = goals.length > 0 
        ? (completedGoals.length / goals.length) * 100 
        : 0;

      const recentHealth = healthData[0] || {};
      const completedTasks = tasks.filter(t => t.status === 'completed');
      
      // Calculate relationship stats
      const upcomingDates = [];
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const next30Days = new Date(today);
      next30Days.setDate(today.getDate() + 30);
      
      relationships.forEach(rel => {
        // Check birthday
        if (rel.birthday) {
          const birthdayDate = new Date(rel.birthday);
          const birthdayThisYear = new Date(today.getFullYear(), birthdayDate.getMonth(), birthdayDate.getDate());
          if (birthdayThisYear >= today && birthdayThisYear <= next30Days) {
            upcomingDates.push(rel);
          }
        }
        // Check anniversary
        if (rel.anniversary) {
          const anniversaryDate = new Date(rel.anniversary);
          const anniversaryThisYear = new Date(today.getFullYear(), anniversaryDate.getMonth(), anniversaryDate.getDate());
          if (anniversaryThisYear >= today && anniversaryThisYear <= next30Days) {
            upcomingDates.push(rel);
          }
        }
      });
      
      const avgStrength = relationships.length > 0 
        ? relationships.reduce((sum, r) => sum + (r.relationshipStrength || 5), 0) / relationships.length 
        : 0;

      setStats({
        goals: {
          total: goals.length,
          completed: completedGoals.length,
          progress: Math.round(progress)
        },
        health: {
          mood: recentHealth.mood || 0,
          steps: recentHealth.steps || 0,
          sleep: recentHealth.sleep?.duration || 0
        },
        finance: {
          balance: financeData.balance || 0,
          income: financeData.income || 0,
          expenses: financeData.expenses || 0
        },
        tasks: {
          total: tasks.length,
          completed: completedTasks.length
        },
        relationships: {
          total: relationships.length,
          upcoming: upcomingDates.length,
          avgStrength: Math.round(avgStrength * 10) / 10
        }
      });

      // Prepare recent activities
      const activities = [];
      
      if (goals.length > 0) {
        goals.slice(0, 2).forEach(g => {
          activities.push({
            id: g._id,
            type: 'goal',
            title: g.title,
            status: g.status,
            time: g.updatedAt ? new Date(g.updatedAt).toLocaleDateString() : new Date().toLocaleDateString()
          });
        });
      }
      
      if (tasks.length > 0) {
        tasks.slice(0, 2).forEach(t => {
          activities.push({
            id: t._id,
            type: 'task',
            title: t.title,
            status: t.status,
            time: t.updatedAt ? new Date(t.updatedAt).toLocaleDateString() : new Date().toLocaleDateString()
          });
        });
      }
      
      if (relationships.length > 0) {
        relationships.slice(0, 2).forEach(r => {
          activities.push({
            id: r._id,
            type: 'relationship',
            title: r.name,
            status: r.lastContact ? 'Contacted recently' : 'No recent contact',
            time: r.lastContact ? new Date(r.lastContact).toLocaleDateString() : 'Never'
          });
        });
      }
      
      // Sort activities by time (most recent first)
      const sortedActivities = activities.sort((a, b) => {
        const dateA = new Date(a.time);
        const dateB = new Date(b.time);
        return dateB - dateA;
      });
      
      setRecentActivities(sortedActivities.slice(0, 5));
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please refresh the page.');
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <Container fluid>
        <Alert variant="danger" className="mt-4">
          <Alert.Heading>Error Loading Dashboard</Alert.Heading>
          <p>{error}</p>
          <hr />
          <div className="d-flex justify-content-end">
            <Button variant="outline-danger" onClick={fetchDashboardData}>
              Retry
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid>
      <div className="mb-4">
        <h2 className="fw-bold" style={{ color: '#495057' }}>Welcome back, {user?.name || 'User'}! 👋</h2>
        <p style={{ color: '#6c757d' }}>Here's your life overview at a glance</p>
      </div>

      <StatsCards stats={stats} />

      <Row className="mt-4">
        <Col lg={8}>
          <Card className="shadow-sm mb-4" style={{ borderRadius: '20px', border: 'none' }}>
            <Card.Body>
              <Card.Title className="mb-3" style={{ color: '#495057' }}>Progress Overview</Card.Title>
              <ProgressCharts stats={stats} />
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card className="shadow-sm mb-4" style={{ borderRadius: '20px', border: 'none' }}>
            <Card.Body>
              <Card.Title className="mb-3" style={{ color: '#495057' }}>Recent Activity</Card.Title>
              {recentActivities.length === 0 ? (
                <p className="text-muted text-center py-4" style={{ color: '#6c757d' }}>No recent activity</p>
              ) : (
                <RecentActivity activities={recentActivities} />
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

// Main export with MainLayout wrapper
export default function DashboardPage() {
  return (
    <MainLayout>
      <DashboardContent />
    </MainLayout>
  );
}