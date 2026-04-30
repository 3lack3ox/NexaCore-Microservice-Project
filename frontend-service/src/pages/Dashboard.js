import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { adminAPI, notificationsAPI } from '../config/api';
import { useAuth } from '../context/AuthContext';
import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

const styles = {
  page: { minHeight: '100vh', backgroundColor: '#f0f2f5' },
  content: { padding: '2rem' },
  welcome: { fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#1a1a2e' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' },
  card: { backgroundColor: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.07)' },
  cardLabel: { color: '#666', fontSize: '0.85rem', marginBottom: '0.5rem' },
  cardValue: { fontSize: '2rem', fontWeight: 'bold', color: '#1a1a2e' },
  cardAccent: { fontSize: '2rem', fontWeight: 'bold', color: '#e94560' },
  chartCard: { backgroundColor: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.07)' },
  chartTitle: { fontSize: '1rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1a1a2e' },
};

const placeholderData = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 600 },
  { name: 'Mar', value: 500 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 750 },
  { name: 'Jun', value: 900 },
];

const Dashboard = () => {
  const { user } = useAuth();
  const [overview, setOverview] = useState(null);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (user?.role === 'admin') {
      adminAPI.get('/api/admin/dashboard')
        .then((res) => setOverview(res.data.overview))
        .catch(() => {});
    }
    notificationsAPI.get('/api/notifications/unread')
      .then((res) => setUnread(res.data.length))
      .catch(() => {});
  }, [user]);

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.content}>
        <p style={styles.welcome}>
          Welcome back, {user?.email} 👋
        </p>

        {/* Stats */}
        <div style={styles.grid}>
          <div style={styles.card}>
            <p style={styles.cardLabel}>Unread Notifications</p>
            <p style={styles.cardAccent}>{unread}</p>
          </div>
          {overview && (
            <>
              <div style={styles.card}>
                <p style={styles.cardLabel}>Total Users</p>
                <p style={styles.cardValue}>{overview.totalUsers}</p>
              </div>
              <div style={styles.card}>
                <p style={styles.cardLabel}>Total Payments</p>
                <p style={styles.cardValue}>{overview.totalPayments}</p>
              </div>
              <div style={styles.card}>
                <p style={styles.cardLabel}>Total Revenue</p>
                <p style={styles.cardAccent}>${overview.revenue?.toFixed(2)}</p>
              </div>
              <div style={styles.card}>
                <p style={styles.cardLabel}>Total Invoices</p>
                <p style={styles.cardValue}>{overview.totalInvoices}</p>
              </div>
            </>
          )}
        </div>

        {/* Chart */}
        <div style={styles.chartCard}>
          <p style={styles.chartTitle}>Platform Activity (Sample)</p>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={placeholderData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#e94560"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;