import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { adminAPI } from '../config/api';

const styles = {
  page: { minHeight: '100vh', backgroundColor: '#f0f2f5' },
  content: { padding: '2rem' },
  title: { fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#1a1a2e' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' },
  card: { backgroundColor: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.07)' },
  cardTitle: { fontWeight: 'bold', marginBottom: '1rem', color: '#1a1a2e' },
  serviceRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' },
  serviceName: { fontSize: '0.9rem', color: '#444' },
  dot: (status) => ({
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: status === 'healthy' ? '#28a745' : '#dc3545',
  }),
  statLabel: { color: '#666', fontSize: '0.85rem', marginBottom: '0.25rem' },
  statValue: { fontSize: '1.8rem', fontWeight: 'bold', color: '#1a1a2e' },
  statAccent: { fontSize: '1.8rem', fontWeight: 'bold', color: '#e94560' },
};

const AdminPanel = () => {
  const [overview, setOverview] = useState(null);
  const [services, setServices] = useState([]);

  useEffect(() => {
    adminAPI.get('/api/admin/dashboard')
      .then((res) => setOverview(res.data.overview))
      .catch(() => {});

    adminAPI.get('/api/admin/dashboard/health')
      .then((res) => setServices(res.data.services))
      .catch(() => {});
  }, []);

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.content}>
        <h2 style={styles.title}>Admin Panel</h2>

        {/* Overview Stats */}
        {overview && (
          <div style={styles.grid}>
            <div style={styles.card}>
              <p style={styles.statLabel}>Total Users</p>
              <p style={styles.statValue}>{overview.totalUsers}</p>
            </div>
            <div style={styles.card}>
              <p style={styles.statLabel}>Total Invoices</p>
              <p style={styles.statValue}>{overview.totalInvoices}</p>
            </div>
            <div style={styles.card}>
              <p style={styles.statLabel}>Total Payments</p>
              <p style={styles.statValue}>{overview.totalPayments}</p>
            </div>
            <div style={styles.card}>
              <p style={styles.statLabel}>Total Revenue</p>
              <p style={styles.statAccent}>${overview.revenue?.toFixed(2)}</p>
            </div>
            <div style={styles.card}>
              <p style={styles.statLabel}>Total Events</p>
              <p style={styles.statValue}>{overview.totalEvents}</p>
            </div>
          </div>
        )}

        {/* Service Health */}
        <div style={styles.card}>
          <p style={styles.cardTitle}>Services Health</p>
          {services.map((s) => (
            <div key={s.service} style={styles.serviceRow}>
              <span style={styles.serviceName}>{s.service}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', color: s.status === 'healthy' ? '#28a745' : '#dc3545' }}>
                  {s.status}
                </span>
                <div style={styles.dot(s.status)} />
              </div>
            </div>
          ))}
          {services.length === 0 && (
            <p style={{ color: '#666', fontSize: '0.9rem' }}>Fetching service health...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;