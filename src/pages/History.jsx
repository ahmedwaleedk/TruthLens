import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { detectionsAPI } from '../api/api';

const HistoryItemFields = ({ item, index }) => {
  const confPercent = item.confidence <= 1 ? item.confidence * 100 : item.confidence;

  return (
    <>
      <div className="tl-history-card-header">
        <span className="tl-mono tl-text-dim">#{index + 1}</span>
        {item.label === 'Fake' ? (
          <span className="tl-badge-fake">Fake</span>
        ) : item.label === 'Real' ? (
          <span className="tl-badge-real">Real</span>
        ) : (
          <span className="tl-badge-cat">{item.label || 'N/A'}</span>
        )}
      </div>
      <div className="tl-history-card-meta">{item.created_at}</div>
      {item.confidence != null && (
        <div className="d-flex align-items-center gap-2 mb-2">
          <div className="tl-progress flex-grow-1">
            <div
              className={`progress-bar ${item.label === 'Fake' ? 'tl-progress-bar-fake' : 'tl-progress-bar-real'}`}
              role="progressbar"
              style={{ width: `${confPercent <= 100 ? confPercent : 100}%` }}
            />
          </div>
          <span className="tl-mono tl-text-dim" style={{ fontSize: '0.8rem' }}>
            {Math.round(confPercent)}%
          </span>
        </div>
      )}
      {item.text && (
        <div className="tl-history-card-snippet">
          {item.text.substring(0, 200)}
          {item.text.length >= 200 && '…'}
        </div>
      )}
      {item.url && (
        <div className="tl-history-card-detail mb-1">URL: {item.url}</div>
      )}
      {item.image_url && (
        <div className="tl-history-card-detail">Image: {item.image_url}</div>
      )}
    </>
  );
};

const History = () => {
  const [detections, setDetections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDetections();
  }, []);

  const loadDetections = async () => {
    try {
      const response = await detectionsAPI.getAll();
      setDetections(response.data);
    } catch (err) {
      setError('Failed to load detection history.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="tl-page">
        <div className="container">
          <div className="tl-loading">
            <div className="tl-spinner" />
            <span className="tl-loading-text">Loading detection history…</span>
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
            <h1 className="tl-page-title">Detection History</h1>
            <p className="tl-page-subtitle">A timeline of all your TruthLens evaluations.</p>
          </div>
          <Link to="/detect" className="btn tl-btn-primary">New Detection</Link>
        </div>

        {error && (
          <div className="tl-alert tl-alert-warning mb-4">{error}</div>
        )}

        {detections.length > 0 ? (
          <>
            {/* Mobile: card layout */}
            <div className="tl-glass-card d-md-none">
              <div className="tl-history-cards">
                {detections.map((item, index) => (
                  <div key={item.id} className="tl-history-card">
                    <HistoryItemFields item={item} index={index} />
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop: table layout */}
            <div className="tl-glass-card d-none d-md-block">
              <div className="tl-table-wrap">
                <table className="tl-table">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Timestamp (UTC)</th>
                      <th scope="col">Label</th>
                      <th scope="col">Confidence</th>
                      <th scope="col">Text Snippet</th>
                      <th scope="col">URL</th>
                      <th scope="col">Image</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detections.map((item, index) => {
                      const confPercent = item.confidence <= 1 ? item.confidence * 100 : item.confidence;
                      return (
                        <tr key={item.id}>
                          <th scope="row" className="tl-mono">{index + 1}</th>
                          <td className="tl-mono" style={{ fontSize: '0.8rem' }}>{item.created_at}</td>
                          <td>
                            {item.label === 'Fake' ? (
                              <span className="tl-badge-fake">Fake</span>
                            ) : item.label === 'Real' ? (
                              <span className="tl-badge-real">Real</span>
                            ) : (
                              <span className="tl-badge-cat">{item.label || 'N/A'}</span>
                            )}
                          </td>
                          <td>
                            {item.confidence != null ? (
                              <div className="d-flex align-items-center gap-2">
                                <div className="tl-progress flex-grow-1" style={{ minWidth: '60px' }}>
                                  <div
                                    className={`progress-bar ${item.label === 'Fake' ? 'tl-progress-bar-fake' : 'tl-progress-bar-real'}`}
                                    role="progressbar"
                                    style={{ width: `${confPercent <= 100 ? confPercent : 100}%` }}
                                    aria-valuenow={Math.round(confPercent)}
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                  />
                                </div>
                                <span className="tl-mono tl-text-dim" style={{ fontSize: '0.8rem' }}>
                                  {Math.round(confPercent)}%
                                </span>
                              </div>
                            ) : (
                              <span className="tl-text-dim">—</span>
                            )}
                          </td>
                          <td style={{ maxWidth: '220px' }}>
                            {item.text ? (
                              <span style={{ fontSize: '0.82rem' }}>
                                {item.text.substring(0, 200)}
                                {item.text.length >= 200 && '…'}
                              </span>
                            ) : (
                              <span className="tl-text-dim">—</span>
                            )}
                          </td>
                          <td className="text-truncate tl-mono" style={{ maxWidth: '160px', fontSize: '0.78rem' }}>
                            {item.url || '—'}
                          </td>
                          <td className="text-truncate tl-mono" style={{ maxWidth: '160px', fontSize: '0.78rem' }}>
                            {item.image_url || '—'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <div className="tl-glass-card tl-empty-state">
            <h5>No detections yet</h5>
            <p>Run your first detection from the Detect page to start building your history.</p>
            <Link to="/detect" className="btn tl-btn-primary">Start with a New Detection</Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default History;
