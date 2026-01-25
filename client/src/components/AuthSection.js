import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../utils/helpers';
import './AuthSection.css';

const ageGroups = ['13-17', '18-24', '25-34', '35-44', '45-54', '55+'];
const roles = ['author', 'reader'];

const AuthSection = ({ onAuthSuccess, defaultMode = 'signup' }) => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [mode, setMode] = useState(defaultMode); // 'signup' or 'login'
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    userId: '',
    password: '',
    location: '',
    ageGroup: '',
    interests: '',
    role: 'reader',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (mode === 'signup') {
        const res = await register({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          userId: form.userId,
          password: form.password,
          location: form.location,
          ageGroup: form.ageGroup,
          interests: form.interests,
          role: form.role,
        });
        if (res.success) {
          alert('Account created and logged in!');
          onAuthSuccess && onAuthSuccess();
          navigate('/');
        } else {
          alert(res.message || 'Registration failed');
        }
      } else {
        const res = await login({
          identifier: form.userId || form.email,
          password: form.password,
        });
        if (res.success) {
          alert('Login successful!');
          onAuthSuccess && onAuthSuccess();
          navigate('/');
        } else {
          alert(res.message || 'Login failed');
        }
      }
    } catch (error) {
      alert(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-section">
      <div className="auth-container">
        <div className="auth-toggle">
          <button
            className={mode === 'signup' ? 'active' : ''}
            onClick={() => setMode('signup')}
          >
            Create Account
          </button>
          <button
            className={mode === 'login' ? 'active' : ''}
            onClick={() => setMode('login')}
          >
            Login
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>User ID</label>
                  <input
                    name="userId"
                    value={form.userId}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                  />
                </div>
                <div className="form-group">
                  <label>Role</label>
                  <select name="role" value={form.role} onChange={handleChange}>
                    {roles.map((r) => (
                      <option key={r} value={r}>
                        {r.charAt(0).toUpperCase() + r.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Location</label>
                  <input
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="City, Country"
                  />
                </div>
                <div className="form-group">
                  <label>Age Group</label>
                  <select
                    name="ageGroup"
                    value={form.ageGroup}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    {ageGroups.map((age) => (
                      <option key={age} value={age}>
                        {age}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Interests (comma separated)</label>
                <input
                  name="interests"
                  value={form.interests}
                  onChange={handleChange}
                  placeholder="Fantasy, Mystery, AI"
                />
              </div>
            </>
          )}

          {mode === 'login' && (
            <>
              <div className="form-group">
                <label>Email or User ID</label>
                <input
                  name="userId"
                  value={form.userId}
                  onChange={handleChange}
                  placeholder="email or userid"
                  required
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          )}

          <div className="form-actions">
            <button type="submit" disabled={loading}>
              {loading ? 'Please wait...' : mode === 'signup' ? 'Create Account' : 'Login'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default AuthSection;



