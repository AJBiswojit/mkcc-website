import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import MKCCLogo from '../../components/Logo/MKCCLogo';

export default function AdminLogin() {
  const [creds, setCreds] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Ensure there's always a history entry to go back to.
  // If the user landed here directly (no prior history), push '/' first
  // so the mobile back button has somewhere to go.
  useEffect(() => {
    if (window.history.length <= 1) {
      navigate('/', { replace: true });
      navigate('/admin/login');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(creds.username, creds.password);
      toast.success('Welcome back, Admin! 🏏');
      navigate('/admin');
    } catch (err) {
      toast.error('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-mkcc-black flex items-center justify-center px-4"
      style={{ background: 'radial-gradient(ellipse at center, rgba(139,0,0,0.2) 0%, #0A0A0A 60%)' }}>

      {/* Back Button */}
      <button
        onClick={handleBack}
        className="fixed top-4 left-4 flex items-center gap-2 text-mkcc-muted hover:text-white font-heading text-sm uppercase tracking-wider transition-colors group"
      >
        <span className="text-lg group-hover:-translate-x-1 transition-transform inline-block">←</span>
        Back
      </button>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md card-glow bg-mkcc-card rounded-2xl p-8"
      >
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <MKCCLogo size={64} className="drop-shadow-[0_0_15px_rgba(196,30,58,0.5)]" />
          </div>
          <h1 className="font-display text-4xl text-white tracking-widest">ADMIN LOGIN</h1>
          <p className="text-mkcc-muted font-body text-sm mt-1">MKCC Admin Dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-heading text-gray-300 text-xs mb-1.5 uppercase tracking-wider">Username</label>
            <input type="text" required value={creds.username}
              onChange={e => setCreds(c => ({ ...c, username: e.target.value }))}
              placeholder="admin"
              className="w-full bg-mkcc-dark border border-mkcc-border rounded-lg px-4 py-3 text-white font-body focus:border-mkcc-red focus:outline-none focus:ring-1 focus:ring-mkcc-red transition-colors" />
          </div>
          <div>
            <label className="block font-heading text-gray-300 text-xs mb-1.5 uppercase tracking-wider">Password</label>
            <input type="password" required value={creds.password}
              onChange={e => setCreds(c => ({ ...c, password: e.target.value }))}
              placeholder="••••••••"
              className="w-full bg-mkcc-dark border border-mkcc-border rounded-lg px-4 py-3 text-white font-body focus:border-mkcc-red focus:outline-none focus:ring-1 focus:ring-mkcc-red transition-colors" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full text-base py-3">
            {loading ? 'Logging in...' : '🔐 Login to Dashboard'}
          </button>
        </form>

        <p className="text-mkcc-muted text-xs text-center mt-6 font-body">
          Only admin have the access to login
        </p>
      </motion.div>
    </div>
  );
}