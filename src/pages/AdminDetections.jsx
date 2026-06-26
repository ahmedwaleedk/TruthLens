import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { adminAPI } from '../api/api';

const AdminDetections = () => {
  const [detections, setDetections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    user: '',
    label: '',
    search: '',
    startDate: '',
    endDate: '',
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingDetection, setEditingDetection] = useState(null);
  const [editForm, setEditForm] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    loadDetections();
  }, [page, filters]);

  const loadDetections = async () => {
    try {
      const response = await adminAPI.getDetections({ ...filters, page, limit: 20 });
      setDetections(response.data.detections);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.error('Failed to load detections:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
    setPage(1);
  };

  const handleEdit = (detection) => {
    setEditingDetection(detection);
    setEditForm({
      label: detection.label,
      confidence: detection.confidence,
      explanation: detection.explanation,
      text: detection.text,
      url: detection.url,
      image_url: detection.image_url,
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    try {
      await adminAPI.updateDetection(editingDetection.id, editForm);
      setShowEditModal(false);
      setEditingDetection(null);
      loadDetections();
    } catch (err) {
      alert('Failed to update detection.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this detection?')) {
      return;
    }

    try {
      await adminAPI.deleteDetection(id);
      loadDetections();
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
            <h1 className="tl-page-title">Detections Management</h1>
            <p className="tl-page-subtitle">Manage and filter all detections.</p>
          </div>
          <Link to="/admin/dashboard" className="btn tl-btn-secondary">
            Back to Dashboard
          </Link>
        </div>

        <div className="tl-glass-card mb-4">
          <div className="tl-card-body">
            <div className="row g-3">
              <div className="col-md-3">
                <label className="tl-form-label">User</label>
                <input
                  type="text"
                  className="form-control tl-input"
                  value={filters.user}
                  onChange={(e) => handleFilterChange('user', e.target.value)}
                  placeholder="Filter by user"
                />
              </div>
              <div className="col-md-2">
                <label className="tl-form-label">Label</label>
                <select
                  className="form-select tl-input"
                  value={filters.label}
                  onChange={(e) => handleFilterChange('label', e.target.value)}
                >
                  <option value="">All</option>
                  <option value="Fake">Fake</option>
                  <option value="Real">Real</option>
                </select>
              </div>
              <div className="col-md-2">
                <label className="tl-form-label">Start Date</label>
                <input
                  type="date"
                  className="form-control tl-input"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                />
              </div>
              <div className="col-md-2">
                <label className="tl-form-label">End Date</label>
                <input
                  type="date"
                  className="form-control tl-input"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                />
              </div>
              <div className="col-md-3">
                <label className="tl-form-label">Search</label>
                <input
                  type="text"
                  className="form-control tl-input"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  placeholder="Search text/URL"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="tl-glass-card">
          <div className="tl-card-body">
            {detections.length > 0 ? (
              <>
                <div className="tl-table-wrap">
                  <table className="tl-table">
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Label</th>
                        <th>Confidence</th>
                        <th>Text Preview</th>
                        <th>URL</th>
                        <th>Created</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detections.map((det) => (
                        <tr key={det.id}>
                          <td>{det.user_id}</td>
                          <td>
                            {det.label === 'Fake' ? (
                              <span className="tl-badge-fake">{det.label}</span>
                            ) : (
                              <span className="tl-badge-real">{det.label}</span>
                            )}
                          </td>
                          <td>{Math.round(det.confidence * 100)}%</td>
                          <td className="small">{det.text?.substring(0, 50) || '—'}</td>
                          <td className="small text-truncate" style={{ maxWidth: '150px' }}>
                            {det.url || '—'}
                          </td>
                          <td className="small">{new Date(det.created_at).toLocaleDateString()}</td>
                          <td>
                            <div className="d-flex gap-1 flex-wrap">
                              <button
                                className="btn tl-btn-ghost btn-sm"
                                onClick={() => navigate(`/admin/detections/${det.id}`)}
                              >
                                View
                              </button>
                              <button
                                className="btn tl-btn-ghost btn-sm"
                                onClick={() => handleEdit(det)}
                              >
                                Edit
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
                      ))}
                    </tbody>
                  </table>
                </div>
                {totalPages > 1 && (
                  <div className="d-flex justify-content-center mt-3">
                    <button
                      className="btn tl-btn-ghost me-2"
                      disabled={page === 1}
                      onClick={() => setPage(page - 1)}
                    >
                      Previous
                    </button>
                    <span className="align-self-center me-2 tl-text-muted">Page {page} of {totalPages}</span>
                    <button
                      className="btn tl-btn-ghost"
                      disabled={page === totalPages}
                      onClick={() => setPage(page + 1)}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="tl-empty-state py-4">
                <p className="tl-text-muted mb-0">No detections found.</p>
              </div>
            )}
          </div>
        </div>

        {/* Edit Modal */}
        {showEditModal && editingDetection && (
          <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit Detection</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingDetection(null);
                    }}
                  />
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="tl-form-label">Label</label>
                    <select
                      className="form-select tl-input"
                      value={editForm.label}
                      onChange={(e) => setEditForm({ ...editForm, label: e.target.value })}
                    >
                      <option value="Fake">Fake</option>
                      <option value="Real">Real</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="tl-form-label">Confidence (0-1)</label>
                    <input
                      type="number"
                      className="form-control tl-input"
                      min="0"
                      max="1"
                      step="0.01"
                      value={editForm.confidence}
                      onChange={(e) => setEditForm({ ...editForm, confidence: parseFloat(e.target.value) })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="tl-form-label">Explanation</label>
                    <textarea
                      className="form-control tl-input"
                      rows="3"
                      value={editForm.explanation}
                      onChange={(e) => setEditForm({ ...editForm, explanation: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="tl-form-label">Text</label>
                    <textarea
                      className="form-control tl-input"
                      rows="4"
                      value={editForm.text}
                      onChange={(e) => setEditForm({ ...editForm, text: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="tl-form-label">URL</label>
                    <input
                      type="url"
                      className="form-control tl-input"
                      value={editForm.url}
                      onChange={(e) => setEditForm({ ...editForm, url: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="tl-form-label">Image URL</label>
                    <input
                      type="text"
                      className="form-control tl-input"
                      value={editForm.image_url}
                      onChange={(e) => setEditForm({ ...editForm, image_url: e.target.value })}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn tl-btn-secondary"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingDetection(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button type="button" className="btn tl-btn-primary" onClick={handleSaveEdit}>
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AdminDetections;

