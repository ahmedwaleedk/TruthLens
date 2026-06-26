import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { adminAPI } from '../api/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    total_users: 0,
    total_detections: 0,
    fake_count: 0,
    real_count: 0,
  });
  const [detections, setDetections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsRes, detectionsRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getDetections({ limit: 20 }),
      ]);
      setStats(statsRes.data);
      setDetections(detectionsRes.data.detections || detectionsRes.data);
    } catch (err) {
      setError('Failed to load admin data.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this detection?')) {
      return;
    }

    try {
      await adminAPI.deleteDetection(id);
      loadData();
    } catch (err) {
      alert('Failed to delete detection.');
    }
  };

  if (loading) {
    return (
      <section className="tl-page">
        <div className="container">
          <div className="tl-loading">
            <div className="tl-spinner" />
            <span className="tl-loading-text">Loading admin dashboard…</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="tl-page">
      <div className="container">
        <div className="tl-page-header d-flex justify-content-between align-items-start flex-wrap gap-3">
          <div>
            <h1 className="tl-page-title">Admin Dashboard</h1>
            <p className="tl-page-subtitle">System overview and management controls.</p>
          </div>
          <Link to="/" className="btn tl-btn-secondary">Back to Home</Link>
        </div>

        <div className="row g-3 mb-5">
          <div className="col-6 col-md-3">
            <Link to="/admin/users" className="text-decoration-none">
              <div className="tl-admin-link-card">
                <h5>Users</h5>
                <p>Manage users</p>
              </div>
            </Link>
          </div>
          <div className="col-6 col-md-3">
            <Link to="/admin/detections" className="text-decoration-none">
              <div className="tl-admin-link-card">
                <h5>Detections</h5>
                <p>Manage detections</p>
              </div>
            </Link>
          </div>
          <div className="col-6 col-md-3">
            <Link to="/admin/dashboard-items" className="text-decoration-none">
              <div className="tl-admin-link-card">
                <h5>Dashboard Items</h5>
                <p>Manage content</p>
              </div>
            </Link>
          </div>
          <div className="col-6 col-md-3">
            <Link to="/admin/audit-logs" className="text-decoration-none">
              <div className="tl-admin-link-card">
                <h5>Audit Logs</h5>
                <p>View activity logs</p>
              </div>
            </Link>
          </div>
        </div>

        {error && (
          <div className="tl-alert tl-alert-danger mb-4"><strong>Error:</strong> {error}</div>
        )}

        <div className="tl-stat-grid mb-5">
          <div className="tl-stat-card tl-stat-card--violet">
            <div className="tl-stat-label">Total Users</div>
            <div className="tl-stat-value tl-stat-value--violet">{stats.total_users}</div>
          </div>
          <div className="tl-stat-card tl-stat-card--cyan">
            <div className="tl-stat-label">Total Detections</div>
            <div className="tl-stat-value tl-stat-value--cyan">{stats.total_detections}</div>
          </div>
          <div className="tl-stat-card tl-stat-card--danger">
            <div className="tl-stat-label">Fake Detections</div>
            <div className="tl-stat-value tl-stat-value--danger">{stats.fake_count}</div>
          </div>
          <div className="tl-stat-card tl-stat-card--emerald">
            <div className="tl-stat-label">Real Detections</div>
            <div className="tl-stat-value tl-stat-value--emerald">{stats.real_count}</div>
          </div>
        </div>

        <div className="tl-glass-card">
          <div className="card-header px-4 py-3">
            <h5 className="tl-section-title mb-0">Recent Detections (Last 20)</h5>
          </div>
          {detections.length > 0 ? (
            <div className="tl-table-wrap">
              <table className="tl-table">
                <thead>
                  <tr>
                    <th>Created At</th>
                    <th>User</th>
                    <th>Label</th>
                    <th>Confidence</th>
                    <th>Preview</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {detections.map((det) => {
                    const confPercent = det.confidence <= 1 ? det.confidence * 100 : det.confidence;
                    return (
                      <tr key={det.id}>
                        <td className="tl-mono" style={{ fontSize: '0.78rem' }}>
                          {det.created_at ? det.created_at.substring(0, 19) : 'N/A'}
                        </td>
                        <td><span className="tl-badge-cat">{det.user_id}</span></td>
                        <td>
                          {det.label === 'Fake' ? (
                            <span className="tl-badge-fake">Fake</span>
                          ) : det.label === 'Real' ? (
                            <span className="tl-badge-real">Real</span>
                          ) : (
                            <span className="tl-badge-cat">{det.label || 'N/A'}</span>
                          )}
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <div className="tl-progress" style={{ width: '60px' }}>
                              <div
                                className={`progress-bar ${det.label === 'Fake' ? 'tl-progress-bar-fake' : 'tl-progress-bar-real'}`}
                                role="progressbar"
                                style={{ width: `${Math.round(confPercent)}%` }}
                              />
                            </div>
                            <span className="tl-mono tl-text-dim" style={{ fontSize: '0.8rem' }}>
                              {Math.round(confPercent)}%
                            </span>
                          </div>
                        </td>
                        <td style={{ fontSize: '0.82rem' }}>{det.text_snippet}</td>
                        <td>
                          <div className="d-flex gap-1">
                            <button
                              className="btn tl-btn-ghost btn-sm"
                              onClick={() => navigate(`/admin/detections/${det.id}`)}
                            >
                              View
                            </button>
                            <button
                              className="btn tl-btn-danger btn-sm"
                              onClick={() => handleDelete(det.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="tl-empty-state">
              <h5>No detections yet</h5>
              <p className="mb-0">No detection records found in the database.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AdminDashboard;
