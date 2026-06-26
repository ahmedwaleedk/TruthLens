import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    const result = await register(username, password);
    if (result.success) {
      navigate('/login');
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
              <h1 className="tl-page-title">Create your account</h1>
              <p className="tl-page-subtitle mx-auto">Register once to access all detection tools.</p>
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
                      minLength={3}
                      autoComplete="username"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="tl-form-label">Password</label>
                    <input
                      type="password"
                      className="form-control tl-input"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      autoComplete="new-password"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="confirm_password" className="tl-form-label">Confirm Password</label>
                    <input
                      type="password"
                      className="form-control tl-input"
                      id="confirm_password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      autoComplete="new-password"
                    />
                  </div>
                  <div className="d-grid">
                    <button type="submit" className="btn tl-btn-primary">Create Account</button>
                  </div>
                </form>
                <p className="mt-4 mb-0 text-center tl-text-muted">
                  Already have an account?{' '}
                  <Link to="/login" className="tl-auth-link">Login here</Link>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
