'use client';

import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { Toaster } from 'react-hot-toast';

const MainLayout = ({ children }) => {
  return (
    <div style={{ minHeight: '100vh' }}>
      <Toaster position="top-right" />
      <Container fluid style={{ padding: '15px' }}>
        <Row>
          <Col lg={3} xl={2} className="d-none d-lg-block">
            <Sidebar />
          </Col>
          <Col lg={9} xl={10}>
            <Navbar />
            <div className="fade-in">
              {children}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default MainLayout;