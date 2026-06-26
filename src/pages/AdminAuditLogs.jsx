import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../api/api';

const AdminAuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    actor: '',
    action: '',
    targetType: '',
    startDate: '',
    endDate: '',
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadLogs();
  }, [page, filters]);

  const loadLogs = async () => {
    try {
      const response = await adminAPI.getAuditLogs({ ...filters, page, limit: 50 });
      setLogs(response.data.logs);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
    setPage(1);
  };

  if (loading) {
    return (
      <section className="tl-page">
        <div className="container">
          <div className="tl-loading">
            <div className="tl-spinner" />
            <span className="tl-loading-text">Loading…</span>
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
            <h1 className="tl-page-title">Audit Logs</h1>
            <p className="tl-page-subtitle">View all system activity and admin actions.</p>
          </div>
          <Link to="/admin/dashboard" className="btn tl-btn-secondary">Back to Dashboard</Link>
        </div>

        <div className="tl-glass-card mb-4">
          <div className="tl-card-body">
            <div className="row g-3">
              <div className="col-md-3">
                <label className="tl-form-label">Actor</label>
                <input type="text" className="form-control tl-input"
                  value={filters.actor}
                  onChange={(e) => handleFilterChange('actor', e.target.value)}
                  placeholder="Filter by username"
                />
              </div>
              <div className="col-md-3">
                <label className="tl-form-label">Action</label>
                <input type="text" className="form-control tl-input"
                  value={filters.action}
                  onChange={(e) => handleFilterChange('action', e.target.value)}
                  placeholder="Filter by action"
                />
              </div>
              <div className="col-md-2">
                <label className="tl-form-label">Target Type</label>
                <select className="form-select tl-input"
                  value={filters.targetType}
                  onChange={(e) => handleFilterChange('targetType', e.target.value)}
                >
                  <option value="">All</option>
                  <option value="user">User</option>
                  <option value="detection">Detection</option>
                  <option value="dashboard_item">Dashboard Item</option>
                  <option value="audit_log">Audit Log</option>
                  <option value="system">System</option>
                </select>
              </div>
              <div className="col-md-2">
                <label className="tl-form-label">Start Date</label>
                <input type="date" className="form-control tl-input"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                />
              </div>
              <div className="col-md-2">
                <label className="tl-form-label">End Date</label>
                <input type="date" className="form-control tl-input"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="tl-glass-card">
          <div className="tl-card-body">
            {logs.length > 0 ? (
              <>
                <div className="tl-table-wrap">
                  <table className="tl-table">
                    <thead>
                      <tr>
                        <th>Timestamp</th>
                        <th>Actor</th>
                        <th>Action</th>
                        <th>Target Type</th>
                        <th>Target ID</th>
                        <th>Meta</th>
                      </tr>
                    </thead>
                    <tbody>
                      {logs.map((log) => (
                        <tr key={log.id}>
                          <td className="small">{new Date(log.timestamp).toLocaleString()}</td>
                          <td><strong>{log.actor_username}</strong></td>
                          <td>
                            <span className="tl-badge-cat">{log.action}</span>
                          </td>
                          <td>{log.target_type || '—'}</td>
                          <td className="small font-monospace">{log.target_id || '—'}</td>
                          <td className="small">
                            {log.meta && Object.keys(log.meta).length > 0 ? (
                              <details>
                                <summary>View</summary>
                                <pre className="mt-2 small">{JSON.stringify(log.meta, null, 2)}</pre>
                              </details>
                            ) : (
                              '—'
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {totalPages > 1 && (
                  <div className="d-flex justify-content-center mt-3">
                    <button className="btn tl-btn-ghost me-2" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
                    <span className="align-self-center me-2 tl-text-muted">Page {page} of {totalPages}</span>
                    <button className="btn tl-btn-ghost" disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
                  </div>
                )}
              </>
            ) : (
              <div className="tl-empty-state py-4">
                <p className="tl-text-muted mb-0">No audit logs found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminAuditLogs;

