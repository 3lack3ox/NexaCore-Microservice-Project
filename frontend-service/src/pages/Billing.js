import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { billingAPI } from '../config/api';
import { toast } from 'react-toastify';

const styles = {
  page: { minHeight: '100vh', backgroundColor: '#f0f2f5' },
  content: { padding: '2rem' },
  title: { fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#1a1a2e' },
  card: { backgroundColor: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.07)', marginBottom: '1.5rem' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '0.75rem', borderBottom: '2px solid #f0f2f5', color: '#666', fontSize: '0.85rem' },
  td: { padding: '0.75rem', borderBottom: '1px solid #f0f2f5', fontSize: '0.95rem' },
  badge: (status) => ({
    padding: '0.25rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: 'bold',
    backgroundColor:
      status === 'paid' ? '#d4edda' :
      status === 'pending' ? '#fff3cd' :
      status === 'overdue' ? '#f8d7da' : '#e2e3e5',
    color:
      status === 'paid' ? '#155724' :
      status === 'pending' ? '#856404' :
      status === 'overdue' ? '#721c24' : '#383d41',
  }),
};

const Billing = () => {
  const [invoices, setInvoices] = useState([]);
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    billingAPI.get('/api/billing/invoices')
      .then((res) => setInvoices(res.data))
      .catch(() => {});

    billingAPI.get('/api/billing/plans')
      .then((res) => setPlans(res.data))
      .catch(() => {});
  }, []);

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.content}>
        <h2 style={styles.title}>Billing & Invoices</h2>

        {/* Plans */}
        <div style={styles.card}>
          <h3 style={{ marginBottom: '1rem', color: '#1a1a2e' }}>Available Plans</h3>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {plans.map((plan) => (
              <div key={plan.id} style={{ border: '1px solid #ddd', borderRadius: '10px', padding: '1rem', minWidth: '180px' }}>
                <p style={{ fontWeight: 'bold', color: '#1a1a2e' }}>{plan.name}</p>
                <p style={{ color: '#e94560', fontSize: '1.3rem', fontWeight: 'bold' }}>
                  ${plan.price}/{plan.billingCycle === 'monthly' ? 'mo' : 'yr'}
                </p>
              </div>
            ))}
            {plans.length === 0 && <p style={{ color: '#666' }}>No plans available.</p>}
          </div>
        </div>

        {/* Invoices */}
        <div style={styles.card}>
          <h3 style={{ marginBottom: '1rem', color: '#1a1a2e' }}>My Invoices</h3>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Invoice #</th>
                <th style={styles.th}>Amount</th>
                <th style={styles.th}>Due Date</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id}>
                  <td style={styles.td}>{inv.invoiceNumber}</td>
                  <td style={styles.td}>{inv.currency} {inv.amount}</td>
                  <td style={styles.td}>{new Date(inv.dueDate).toLocaleDateString()}</td>
                  <td style={styles.td}>
                    <span style={styles.badge(inv.status)}>{inv.status}</span>
                  </td>
                </tr>
              ))}
              {invoices.length === 0 && (
                <tr><td style={styles.td} colSpan={4}>No invoices found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Billing;