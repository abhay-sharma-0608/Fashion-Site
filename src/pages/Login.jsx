import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, useToast } from '../context/AppContext';
import { Eye, EyeOff } from 'lucide-react';
import './Login.css';

export default function Login() {
  const [mode, setMode]         = useState('login'); // 'login' | 'register'
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [form, setForm]         = useState({ name: '', email: '', password: '', phone: '' });

  const { login, register } = useAuth();
  const { addToast }        = useToast();
  const navigate            = useNavigate();

  const set = (k) => (e) => setForm(prev => ({ ...prev, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(form.email, form.password);
        addToast('Welcome back!', 'success');
      } else {
        if (form.password.length < 6) { addToast('Password must be at least 6 characters', 'error'); setLoading(false); return; }
        await register(form.name, form.email, form.password, form.phone);
        addToast('Account created successfully!', 'success');
      }
      navigate(-1);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <Link to="/" className="login-logo">DRAPE</Link>
        <h1 className="login-title">{mode === 'login' ? 'Welcome back' : 'Create account'}</h1>
        <p className="login-sub">{mode === 'login' ? 'Sign in to your account' : 'Join DRAPE for exclusive access'}</p>

        <div className="login-tabs">
          <button className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>Sign In</button>
          <button className={mode === 'register' ? 'active' : ''} onClick={() => setMode('register')}>Register</button>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {mode === 'register' && (
            <>
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" placeholder="John Doe" value={form.name} onChange={set('name')} required />
              </div>
              <div className="form-group">
                <label>Phone (optional)</label>
                <input type="tel" placeholder="9876543210" value={form.phone} onChange={set('phone')} />
              </div>
            </>
          )}
          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="john@example.com" value={form.email} onChange={set('email')} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <div className="password-wrap">
              <input type={showPass ? 'text' : 'password'} placeholder="••••••••" value={form.password} onChange={set('password')} required />
              <button type="button" className="eye-btn" onClick={() => setShowPass(v => !v)}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p className="login-switch">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
            {mode === 'login' ? 'Register' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
}
