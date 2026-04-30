import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { userAPI } from '../config/api';
import { toast } from 'react-toastify';

const styles = {
  page: { minHeight: '100vh', backgroundColor: '#f0f2f5' },
  content: { padding: '2rem', maxWidth: '600px', margin: '0 auto' },
  card: { backgroundColor: '#fff', padding: '2rem', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.07)' },
  title: { fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#1a1a2e' },
  input: { width: '100%', padding: '0.75rem 1rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem', marginBottom: '1rem' },
  button: { padding: '0.75rem 1.5rem', backgroundColor: '#e94560', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '0.95rem' },
};

const Profile = () => {
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '', address: '', bio: '' });
  const [loading, setLoading] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    userAPI.get('/api/users/me')
      .then((res) => {
        setForm(res.data);
        setHasProfile(true);
      })
      .catch(() => setHasProfile(false));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (hasProfile) {
        await userAPI.put('/api/users/me', form);
        toast.success('Profile updated!');
      } else {
        await userAPI.post('/api/users', form);
        toast.success('Profile created!');
        setHasProfile(true);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.content}>
        <div style={styles.card}>
          <h2 style={styles.title}>My Profile</h2>
          <form onSubmit={handleSubmit}>
            {['firstName', 'lastName', 'phone', 'address', 'bio'].map((field) => (
              <input
                key={field}
                style={styles.input}
                name={field}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={form[field] || ''}
                onChange={handleChange}
              />
            ))}
            <button style={styles.button} type="submit" disabled={loading}>
              {loading ? 'Saving...' : hasProfile ? 'Update Profile' : 'Create Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;