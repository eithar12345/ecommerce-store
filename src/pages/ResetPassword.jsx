import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/axios';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error('Passwords do not match');
    }
    setLoading(true);
    try {
      await api.patch(`/users/reset-password/${token}`, { password });
      toast.success('Password reset successfully!');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  // ستايلات الـ CSS جوه الصفحة
  const styles = {
    page: {
      minHeight: '100vh',
      backgroundColor: '#FAF8F5',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'sans-serif'
    },
    logo: {
      textAlign: 'center',
      marginBottom: '30px',
      fontSize: '32px',
      color: '#C49B63',
      fontFamily: 'serif',
      fontWeight: 'bold'
    },
    card: {
      backgroundColor: '#FFFFFF',
      borderRadius: '16px',
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.05)',
      width: '100%',
      maxWidth: '400px',
      padding: '40px',
      border: '1px solid #f0f0f0',
      boxSizing: 'border-box'
    },
    title: {
      textAlign: 'center',
      marginBottom: '30px'
    },
    titleH2: {
      fontSize: '24px',
      color: '#333',
      fontFamily: 'serif',
      margin: '0 0 10px 0'
    },
    titleP: {
      color: '#777',
      fontSize: '14px',
      margin: '0'
    },
    formGroup: {
      marginBottom: '20px'
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '600',
      color: '#333',
      marginBottom: '8px'
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      borderRadius: '10px',
      border: '1px solid #e0e0e0',
      backgroundColor: '#fafafa',
      fontSize: '14px',
      outline: 'none',
      boxSizing: 'border-box',
      transition: 'all 0.3s ease'
    },
    button: {
      width: '100%',
      padding: '14px',
      borderRadius: '10px',
      border: 'none',
      backgroundColor: loading ? '#d1bda3' : '#C49B63',
      color: 'white',
      fontSize: '16px',
      fontWeight: '600',
      cursor: loading ? 'not-allowed' : 'pointer',
      transition: 'background-color 0.3s ease',
      marginTop: '10px'
    },
    backLink: {
      display: 'block',
      textAlign: 'center',
      marginTop: '25px',
      color: '#777',
      fontSize: '14px',
      textDecoration: 'none',
      fontWeight: '500'
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.logo}>
        MyStore
      </div>

      <div style={styles.card}>
        <div style={styles.title}>
          <h2 style={styles.titleH2}>Reset Password</h2>
          <p style={styles.titleP}>Enter your new password below to secure your account.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>New Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              placeholder="Enter new password"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Confirm Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={styles.input}
              placeholder="Confirm new password"
            />
          </div>

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <Link to="/login" style={styles.backLink}>
          ← Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ResetPassword;