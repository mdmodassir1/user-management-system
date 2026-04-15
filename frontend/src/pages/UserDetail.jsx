import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { userService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';

const UserDetail = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const response = await userService.getById(id);
      setUser(response.data.data);
      setFormData(response.data.data);
    } catch (error) {
      console.error('Error fetching user:', error);
      navigate('/users');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await userService.update(id, formData);
      toast.success('User updated successfully');
      setEditing(false);
      fetchUser();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  if (loading) return <Loader />;
  if (!user) return null;

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>User Details</h2>
            {isAdmin && !editing && (
              <button className="btn btn-primary" onClick={() => setEditing(true)}>
                Edit User
              </button>
            )}
          </div>

          {editing ? (
            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="user">User</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="submit" className="btn btn-primary">Save</button>
                <button type="button" className="btn btn-danger" onClick={() => setEditing(false)}>Cancel</button>
              </div>
            </form>
          ) : (
            <div>
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Role:</strong> {user.role}</p>
              <p><strong>Status:</strong> {user.status}</p>
              <hr />
              <h4>Audit Information</h4>
              <p><strong>Created At:</strong> {new Date(user.createdAt).toLocaleString()}</p>
              <p><strong>Created By:</strong> {user.createdBy?.name || 'System'}</p>
              <p><strong>Last Updated:</strong> {new Date(user.updatedAt).toLocaleString()}</p>
              <p><strong>Last Updated By:</strong> {user.updatedBy?.name || 'N/A'}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UserDetail;