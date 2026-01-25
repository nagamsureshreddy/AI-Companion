import React from 'react';
import { formatDate } from '../utils/helpers';
import './UserCard.css';

const UserCard = ({ user }) => {
  return (
    <div className="user-card">
      <h3>{user.name}</h3>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> <span className="role-badge">{user.role}</span></p>
      <p><strong>Created:</strong> {formatDate(user.createdAt)}</p>
    </div>
  );
};

export default UserCard;

