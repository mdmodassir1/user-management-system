import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { userService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';

const EditUser = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const { isAdmin, isManager, user: currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const response = await userService.getById(id);
      const userData = response.data.data;
      setUser(userData);
      setFormData({ name: userData.name, email: userData.email });
    } catch (error) {
      toast.error('Failed to fetch user');
      navigate('/users');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await userService.update(id, formData);
      toast.success('User updated successfully');
      navigate(`/users/${id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update user');
    }
  };

  if (loading) return (
    <>
      <Navbar />
      <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
    </>
  );

  if (!user) return null;

  // Check permissions
  if (isManager && user.role === 'admin') {
    return (
      <>
        <Navbar />
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h2>Access Denied</h2>
          <p>Managers cannot edit admin users.</p>
          <button onClick={() => navigate('/users')}>Back to Users</button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
        <div style={{
          background: 'white',
          borderRadius: '8px',
          padding: '1.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ margin: '0 0 1rem 0' }}>Edit User</h2>
          
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 'bold' }}>Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '6px' }}
              />
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 'bold' }}>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '6px' }}
              />
            </div>
            
            {/* Role field - Disabled for everyone, only admin can change via separate page */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 'bold', color: '#6b7280' }}>Role</label>
              <input
                type="text"
                value={user.role}
                disabled
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '6px', background: '#f3f4f6' }}
              />
              {isManager && (
                <small style={{ fontSize: '0.75rem', color: '#6b7280' }}>Managers cannot change user roles</small>
              )}
            </div>
            
            {/* Status field - Only admin can see */}
            {isAdmin && (
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 'bold' }}>Status</label>
                <select
                  value={user.status}
                  onChange={(e) => setUser({ ...user, status: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '6px' }}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            )}
            
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="submit" style={{
                background: '#2563eb',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                cursor: 'pointer'
              }}>
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => navigate(`/users/${id}`)}
                style={{
                  background: '#6b7280',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditUser;