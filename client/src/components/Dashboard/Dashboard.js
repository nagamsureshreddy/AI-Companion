import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFavorite, setNewFavorite] = useState({
    title: '',
    description: '',
    itemType: 'other',
    tags: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadConversations();
    loadFavorites();
  }, []);

  const loadConversations = async () => {
    try {
      const res = await axios.get('/api/ai/conversations');
      setConversations(res.data.data.conversations);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = async () => {
    try {
      const res = await axios.post('/api/ai/conversations', {
        title: 'New Conversation'
      });
      navigate(`/chat/${res.data.data.conversation._id}`);
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  const loadFavorites = async () => {
    try {
      const res = await axios.get('/api/favorites');
      setFavorites(res.data.data.favorites);
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const handleAddFavorite = async (e) => {
    e.preventDefault();
    try {
      const tagsArray = newFavorite.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      const res = await axios.post('/api/favorites', {
        title: newFavorite.title,
        description: newFavorite.description,
        itemType: newFavorite.itemType,
        tags: tagsArray
      });
      
      setFavorites([res.data.data.favorite, ...favorites]);
      setShowAddModal(false);
      setNewFavorite({ title: '', description: '', itemType: 'other', tags: '' });
    } catch (error) {
      console.error('Error adding favorite:', error);
      alert('Failed to add favorite. Please try again.');
    }
  };

  const handleDeleteFavorite = async (id) => {
    if (!window.confirm('Are you sure you want to delete this favorite?')) {
      return;
    }
    
    try {
      await axios.delete(`/api/favorites/${id}`);
      setFavorites(favorites.filter(fav => fav._id !== id));
    } catch (error) {
      console.error('Error deleting favorite:', error);
      alert('Failed to delete favorite. Please try again.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>AI Companion</h1>
          <div className="user-section">
            <span className="user-name">Welcome, {user?.name}</span>
            <button onClick={handleLogout} className="btn btn-secondary">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-content">
          <div className="welcome-section">
            <h2>Your AI Assistant</h2>
            <p>Start a new conversation or continue from where you left off</p>
            <button onClick={handleNewChat} className="btn btn-primary btn-large">
              + New Conversation
            </button>
          </div>

          <div className="favorites-section">
            <div className="section-header">
              <h3>⭐ Your Favorites</h3>
              <button onClick={() => setShowAddModal(true)} className="btn btn-primary btn-small">
                + Add Favorite
              </button>
            </div>
            {favorites.length > 0 ? (
              <div className="favorites-grid">
                {favorites.map((fav) => (
                  <div
                    key={fav._id}
                    className="favorite-card"
                  >
                    <div className="favorite-header">
                      <h4>{fav.title}</h4>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <span className="favorite-type">{fav.itemType}</span>
                        <button 
                          onClick={() => handleDeleteFavorite(fav._id)}
                          className="delete-btn"
                          title="Delete favorite"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                    {fav.description && (
                      <p className="favorite-description">{fav.description}</p>
                    )}
                    {fav.tags && fav.tags.length > 0 && (
                      <div className="favorite-tags">
                        {fav.tags.map((tag, index) => (
                          <span key={index} className="tag">{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>No favorites yet. Click "Add Favorite" to get started!</p>
              </div>
            )}
          </div>

          {/* Add Favorite Modal */}
          {showAddModal && (
            <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h3>Add New Favorite</h3>
                <form onSubmit={handleAddFavorite}>
                  <div className="form-group">
                    <label>Title *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newFavorite.title}
                      onChange={(e) => setNewFavorite({ ...newFavorite, title: e.target.value })}
                      required
                      placeholder="Enter title"
                    />
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={newFavorite.description}
                      onChange={(e) => setNewFavorite({ ...newFavorite, description: e.target.value })}
                      placeholder="Enter description"
                    />
                  </div>

                  <div className="form-group">
                    <label>Type</label>
                    <select
                      className="form-control"
                      value={newFavorite.itemType}
                      onChange={(e) => setNewFavorite({ ...newFavorite, itemType: e.target.value })}
                    >
                      <option value="conversation">Conversation</option>
                      <option value="message">Message</option>
                      <option value="prompt">Prompt</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Tags (comma separated)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newFavorite.tags}
                      onChange={(e) => setNewFavorite({ ...newFavorite, tags: e.target.value })}
                      placeholder="e.g., important, work, personal"
                    />
                  </div>

                  <div className="modal-buttons">
                    <button type="submit" className="btn btn-primary">Add Favorite</button>
                    <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="conversations-section">
            <h3>Recent Conversations</h3>
            {loading ? (
              <div className="loading">
                <div className="spinner"></div>
              </div>
            ) : conversations.length > 0 ? (
              <div className="conversations-grid">
                {conversations.map((conv) => (
                  <div
                    key={conv._id}
                    className="conversation-card"
                    onClick={() => navigate(`/chat/${conv._id}`)}
                  >
                    <h4>{conv.title}</h4>
                    <p className="conversation-meta">
                      {conv.messages.length} messages
                    </p>
                    <p className="conversation-date">
                      {new Date(conv.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>No conversations yet. Start your first chat!</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

