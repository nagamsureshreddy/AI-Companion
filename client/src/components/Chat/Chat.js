import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import './Chat.css';

const Chat = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [conversation, setConversation] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (id) {
      loadConversation();
    } else {
      createNewConversation();
    }
  }, [id]);

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const createNewConversation = async () => {
    try {
      const res = await axios.post('/api/ai/conversations', {
        title: 'New Conversation'
      });
      navigate(`/chat/${res.data.data.conversation._id}`, { replace: true });
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  const loadConversation = async () => {
    try {
      const res = await axios.get(`/api/ai/conversations/${id}`);
      setConversation(res.data.data.conversation);
    } catch (error) {
      console.error('Error loading conversation:', error);
      navigate('/dashboard');
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || loading) return;

    setLoading(true);
    const userMessage = message;
    setMessage('');

    try {
      const res = await axios.post(`/api/ai/conversations/${id}/messages`, {
        content: userMessage
      });
      setConversation(res.data.data.conversation);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessage(userMessage); // Restore message on error
    } finally {
      setLoading(false);
    }
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  if (!conversation) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <header className="chat-header">
        <button onClick={handleBackToDashboard} className="btn btn-secondary">
          ← Back
        </button>
        <h2>{conversation.title}</h2>
        <div className="user-info">
          {user?.name}
        </div>
      </header>

      <div className="chat-messages">
        {conversation.messages.length === 0 ? (
          <div className="chat-welcome">
            <h3>Start a conversation</h3>
            <p>Ask me anything, I'm here to help!</p>
          </div>
        ) : (
          conversation.messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${msg.role === 'user' ? 'message-user' : 'message-ai'}`}
            >
              <div className="message-avatar">
                {msg.role === 'user' ? '👤' : '🤖'}
              </div>
              <div className="message-content">
                <div className="message-text">{msg.content}</div>
                <div className="message-time">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="message message-ai">
            <div className="message-avatar">🤖</div>
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="chat-input-form">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="chat-input"
          disabled={loading}
        />
        <button
          type="submit"
          className="btn btn-primary"
          disabled={!message.trim() || loading}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;

