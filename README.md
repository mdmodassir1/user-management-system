# User Management System - MERN Stack

A full-stack user management system with Role-Based Access Control (RBAC), built with MERN stack (MongoDB, Express.js, React.js, Node.js).

## 🚀 Live Demo

- **Frontend:** [https://your-frontend-url.vercel.app](https://your-frontend-url.vercel.app)
- **Backend API:** [https://your-backend-url.onrender.com](https://your-backend-url.onrender.com)

## 📋 Features

### Authentication & Authorization
- ✅ JWT-based authentication
- ✅ Role-Based Access Control (Admin, Manager, User)
- ✅ Secure password hashing with bcrypt
- ✅ Protected API endpoints

### Admin Capabilities
- ✅ View paginated, searchable list of all users
- ✅ Filter users by role and status
- ✅ Create new users (with password)
- ✅ Edit existing users (name, email, role, status)
- ✅ Deactivate users (soft delete)
- ✅ Permanently delete users
- ✅ View audit information (createdBy/updatedBy)

### Manager Capabilities
- ✅ View list of users (admin users hidden)
- ✅ View user details (non-admin only)
- ✅ Edit user details (name, email only)

### User Capabilities
- ✅ View own profile
- ✅ Update own profile (name, password)
- ✅ Cannot change own role
- ✅ Cannot view other users' profiles

### Audit & Security
- ✅ Track createdAt, updatedAt timestamps
- ✅ Track createdBy, updatedBy user references
- ✅ Input validation on all endpoints
- ✅ Environment variables for secrets
- ✅ Soft delete (deactivate) functionality

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, React Router v6, Context API, Axios |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas |
| **Authentication** | JWT, bcryptjs |
| **Styling** | CSS Custom |
| **Deployment** | Vercel (Frontend), Render (Backend) |

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account (or local MongoDB)
- Git

### Step 1: Clone Repository

```bash
git clone https://github.com/your-username/user-management-system.git
cd user-management-system