import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../config/api';
import { toast } from 'react-toastify';

const styles = {
  nav: {
    backgroundColor: '#1a1a2e',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: '#fff',
  },
  brand: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#e94560',
  },
  links: {
    display: 'flex',
    gap: '1.5rem',
    listStyle: 'none',
  },
  link: {
    color: '#fff',
    fontSize: '0.95rem',
    transition: 'color 0.2s',
  },
  logoutBtn: {
    backgroundColor: '#e94560',
    color: '#fff',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    fontSize: '0.9rem',
  },
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authAPI.post('/api/auth/logout');
    } catch (_) {}
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <span style={styles.brand}>NexaCore</span>
      <ul style={styles.links}>
        <li><Link to="/" style={styles.link}>Dashboard</Link></li>
        <li><Link to="/profile" style={styles.link}>Profile</Link></li>
        <li><Link to="/billing" style={styles.link}>Billing</Link></li>
        <li><Link to="/payments" style={styles.link}>Payments</Link></li>
        <li><Link to="/notifications" style={styles.link}>Notifications</Link></li>
        {user?.role === 'admin' && (
          <li><Link to="/admin" style={styles.link}>Admin</Link></li>
        )}
      </ul>
      <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
    </nav>
  );
};

export default Navbar;