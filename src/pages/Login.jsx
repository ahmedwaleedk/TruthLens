import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const result = await login(username, password);
    if (result.success) {
      if (result.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } else {
      setError(result.error);
    }
  };

  return (
    <section className="tl-auth-bg">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5 col-xl-4">
            <div className="text-center mb-4">
              <h1 className="tl-page-title">Welcome back</h1>
              <p className="tl-page-subtitle mx-auto">Sign in to access TruthLens detections and history.</p>
            </div>

            {error && (
              <div className="tl-alert tl-alert-warning mb-4">{error}</div>
            )}

            <div className="tl-auth-card">
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="username" className="tl-form-label">Username</label>
                    <input
                      type="text"
                      className="form-control tl-input"
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      autoComplete="username"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="password" className="tl-form-label">Password</label>
                    <input
                      type="password"
                      className="form-control tl-input"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                    />
                  </div>
                  <div className="d-grid">
                    <button type="submit" className="btn tl-btn-primary">Login</button>
                  </div>
                </form>
                <p className="mt-4 mb-0 text-center tl-text-muted">
                  Don't have an account?{' '}
                  <Link to="/register" className="tl-auth-link">Register here</Link>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
