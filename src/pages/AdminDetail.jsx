import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { adminAPI } from '../api/api';

const AdminDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [detection, setDetection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDetection();
  }, [id]);

  const loadDetection = async () => {
    try {
      const response = await adminAPI.getDetection(id);
      setDetection(response.data);
    } catch (err) {
      setError('Failed to load detection details.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this detection? This action cannot be undone.')) {
      return;
    }

    try {
      await adminAPI.deleteDetection(id);
      navigate('/admin');
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
            <span className="tl-loading-text">Loading detection…</span>
          </div>
        </div>
      </section>
    );
  }

  if (error || !detection) {
    return (
      <section className="tl-page">
        <div className="container">
          <div className="tl-alert tl-alert-danger mb-4">{error || 'Detection not found'}</div>
          <Link to="/admin" className="btn tl-btn-secondary">Back to Admin</Link>
        </div>
      </section>
    );
  }

  const confPercent = detection.confidence <= 1 ? detection.confidence * 100 : detection.confidence;
  const imageUrl = detection.image_url?.startsWith('uploads/')
    ? `http://localhost:5000/uploads/${detection.image_url.replace('uploads/', '')}`
    : detection.image_url?.startsWith('http')
    ? detection.image_url
    : detection.image_url
    ? `http://localhost:5000/${detection.image_url}`
    : null;

  return (
    <section className="tl-page">
      <div className="container">
        <div className="tl-page-header d-flex justify-content-between align-items-start flex-wrap gap-3">
          <div>
            <h1 className="tl-page-title">Detection Details</h1>
            <p className="tl-page-subtitle">Complete information about this detection record.</p>
          </div>
          <Link to="/admin" className="btn tl-btn-secondary">Back to Admin</Link>
        </div>

        <div className="row">
          <div className="col-lg-8 mx-auto">
            <div className="tl-glass-card">
              <div className="card-header px-4 py-3">
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                  <h5 className="tl-section-title mb-0">
                    ID: <code className="tl-mono tl-text-cyan">{detection.id}</code>
                  </h5>
                  {detection.label === 'Fake' ? (
                    <span className="tl-badge-fake fs-6">Fake</span>
                  ) : (
                    <span className="tl-badge-real fs-6">Real</span>
                  )}
                </div>
              </div>
              <div className="tl-card-body">
                <div className="row mb-4">
                  <div className="col-md-6">
                    <div className="tl-text-dim small mb-1">User ID</div>
                    <span className="tl-badge-cat">{detection.user_id}</span>
                  </div>
                  <div className="col-md-6">
                    <div className="tl-text-dim small mb-1">Confidence</div>
                    <div className="d-flex align-items-center gap-2">
                      <div className="tl-progress flex-grow-1">
                        <div
                          className={`progress-bar ${detection.label === 'Fake' ? 'tl-progress-bar-fake' : 'tl-progress-bar-real'}`}
                          role="progressbar"
                          style={{ width: `${Math.round(confPercent)}%` }}
                        />
                      </div>
                      <span className="tl-mono tl-text-cyan">{confPercent.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="tl-text-dim small mb-1">Created At</div>
                  <div className="tl-mono tl-text-muted">{detection.created_at}</div>
                </div>

                {detection.text && (
                  <div className="mb-4">
                    <div className="tl-text-dim small mb-2">Text Input</div>
                    <div className="tl-glass p-3 rounded" style={{ border: '1px solid var(--tl-border)' }}>
                      <p className="mb-0 tl-text-muted">{detection.text}</p>
                    </div>
                  </div>
                )}

                {detection.url && (
                  <div className="mb-4">
                    <div className="tl-text-dim small mb-1">URL</div>
                    <a href={detection.url} target="_blank" rel="noopener noreferrer" className="tl-news-link">
                      {detection.url}
                    </a>
                  </div>
                )}

                {detection.image_url && detection.image_url.trim() && (
                  <div className="mb-4">
                    <div className="tl-text-dim small mb-1">Image</div>
                    <code className="tl-mono tl-text-muted d-block mb-2">{detection.image_url}</code>
                    {imageUrl && (
                      <img
                        src={imageUrl}
                        alt="Detection"
                        className="rounded"
                        style={{ maxWidth: '300px', border: '1px solid var(--tl-border)' }}
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    )}
                  </div>
                )}

                {detection.explanation && (
                  <div className="mb-0">
                    <div className="tl-text-dim small mb-2">Explanation</div>
                    <div className="tl-glass p-3 rounded" style={{ border: '1px solid var(--tl-border)' }}>
                      <p className="mb-0 tl-text-muted">{detection.explanation}</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="card-footer px-4 py-3">
                <button className="btn tl-btn-danger" onClick={handleDelete}>
                  Delete Detection
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminDetail;
