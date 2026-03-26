'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Nav } from 'react-bootstrap';
import { 
  FaHome, FaBullseye, FaHeartbeat, FaMoneyBillWave, 
  FaUsers, FaTasks, FaChartLine 
} from 'react-icons/fa';

const Sidebar = () => {
  const pathname = usePathname();
  
  const navItems = [
    { path: '/dashboard', icon: FaHome, label: 'Dashboard' },
    { path: '/goals', icon: FaBullseye, label: 'Goals' },
    { path: '/health', icon: FaHeartbeat, label: 'Health' },
    { path: '/finance', icon: FaMoneyBillWave, label: 'Finance' },
    { path: '/relationships', icon: FaUsers, label: 'Relationships' },
    { path: '/tasks', icon: FaTasks, label: 'Tasks' },
    { path: '/insights', icon: FaChartLine, label: 'Insights' },
  ];

  return (
    <div className="sidebar">
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <div style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '15px'
        }}>
          <span style={{ fontSize: '32px' }}>🧬</span>
        </div>
        <h5 style={{ fontWeight: 'bold', marginBottom: '5px' }}>Life OS</h5>
        <small style={{ color: '#6c757d' }}>Your Personal Dashboard</small>
      </div>
      
      <Nav className="flex-column">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          
          return (
            <Link href={item.path} key={item.path} passHref legacyBehavior>
              <Nav.Link className={`sidebar-link ${isActive ? 'active' : ''}`} style={{ padding: '12px 16px' }}>
                <Icon size={20} />
                <span>{item.label}</span>
              </Nav.Link>
            </Link>
          );
        })}
      </Nav>
    </div>
  );
};

export default Sidebar;