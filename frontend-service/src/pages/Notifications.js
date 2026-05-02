import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { notificationsAPI } from '../config/api';
import { toast } from 'react-toastify';

const styles = {
  page: { minHeight: '100vh', backgroundColor: '#f0f2f5' },
  content: { padding: '2rem', maxWidth: '700px', margin: '0 auto' },
  title: { fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#1a1a2e' },
  item: (isRead) => ({
    backgroundColor: isRead ? '#fff' : '#fff8f9',
    border: isRead ? '1px solid #eee' : '1px solid #f8c0c8',
    borderRadius: '10px',
    padding: '1rem 1.25rem',
    marginBottom: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  }),
  itemTitle: { fontWeight: 'bold', color: '#1a1a2e', marginBottom: '0.25rem' },
  itemMsg: { color: '#555', fontSize: '0.9rem' },
  readBtn: {
    backgroundColor: 'transparent',
    border: '1px solid #e94560',
    color: '#e94560',
    borderRadius: '6px',
    padding: '0.3rem 0.75rem',
    fontSize: '0.8rem',
    whiteSpace: 'nowrap',
  },
  markAllBtn: {
    backgroundColor: '#e94560',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '0.5rem 1.25rem',
    fontWeight: 'bold',
    marginBottom: '1.5rem',
    fontSize: '0.9rem',
  },
};

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    notificationsAPI.get('/api/notifications')
      .then((res) => setNotifications(res.data))
      .catch(() => {});
  }, []);

  const markAsRead = async (id) => {
    try {
      await notificationsAPI.patch(`/api/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => n.id === id ? { ...n, isRead: true } : n)
      );
    } catch {
      toast.error('Failed to mark as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationsAPI.patch('/api/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      toast.success('All notifications marked as read');
    } catch {
      toast.error('Failed to mark all as read');
    }
  };

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.content}>
        <h2 style={styles.title}>Notifications</h2>
        {notifications.some((n) => !n.isRead) && (
          <button style={styles.markAllBtn} onClick={markAllAsRead}>
            Mark All as Read
          </button>
        )}
        {notifications.length === 0 && (
          <p style={{ color: '#666' }}>No notifications yet.</p>
        )}
        {notifications.map((n) => (
          <div key={n.id} style={styles.item(n.isRead)}>
            <div>
              <p style={styles.itemTitle}>{n.title}</p>
              <p style={styles.itemMsg}>{n.message}</p>
            </div>
            {!n.isRead && (
              <button style={styles.readBtn} onClick={() => markAsRead(n.id)}>
                Mark Read
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;