import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { paymentsAPI } from '../config/api';

const styles = {
  page: { minHeight: '100vh', backgroundColor: '#f0f2f5' },
  content: { padding: '2rem' },
  title: { fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#1a1a2e' },
  card: { backgroundColor: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.07)' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '0.75rem', borderBottom: '2px solid #f0f2f5', color: '#666', fontSize: '0.85rem' },
  td: { padding: '0.75rem', borderBottom: '1px solid #f0f2f5', fontSize: '0.95rem' },
  badge: (status) => ({
    padding: '0.25rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: 'bold',
    backgroundColor:
      status === 'succeeded' ? '#d4edda' :
      status === 'pending' ? '#fff3cd' :
      status === 'failed' ? '#f8d7da' : '#e2e3e5',
    color:
      status === 'succeeded' ? '#155724' :
      status === 'pending' ? '#856404' :
      status === 'failed' ? '#721c24' : '#383d41',
  }),
};

const Payments = () => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    paymentsAPI.get('/api/payments')
      .then((res) => setPayments(res.data))
      .catch(() => {});
  }, []);

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.content}>
        <h2 style={styles.title}>Payment History</h2>
        <div style={styles.card}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Amount</th>
                <th style={styles.th}>Currency</th>
                <th style={styles.th}>Method</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id}>
                  <td style={styles.td}>{p.amount}</td>
                  <td style={styles.td}>{p.currency?.toUpperCase()}</td>
                  <td style={styles.td}>{p.paymentMethod || 'N/A'}</td>
                  <td style={styles.td}>
                    <span style={styles.badge(p.status)}>{p.status}</span>
                  </td>
                  <td style={styles.td}>{new Date(p.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr><td style={styles.td} colSpan={5}>No payments found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Payments;