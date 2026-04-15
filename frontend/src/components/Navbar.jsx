import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAdmin, isManager } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{
      background: 'white',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap'
    }}>
      <Link to="/dashboard" style={{
        fontSize: '1.25rem',
        fontWeight: 'bold',
        color: '#2563eb',
        textDecoration: 'none'
      }}>
        User Management
      </Link>
      
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <Link to="/dashboard" style={{ textDecoration: 'none', color: '#374151' }}>Dashboard</Link>
        
        {(isAdmin || isManager) && (
          <Link to="/users" style={{ textDecoration: 'none', color: '#374151' }}>Users</Link>
        )}
        
        <Link to="/profile" style={{ textDecoration: 'none', color: '#374151' }}>My Profile</Link>
        
        <span style={{
          background: '#e5e7eb',
          padding: '0.25rem 0.75rem',
          borderRadius: '20px',
          fontSize: '0.875rem',
          color: '#374151'
        }}>
          {user?.name} ({user?.role})
        </span>
        
        <button onClick={handleLogout} style={{
          background: '#dc2626',
          color: 'white',
          border: 'none',
          padding: '0.5rem 1rem',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '0.875rem'
        }}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;