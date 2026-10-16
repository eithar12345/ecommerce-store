import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/axios';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post('/users/forgot-password', { email });
      toast.success('Reset link sent! Check your email.');
      setResetToken(res.data.resetToken);
      setSent(true);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Header */}
        <div className="auth-header">
          <div className="auth-icon">
            <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h1 className="auth-title">Forgot Password?</h1>
          <p className="auth-subtitle">
            {sent
              ? 'Check your email for the reset link'
              : "No worries — we'll send you reset instructions."}
          </p>
        </div>

        {/* ===== Form or Success ===== */}
        {!sent ? (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-wrapper">
                <svg className="input-icon" width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="form-input"
                  autoComplete="email"
                  autoFocus
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-gold btn-full auth-submit"
            >
              {loading ? (
                <>
                  <span className="btn-spinner"></span>
                  Sending...
                </>
              ) : (
                <>
                  Send Reset Link
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="forgot-success">
            <div className="forgot-success-icon">✓</div>
            <p className="forgot-success-text">
              If an account exists with <strong>{email}</strong>, you will receive an
              email with reset instructions shortly.
            </p>

            {resetToken && (
              <div className="forgot-dev-box">
                <p className="forgot-dev-label">⚠️ Development Mode</p>
                <p className="forgot-dev-text">
                  Email is disabled. Click below to reset directly:
                </p>
                <Link
                  to={`/reset-password/${resetToken}`}
                  className="btn-gold btn-full"
                  style={{ marginTop: 12 }}
                >
                  Reset Password →
                </Link>
              </div>
            )}

            <button
              onClick={() => {
                setSent(false);
                setEmail('');
                setResetToken('');
              }}
              className="back-btn"
              type="button"
            >
              ← Try another email
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="auth-footer">
          <p>
            Remember your password?{' '}
            <Link to="/login" className="auth-link">
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;