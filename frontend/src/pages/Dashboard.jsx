import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const { user, isAdmin, isManager } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        {/* User Info Card */}
        <div style={{
          background: 'white',
          borderRadius: '8px',
          padding: '1.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: '1.5rem'
        }}>
          <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem' }}>Welcome, {user?.name}!</h1>
          <p style={{ margin: '0.25rem 0', color: '#4b5563' }}>Role: <strong>{user?.role}</strong></p>
          <p style={{ margin: '0.25rem 0', color: '#4b5563' }}>Status: <strong>{user?.status}</strong></p>
          <p style={{ margin: '0.25rem 0', color: '#4b5563' }}>Email: {user?.email}</p>
        </div>

        {/* Quick Actions */}
        <div style={{
          background: 'white',
          borderRadius: '8px',
          padding: '1.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.25rem' }}>Quick Actions</h2>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {(isAdmin || isManager) && (
              <button
                onClick={() => navigate('/users')}
                style={{
                  background: '#2563eb',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Manage Users
              </button>
            )}
            <button
              onClick={() => navigate('/profile')}
              style={{
                background: '#10b981',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Update Profile
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;