import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/axios';

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 7) {
      toast.error('Password must be at least 7 characters');
      return;
    }

    setLoading(true);
    try {
      const res = await api.patch(`/users/reset-password/${token}`, { password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      toast.success('Password reset successful!');
      navigate('/');
      window.location.reload();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2">Reset Password</h1>
        <p className="text-gray-500 text-center mb-8">Enter your new password</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block font-bold mb-2">New Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={7} className="w-full border rounded px-4 py-2 focus:outline-none focus:border-purple-600" />
          </div>
          <div className="mb-6">
            <label className="block font-bold mb-2">Confirm Password</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full border rounded px-4 py-2 focus:outline-none focus:border-purple-600" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-purple-600 text-white py-3 rounded font-bold hover:bg-purple-700 disabled:bg-gray-400">
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          Back to <Link to="/login" className="text-purple-600 font-bold">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default ResetPassword;