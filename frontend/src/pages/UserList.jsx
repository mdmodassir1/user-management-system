import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newUser, setNewUser] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    role: 'user', 
    status: 'active' 
  });
  
  const { isAdmin, isManager, user: currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, [search, roleFilter, statusFilter, currentPage]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = { 
        page: currentPage,
        limit: 10,
        search, 
        role: roleFilter, 
        status: statusFilter 
      };
      const response = await userService.getAll(params);
      setUsers(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async (id) => {
    if (window.confirm('Deactivate this user? They will not be able to login.')) {
      try {
        await userService.deactivate(id);
        toast.success('User deactivated successfully');
        fetchUsers();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to deactivate');
      }
    }
  };

  const handleDeletePermanent = async (id, name) => {
    if (window.confirm(`Permanently delete ${name}? This action cannot be undone.`)) {
      try {
        await userService.deletePermanent(id);
        toast.success('User deleted permanently');
        fetchUsers();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newUser.password || newUser.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    try {
      await userService.create(newUser);
      toast.success('User created successfully');
      setShowCreateModal(false);
      setNewUser({ name: '', email: '', password: '', role: 'user', status: 'active' });
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create user');
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchUsers();
  };

  const getRoleBadge = (role) => {
    const colors = {
      admin: { bg: '#fee2e2', color: '#991b1b', label: 'Admin' },
      manager: { bg: '#fed7aa', color: '#92400e', label: 'Manager' },
      user: { bg: '#d1fae5', color: '#065f46', label: 'User' }
    };
    const style = colors[role] || colors.user;
    return (
      <span style={{
        background: style.bg,
        color: style.color,
        padding: '0.25rem 0.5rem',
        borderRadius: '4px',
        fontSize: '0.75rem',
        fontWeight: 'bold'
      }}>
        {style.label}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    return status === 'active'
      ? <span style={{ color: '#10b981', fontWeight: 'bold' }}>🟢 Active</span>
      : <span style={{ color: '#ef4444', fontWeight: 'bold' }}>🔴 Inactive</span>;
  };

  // Check if user can be edited by current user
  const canEdit = (user) => {
    if (isAdmin) return true;
    if (isManager && user.role !== 'admin') return true;
    return false;
  };

  // Filter users based on role
  const visibleUsers = currentUser?.role === 'admin' 
    ? users 
    : users.filter(u => u.role !== 'admin');

  if (loading) return (
    <>
      <Navbar />
      <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
    </>
  );

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <div style={{
          background: 'white',
          borderRadius: '8px',
          padding: '1.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h2 style={{ margin: 0 }}>User Management</h2>
            {isAdmin && (
              <button
                onClick={() => setShowCreateModal(true)}
                style={{
                  background: '#2563eb',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                + Create User
              </button>
            )}
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              style={{
                flex: 2,
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                minWidth: '200px'
              }}
            />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '6px' }}
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="user">User</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '6px' }}
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <button
              onClick={handleSearch}
              style={{
                background: '#2563eb',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Search
            </button>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Name</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Email</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Role</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Status</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleUsers.map(user => (
                  <tr key={user._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '0.75rem' }}>{user.name}</td>
                    <td style={{ padding: '0.75rem' }}>{user.email}</td>
                    <td style={{ padding: '0.75rem' }}>{getRoleBadge(user.role)}</td>
                    <td style={{ padding: '0.75rem' }}>{getStatusBadge(user.status)}</td>
                    <td style={{ padding: '0.75rem' }}>
                      {/* View button - everyone can view */}
                      <button
                        onClick={() => navigate(`/users/${user._id}`)}
                        style={{
                          background: '#2563eb',
                          color: 'white',
                          border: 'none',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          marginRight: '0.5rem',
                          fontSize: '0.75rem'
                        }}
                      >
                        View
                      </button>
                      
                      {/* Edit button - Admin can edit all, Manager can edit non-admin users */}
                      {canEdit(user) && (
                        <button
                          onClick={() => navigate(`/users/${user._id}/edit`)}
                          style={{
                            background: '#10b981',
                            color: 'white',
                            border: 'none',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            marginRight: '0.5rem',
                            fontSize: '0.75rem'
                          }}
                        >
                          Edit
                        </button>
                      )}
                      
                      {/* Deactivate button - Admin only */}
                      {isAdmin && user.role !== 'admin' && user.status === 'active' && (
                        <button
                          onClick={() => handleDeactivate(user._id)}
                          style={{
                            background: '#f59e0b',
                            color: 'white',
                            border: 'none',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            marginRight: '0.5rem',
                            fontSize: '0.75rem'
                          }}
                        >
                          Deactivate
                        </button>
                      )}
                      
                      {/* Delete button - Admin only */}
                      {isAdmin && user.role !== 'admin' && user.status === 'inactive' && (
                        <button
                          onClick={() => handleDeletePermanent(user._id, user.name)}
                          style={{
                            background: '#dc2626',
                            color: 'white',
                            border: 'none',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.75rem'
                          }}
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {visibleUsers.length === 0 && (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                No users found
              </div>
            )}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '0.5rem',
              marginTop: '1.5rem',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={() => setCurrentPage(pagination.page - 1)}
                disabled={!pagination.hasPrev}
                style={{
                  padding: '0.5rem 1rem',
                  border: '1px solid #d1d5db',
                  background: 'white',
                  borderRadius: '6px',
                  cursor: pagination.hasPrev ? 'pointer' : 'not-allowed',
                  opacity: pagination.hasPrev ? 1 : 0.5
                }}
              >
                ← Previous
              </button>
              
              {[...Array(pagination.pages)].map((_, i) => {
                const pageNum = i + 1;
                if (
                  pageNum === 1 ||
                  pageNum === pagination.pages ||
                  Math.abs(pageNum - pagination.page) <= 1
                ) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      style={{
                        padding: '0.5rem 1rem',
                        border: '1px solid #d1d5db',
                        background: pagination.page === pageNum ? '#2563eb' : 'white',
                        color: pagination.page === pageNum ? 'white' : '#374151',
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      {pageNum}
                    </button>
                  );
                } else if (
                  (pageNum === 2 && pagination.page > 3) ||
                  (pageNum === pagination.pages - 1 && pagination.page < pagination.pages - 2)
                ) {
                  return <span key={pageNum} style={{ padding: '0.5rem' }}>...</span>;
                }
                return null;
              })}
              
              <button
                onClick={() => setCurrentPage(pagination.page + 1)}
                disabled={!pagination.hasNext}
                style={{
                  padding: '0.5rem 1rem',
                  border: '1px solid #d1d5db',
                  background: 'white',
                  borderRadius: '6px',
                  cursor: pagination.hasNext ? 'pointer' : 'not-allowed',
                  opacity: pagination.hasNext ? 1 : 0.5
                }}
              >
                Next →
              </button>
            </div>
          )}

          {/* Showing info */}
          {pagination.total > 0 && (
            <div style={{
              textAlign: 'center',
              marginTop: '1rem',
              fontSize: '0.875rem',
              color: '#6b7280'
            }}>
              Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
              {pagination.total} users
            </div>
          )}
        </div>
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '8px',
            padding: '1.5rem',
            maxWidth: '450px',
            width: '90%'
          }}>
            <h3 style={{ margin: '0 0 1rem 0' }}>Create New User</h3>
            <form onSubmit={handleCreateUser}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 'bold' }}>Full Name *</label>
                <input
                  type="text"
                  required
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '6px' }}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 'bold' }}>Email *</label>
                <input
                  type="email"
                  required
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '6px' }}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 'bold' }}>Password *</label>
                <input
                  type="password"
                  required
                  minLength="6"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  placeholder="Minimum 6 characters"
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '6px' }}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 'bold' }}>Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '6px' }}
                >
                  <option value="user">User</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 'bold' }}>Status</label>
                <select
                  value={newUser.status}
                  onChange={(e) => setNewUser({ ...newUser, status: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '6px' }}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <button type="submit" style={{
                  background: '#2563eb',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}>
                  Create User
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  style={{
                    background: '#9ca3af',
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
      )}
    </>
  );
};

export default UserList;