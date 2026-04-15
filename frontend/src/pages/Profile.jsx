import React, { useState, useEffect } from 'react';
import { profileService } from '../services/api';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '' });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '' });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await profileService.getMyProfile();
      setProfile(response.data.data);
      setFormData({ name: response.data.data.name });
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await profileService.updateMyProfile(formData);
      toast.success('Profile updated successfully');
      setEditing(false);
      fetchProfile();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    try {
      await profileService.updateMyProfile({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      toast.success('Password changed successfully');
      setPasswordData({ currentPassword: '', newPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    }
  };

  if (loading) return (
    <>
      <Navbar />
      <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
    </>
  );

  if (!profile) return null;

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
        {/* Profile Info - NO ROLE EDIT OPTION */}
        <div style={{
          background: 'white',
          borderRadius: '8px',
          padding: '1.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ margin: 0 }}>My Profile</h2>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                style={{
                  background: '#2563eb',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Edit Profile
              </button>
            )}
          </div>

          {editing ? (
            <form onSubmit={handleUpdateProfile}>
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
              {/* ⚠️ ROLE FIELD IS NOT HERE - User cannot change role */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 'bold', color: '#6b7280' }}>Role</label>
                <input
                  type="text"
                  value={profile.role}
                  disabled
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '6px', background: '#f3f4f6', color: '#6b7280' }}
                />
                <small style={{ fontSize: '0.75rem', color: '#6b7280' }}>Role cannot be changed</small>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button type="submit" style={{
                  background: '#10b981',
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
                  onClick={() => setEditing(false)}
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
          ) : (
            <div>
              <p><strong>Name:</strong> {profile.name}</p>
              <p><strong>Email:</strong> {profile.email}</p>
              <p><strong>Role:</strong> <span style={{
                background: profile.role === 'admin' ? '#fee2e2' : profile.role === 'manager' ? '#fed7aa' : '#d1fae5',
                color: profile.role === 'admin' ? '#991b1b' : profile.role === 'manager' ? '#92400e' : '#065f46',
                padding: '0.25rem 0.5rem',
                borderRadius: '4px',
                fontSize: '0.75rem',
                fontWeight: 'bold'
              }}>{profile.role}</span></p>
              <p><strong>Status:</strong> {profile.status === 'active' ? '🟢 Active' : '🔴 Inactive'}</p>
              <hr style={{ margin: '1rem 0' }} />
              <h4>Audit Information</h4>
              <p><strong>Account Created:</strong> {new Date(profile.createdAt).toLocaleString()}</p>
              <p><strong>Created By:</strong> {profile.createdBy?.name || 'System'}</p>
              <p><strong>Last Updated:</strong> {new Date(profile.updatedAt).toLocaleString()}</p>
              <p><strong>Last Updated By:</strong> {profile.updatedBy?.name || 'N/A'}</p>
            </div>
          )}
        </div>

        {/* Change Password */}
        <div style={{
          background: 'white',
          borderRadius: '8px',
          padding: '1.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 1rem 0' }}>Change Password</h3>
          <form onSubmit={handleChangePassword}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 'bold' }}>Current Password</label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                required
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '6px' }}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 'bold' }}>New Password (min 6 characters)</label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                required
                minLength="6"
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '6px' }}
              />
            </div>
            <button type="submit" style={{
              background: '#2563eb',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              cursor: 'pointer'
            }}>
              Change Password
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Profile;