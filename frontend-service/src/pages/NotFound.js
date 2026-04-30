import React from 'react';
import { Link } from 'react-router-dom';

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f2f5',
  },
  code: { fontSize: '6rem', fontWeight: 'bold', color: '#e94560', lineHeight: 1 },
  title: { fontSize: '1.5rem', color: '#1a1a2e', margin: '1rem 0' },
  link: {
    marginTop: '1rem',
    padding: '0.75rem 2rem',
    backgroundColor: '#e94560',
    color: '#fff',
    borderRadius: '8px',
    fontWeight: 'bold',
    fontSize: '0.95rem',
  },
};

const NotFound = () => (
  <div style={styles.container}>
    <p style={styles.code}>404</p>
    <p style={styles.title}>Page not found</p>
    <Link to="/" style={styles.link}>Go Home</Link>
  </div>
);

export default NotFound;