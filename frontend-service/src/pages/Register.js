import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../config/api';
import { toast } from 'react-toastify';

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f2f5',
  },
  card: {
    backgroundColor: '#fff',
    padding: '2.5rem',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '420px',
  },
  title: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: '0.5rem',
  },
  subtitle: {
    color: '#666',
    marginBottom: '2rem',
  },
  input: {
    width: '100%',
    padding: '0.75rem 1rem',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '1rem',
    marginBottom: '1rem',
    outline: 'none',
  },
  button: {
    width: '100%',
    padding: '0.85rem',
    backgroundColor: '#e94560',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 'bold',
    marginTop: '0.5rem',
  },
  link: {
    display: 'block',
    textAlign: 'center',
    marginTop: '1.5rem',
    color: '#e94560',
    fontSize: '0.9rem',
  },
};

const Register = () => {
  const [form, setForm] = useState({ email: '', password: '', role: 'user' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authAPI.post('/api/auth/register', form);
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Create Account</h1>
        <p style={styles.subtitle}>Join NexaCore today</p>
        <form onSubmit={handleSubmit}>
          <input
            style={styles.input}
            type="email"
            name="email"
            placeholder="Email address"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            style={styles.input}
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <select
            style={styles.input}
            name="role"
            value={form.role}
            onChange={handleChange}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <Link to="/login" style={styles.link}>
          Already have an account? Sign in
        </Link>
      </div>
    </div>
  );
};

export default Register;